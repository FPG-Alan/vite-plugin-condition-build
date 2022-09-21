import { createFilter, FilterPattern } from "@rollup/pluginutils";

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
function removeCodeWithCondition(code: string, condition: RegExp): string {
  return code.replace(condition, "");
}
type ConditionBuildOptions = {
  include?: FilterPattern;
  exclude?: FilterPattern;
};

function conditionBuild(options: ConditionBuildOptions = {}) {
  let config;
  let condition: RegExp;

  const filter = createFilter(options.include, options.exclude);

  return {
    name: "condition-complie",
    // ensure we get vanilla version
    enforce: "pre",

    configResolved(resolvedConfig: any) {
      // store the resolved config
      config = resolvedConfig;

      if (config.env.VITE_SERVE_KIND) {
        condition = new RegExp(
          `\\/\\/\\s*#if\\s*\\(SERVE_KIND\\s*==\\s"(?!${config.env.VITE_SERVE_KIND}).*"\\)[\\s\\S]*?\\/\\/\\s*#endif`,
          "g"
        );

        console.log(condition);
      }
    },
    transform(code: string, id: string) {
      if (!filter(id)) return;
      if (id.includes(slash(path.resolve("./src"))) && condition) {
        const tmpStr = removeCodeWithCondition(code, condition);
        return {
          code: tmpStr,
          map: null,
        };
      }
    },
  };
}

export default conditionBuild;
