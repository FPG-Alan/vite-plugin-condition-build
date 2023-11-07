# vite-plugin-condition-build

A vite plugin that remove codes according env variable druing build.

## When to use

When you want to build your code into multiple versions and add or remove some specific code between versions

## Install

```
pnpm install vite-plugin-condition-build
```

## Usage

First you need to configure the `VITE_SERVE_KIND` field in the env file, the specific value is up to you. Like this:

```
VITE_SERVE_KIND=manage
```

Next in the code use block comments to circle the code that only needs to appear under a certain SERVER_KIND:

```js
// some code
const a = 1;
// ...
// #if (SERVE_KIND == "console")
const foo = "bar";
// #endif
// ...
const b = 2;
// #if (SERVE_KIND == "manage")
const bar = "foo";
// #endif
// other code
```

Finally, the code you build will looks like this:

```js
// some code
const a = 1;
// ...
const b = 2;
// #if (SERVE_KIND == "manage")
const bar = "foo";
// #endif
// other code
```

beside "==", you can use "!=" in the comment:

```js
// some code
const a = 1;
// ...
// #if (SERVE_KIND != "console")
const foo = "bar";
// #endif
// ...
const b = 2;
// #if (SERVE_KIND != "manage")
const bar = "foo";
// #endif
// other code
```

and then the output will be:

```js
// some code
const a = 1;
// ...
// #if (SERVE_KIND != "console")
const foo = "bar";
// #endif
// ...
const b = 2;
// other code
```

### Wildcard

You can even use "\*" in comment as wildcard:

```env
VITE_SERVE_KIND=console.lite
```

```js
// some code
const a = 1;
// ...
// #if (SERVE_KIND == "console.*")
const foo = "bar";
// #endif
// ...
const b = 2;
// #if (SERVE_KIND == "manage")
const bar = "foo";
// #endif
// other code
```

output:

```js
// some code
const a = 1;
// ...
const b = 2;
// #if (SERVE_KIND == "console.*")
const bar = "foo";
// #endif
// other code
```
