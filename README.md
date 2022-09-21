# ts lib starter

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://makeapullrequest.com)

A library starter template use Typescript and Rollup, inspired by [The best Rollup config for TypeScript libraries](https://gist.github.com/aleclarson/9900ed2a9a3119d865286b218e14d226)

# Feature

- Bundle by `Rollup`, use `Esbuild` as TS compilers and minifier [rollup-plugin-esbuild](https://github.com/egoist/rollup-plugin-esbuild#rollup-plugin-esbuild)
- Automaticlly `.d.ts` definition files by dts plugin [rollup-plugin-dts](https://github.com/Swatinem/rollup-plugin-dts)
- Example page powered by Vite, out of box
- use PNPM as package manager
- Use Jest as test framefork
- Commitizen friendly

# Usage

1. install

```
pnpm dlx degit --force https://github.com/FPG-Alan/ts-lib-starter
```

2. modify value of `[name/main/module/typings]` in package.json with your lib name

3. modify value of dep in example's package.json
