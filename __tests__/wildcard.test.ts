import conditionBuild from "../src";
import { slash } from "../src/utils";

const path = require("path");

describe("wildcard", () => {
  const plugin = conditionBuild();
  const id = `${slash(path.resolve("./src"))}/test.ts`;
  test("base", () => {
    const code = `
    function test1(){
      const result = a.c();
      // #if (SERVE_KIND == "console.*")
      const kernelResult = a.kernel();
      // #endif
    }
    `;
    const id = `${slash(path.resolve("./src"))}/test.ts`;
    plugin.configResolved({ env: { VITE_SERVE_KIND: "manage" } });
    const result = plugin.transform(code, id)?.code.replace(/[\r\n]|\s/g, "");
    expect(result).toBe(
      `
      function test1(){
        const result = a.c();
      }
      `.replace(/[\r\n]|\s/g, "")
    );
  });

  test("base-match1", () => {
    const code = `
    function test1(){
      const result = a.c();
      // #if (SERVE_KIND == "console.*")
      const kernelResult = a.kernel();
      // #endif
    }
    `;
    const id = `${slash(path.resolve("./src"))}/test.ts`;
    plugin.configResolved({ env: { VITE_SERVE_KIND: "console" } });
    const result = plugin.transform(code, id)?.code.replace(/[\r\n]|\s/g, "");
    expect(result).toBe(
      `
      function test1(){
        const result = a.c();
        // #if (SERVE_KIND == "console.*")
        const kernelResult = a.kernel();
        // #endif
      }
      `.replace(/[\r\n]|\s/g, "")
    );
  });
  test("base-match2", () => {
    const code = `
    function test1(){
      const result = a.c();
      // #if (SERVE_KIND == "console.*")
      const kernelResult = a.kernel();
      // #endif
    }
    `;
    const id = `${slash(path.resolve("./src"))}/test.ts`;
    plugin.configResolved({ env: { VITE_SERVE_KIND: "console.shopify" } });
    const result = plugin.transform(code, id)?.code.replace(/[\r\n]|\s/g, "");
    expect(result).toBe(
      `
      function test1(){
        const result = a.c();
        // #if (SERVE_KIND == "console.*")
        const kernelResult = a.kernel();
        // #endif
      }
      `.replace(/[\r\n]|\s/g, "")
    );
  });
  test("base-match3", () => {
    const code = `
    function test1(){
      const result = a.c();
      // #if (SERVE_KIND == "console.*")
      const kernelResult = a.kernel();
      // #endif
    }
    `;
    const id = `${slash(path.resolve("./src"))}/test.ts`;
    plugin.configResolved({ env: { VITE_SERVE_KIND: "console.shopify.a.c" } });
    const result = plugin.transform(code, id)?.code.replace(/[\r\n]|\s/g, "");
    expect(result).toBe(
      `
      function test1(){
        const result = a.c();
        // #if (SERVE_KIND == "console.*")
        const kernelResult = a.kernel();
        // #endif
      }
      `.replace(/[\r\n]|\s/g, "")
    );
  });
  test("base-not match1", () => {
    const code = `
    function test1(){
      const result = a.c();
      // #if (SERVE_KIND == "console.shopify")
      const kernelResult = a.kernel();
      // #endif
    }
    `;
    const id = `${slash(path.resolve("./src"))}/test.ts`;
    plugin.configResolved({ env: { VITE_SERVE_KIND: "console" } });
    const result = plugin.transform(code, id)?.code.replace(/[\r\n]|\s/g, "");
    expect(result).toBe(
      `
      function test1(){
        const result = a.c();
      }
      `.replace(/[\r\n]|\s/g, "")
    );
  });
  test("base-not match2", () => {
    const code = `
    function test1(){
      const result = a.c();
      // #if (SERVE_KIND == "console.shopify")
      const kernelResult = a.kernel();
      // #endif
    }
    `;
    plugin.configResolved({ env: { VITE_SERVE_KIND: "manage.shopify" } });
    const result = plugin.transform(code, id)?.code.replace(/[\r\n]|\s/g, "");
    expect(result).toBe(
      `
      function test1(){
        const result = a.c();
      }
      `.replace(/[\r\n]|\s/g, "")
    );
  });

  test("multi", () => {
    const code = `
    function test1() {
      const result = a.c();
      // #if (SERVE_KIND == "console.*")
      const kernelResult = a.kernel();
      // #endif
      // #if (SERVE_KIND == "console.shopify")
      const shopifyResult = a.shopify();
      // #endif
      // #if (SERVE_KIND == "manage")
      const manageResult = a.manage();
      // #endif
    }
    `;
    plugin.configResolved({ env: { VITE_SERVE_KIND: "console.shopify" } });
    const result = plugin.transform(code, id)?.code.replace(/[\r\n]|\s/g, "");
    expect(result).toBe(
      `
      function test1() {
        const result = a.c();
        // #if (SERVE_KIND == "console.*")
        const kernelResult = a.kernel();
        // #endif
        // #if (SERVE_KIND == "console.shopify")
        const shopifyResult = a.shopify();
        // #endif
      }
      `.replace(/[\r\n]|\s/g, "")
    );
  });
});
