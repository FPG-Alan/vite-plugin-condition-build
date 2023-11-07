import conditionBuild from "../src";
import { slash } from "../src/utils";

const path = require("path");

describe("operator", () => {
  const plugin = conditionBuild();
  const id = `${slash(path.resolve("./src"))}/test.ts`;
  test("base-not equal operator and not meet serve condition", () => {
    const code = `
    function test1(){
      const result = a.c();
      // #if (SERVE_KIND != "console.*")
      const kernelResult = a.kernel();
      // #endif
    }
    `;
    plugin.configResolved({ env: { VITE_SERVE_KIND: "manage" } });
    const result = plugin.transform(code, id)?.code.replace(/[\r\n]|\s/g, "");
    expect(result).toBe(
      `
      function test1(){
        const result = a.c();
        // #if (SERVE_KIND != "console.*")
        const kernelResult = a.kernel();
        // #endif
      }
      `.replace(/[\r\n]|\s/g, "")
    );
  });

  test("base-not equal operator and meeted serve condition", () => {
    const code = `
    function test1(){
      const result = a.c();
      // #if (SERVE_KIND != "console.*")
      const kernelResult = a.kernel();
      // #endif
    }
    `;
    plugin.configResolved({ env: { VITE_SERVE_KIND: "console.shopify" } });
    const result = plugin.transform(code, id)?.code.replace(/[\r\n]|\s/g, "");
    expect(result).toBe(
      `
      function test1(){
        const result = a.c();
      }
      `.replace(/[\r\n]|\s/g, "")
    );
  });
});
