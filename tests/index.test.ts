import conditionBuild from "../src";
const path = require("path");

function slash(path: string) {
  const isExtendedLengthPath = /^\\\\\?\\/.test(path);
  // eslint-disable-next-line no-control-regex
  const hasNonAscii = /[^\u0000-\u0080]+/.test(path);

  if (isExtendedLengthPath || hasNonAscii) {
    return path;
  }

  return path.replace(/\\/g, "/");
}

describe("index", () => {
  const plugin = conditionBuild();

  test("base", () => {
    const code = `
    function test1(){
      const result = a.c();
      // #if (SERVE_KIND == "manage")
      const kernelResult = a.kernel();
      // #endif
    }
    `;
    const id = `${slash(path.resolve("./src"))}/test.ts`;
    plugin.configResolved({ env: { VITE_SERVE_KIND: "console" } });
    const result = plugin.transform(code, id)?.code.replace(/[\r\n]|\s/g, "");
    expect(result).toBe(
      `function test1(){const result = a.c();}`.replace(/[\r\n]|\s/g, "")
    );
  });

  test("multi line", () => {
    const code = `
    function test1(){
      const result = a.c();
      // #if (SERVE_KIND == "manage")
      const kernelResult = a.kernel();
      const line1 = 'line1';
      const line2 = 'line2';
      // #endif
    }
    `;
    const id = `${slash(path.resolve("./src"))}/test.ts`;
    plugin.configResolved({ env: { VITE_SERVE_KIND: "console" } });
    const result = plugin.transform(code, id)?.code.replace(/[\r\n]|\s/g, "");
    expect(result).toBe(
      `function test1() {
        const result = a.c();

      }`.replace(/[\r\n]|\s/g, "")
    );
  });

  test("multi comment", () => {
    const code = `
    function test1(){
      const result = a.c();
      // #if (SERVE_KIND == "manage")
      const kernelResult = a.kernel();
      const line1 = 'line1';
      const line2 = 'line2';
          // #endif
          const line3 = 'line3';
          "aaaaaa"
          1+1
          a.n();
          // #if (SERVE_KIND == "manage")
          const line5 = 'line5';
          // #endif
          abcd
    }
    `;
    const id = `${slash(path.resolve("./src"))}/test.ts`;
    plugin.configResolved({ env: { VITE_SERVE_KIND: "console" } });
    const result = plugin.transform(code, id)?.code.replace(/[\r\n]|\s/g, "");
    expect(result).toBe(
      `function test1() {
        const result = a.c();

        const line3 = 'line3';
        "aaaaaa"
        1 + 1
        a.n();
        abcd
      }`.replace(/[\r\n]|\s/g, "")
    );
  });

  test("nest comments", () => {
    const code = `
    import a from 'a';
    /**
    * here is blabla
    */
    // #if (SERVE_KIND == "manage")

    import b  from 'b';
    import c  from 'c';
    import d  from 'd';import e  from 'e';
    // #endif
    `;
    const id = `${slash(path.resolve("./src"))}/test.ts`;
    plugin.configResolved({ env: { VITE_SERVE_KIND: "console" } });
    const result = plugin.transform(code, id)?.code.replace(/[\r\n]|\s/g, "");
    expect(result).toBe(
      `import a from 'a';
      /**
       * here is blabla
       */
      `.replace(/[\r\n]|\s/g, "")
    );
  });

  test("nest comments - anti", () => {
    const code = `
    // #if (SERVE_KIND == "manage")
    /**
    * here is blabla
    */
    import b  from 'b';
    import c  from 'c';
    import d  from 'd';import e  from 'e';
    // #endif
    l = 2;
    `;
    const id = `${slash(path.resolve("./src"))}/test.ts`;
    plugin.configResolved({ env: { VITE_SERVE_KIND: "console" } });
    const result = plugin.transform(code, id)?.code.replace(/[\r\n]|\s/g, "");
    expect(result).toBe(
      `
      l = 2;
      `.replace(/[\r\n]|\s/g, "")
    );
  });
  test("nest instruction line comments, not support, just check what happened", () => {
    const code = `
            const a = 1;
            // #if (SERVE_KIND == "manage")
            function test(){
                const b = 2;
                // #if (SERVE_KIND == "manage")
                const c = 3;
                console.log(a+b+c);
                // #endif
            }
            test();
            // #endif
    `;
    const id = `${slash(path.resolve("./src"))}/test.ts`;
    plugin.configResolved({ env: { VITE_SERVE_KIND: "console" } });
    const result = plugin.transform(code, id)?.code.replace(/[\r\n]|\s/g, "");
    expect(result).toBe(
      `
      const a = 1; }

      test(); // #endif
      `.replace(/[\r\n]|\s/g, "")
    );
  });

  test("realworld test - 1", () => {
    const code = `
    export default function buildAppRoutes() {
        return [dashboardRegisterRoutes()].concat(
            notificationRegisterRoutes(),
            deploymentRoutes(),
            // #if (SERVE_KIND == "manage")
            stewardRoutes(),
            userAuditorRoutes(),
            auditedDomainRoutes(),
            // #endif
            [a]
        );
    }
    `;
    const id = `${slash(path.resolve("./src"))}/test.ts`;
    plugin.configResolved({ env: { VITE_SERVE_KIND: "console" } });
    const result = plugin.transform(code, id)?.code.replace(/[\r\n]|\s/g, "");
    expect(result).toBe(
      `
      export default function buildAppRoutes() {
        return [dashboardRegisterRoutes()].concat(
            notificationRegisterRoutes(),
            deploymentRoutes(),
            [a]
        );
      }
      `.replace(/[\r\n]|\s/g, "")
    );
  });

  test("realworld test - 2", () => {
    const code = `
          let realmMenus;
          // #if (SERVE_KIND == "manage")
          const systemMenus = createSystemMenus();
          realmMenus = createRealmMenus(systemMenus.length > 0);
          // #endif
          const interflowMenus = createInterflowMenus();
          realmMenus = createRealmMenus(false);
    `;
    const id = `${slash(path.resolve("./src"))}/test.ts`;
    plugin.configResolved({ env: { VITE_SERVE_KIND: "console" } });
    const result = plugin.transform(code, id)?.code.replace(/[\r\n]|\s/g, "");
    expect(result).toBe(
      `
            let realmMenus;

            const interflowMenus = createInterflowMenus();
            realmMenus = createRealmMenus(false);
      `.replace(/[\r\n]|\s/g, "")
    );
  });

  test("realworld test - 3", () => {
    const code = `
    // #if (SERVE_KIND == "console")
    console.log("user ");
    // #endif
    aa
    // #if (SERVE_KIND == "manage")
    console.log("kernel ");
    // #endif
    `;
    const id = `${slash(path.resolve("./src"))}/test.ts`;
    plugin.configResolved({ env: { VITE_SERVE_KIND: "console" } });
    const result = plugin.transform(code, id)?.code;
    console.log(result);
    expect(result?.replace(/[\r\n]|\s/g, "")).toBe(
      `
      // #if (SERVE_KIND == "console")
      console.log("user "); 
      // #endif
      aa
      `.replace(/[\r\n]|\s/g, "")
    );
  });
});
