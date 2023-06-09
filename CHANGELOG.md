# Changelog


## v0.0.4

[compare changes](https://github.com/nyxblabs/luminar/compare/v0.0.4...v0.0.4)


### 📖 Documentation

  - **README.md:** Add note explaining the meaning of 'Luminar' The note explains that 'Luminar' is a symbolic name for 'Flags' and is based on the word 'lumen' which means light, symbolizing clarity and illumination. It also indicates that the package provides transparency and understanding of the command line arguments. ([d1984d9](https://github.com/nyxblabs/luminar/commit/d1984d9))

### 🏡 Chore

  - **.nvmrc:** Remove .nvmrc file The .nvmrc file was removed, which is no longer needed as the project has been migrated to a different version manager. ([c3946c1](https://github.com/nyxblabs/luminar/commit/c3946c1))
  - **package.json:** Add new devDependencies to improve development experience The following devDependencies were added to improve the development experience: - @nyxb/eslint-config: a custom eslint configuration for the project - @types/node: provides TypeScript definitions for Node.js - @vitest/coverage-c8: a code coverage tool for the project - buildkarium: a tool for building and packaging the project - clean-pkg-json: a tool for cleaning up the package.json file - consolji: a tool for logging - dynot: a tool for managing DynamoDB tables - tsd: a tool for managing TypeScript definitions - typescript: the TypeScript compiler - vitest: a testing framework for the project ([c97fcf4](https://github.com/nyxblabs/luminar/commit/c97fcf4))

### ❤️  Contributors

- Nyxb <contact@nyxb.xyz>

## v0.0.3

[compare changes](https://github.com/nyxblabs/luminar/compare/v0.0.2...v0.0.3)


### 🏡 Chore

  - Fix typos ([64071c0](https://github.com/nyxblabs/luminar/commit/64071c0))
  - **github-assets:** Add cover image for Luminar organization The commit adds a new cover image for the Luminar organization in the .github/assets directory. This image will be used as the cover image for the Luminar organization on GitHub. ([3d03040](https://github.com/nyxblabs/luminar/commit/3d03040))
  - **package.json:** Add new scripts for build, linting, and testing Added new scripts for build, linting, and testing to improve the development workflow. The `prepack` script was also added to run the build and clean-pkg-json scripts before packaging. ([79faf01](https://github.com/nyxblabs/luminar/commit/79faf01))

### ❤️  Contributors

- Nyxb <contact@nyxb.xyz>

## v0.0.2


### 🚀 Enhancements

  - **get-luminar.ts): add getLuminar function to parse luminars from argv 🎉 feat(index.ts): export getLuminar function 🎉 feat(luminar.ts): add typeLuminar function to parse luminars from argv 🎉 feat(types.ts:** Add types for luminar schemas, luminar types, and parsed luminars The getLuminar function is added to parse luminars from argv. The function takes in a list of luminar names, a luminar type, and an optional argv array. The function returns the parsed luminars. The index.ts file is updated to export the getLuminar function. The typeLuminar function is added to parse luminars from argv. The function takes in a luminar schema and an optional argv array. The function returns the parsed luminars. The types.ts file is updated to add types for luminar schemas, luminar types ([333eb48](https://github.com/nyxblabs/luminar/commit/333eb48))
  - **luminar.test.ts:** Add tests for getLuminar function This commit adds tests for the getLuminar function, which is responsible for parsing command line arguments and returning the corresponding values. The tests cover various scenarios, such as getting a number, a boolean, an alias group, and ignoring irrelevant arguments. The purpose of these tests is to ensure that the function works as expected and to prevent regressions in future changes. ([8bb9497](https://github.com/nyxblabs/luminar/commit/8bb9497))
  - **luminar.test-d.ts:** Add type checking for luminar options This commit adds type checking for luminar options using the tsd library. The ExpectedType interface is used to define the expected types of the parsed luminar options. This ensures that the luminar options are correctly parsed and that the expected types are returned. ([5f11c37](https://github.com/nyxblabs/luminar/commit/5f11c37))
  - **luminar.test-d.ts:** Add type checking for luminar options This commit adds type checking for luminar options using the tsd library. The ExpectedType interface is used to define the expected types of the parsed luminar options. This ensures that the luminar options are correctly parsed and that the expected types are returned. ([dc31616](https://github.com/nyxblabs/luminar/commit/dc31616))

### 🩹 Fixes

  - **package.json:** Update test script to use correct command for running tests The test script was updated to use the correct command for running tests. The command was changed from "vitest --coverage" to "vitest run --coverage". This ensures that the tests are run with coverage reporting. ([bf84ee5](https://github.com/nyxblabs/luminar/commit/bf84ee5))

### 💅 Refactors

  - **argv-iterator.ts:** Remove unnecessary whitespace and fix type formatting This commit removes unnecessary whitespace and fixes the formatting of the Index type in the argv-iterator.ts file. No functionality has been changed. ([39df415](https://github.com/nyxblabs/luminar/commit/39df415))
  - **get-luminar.ts): remove unnecessary semicolons and whitespace to improve code readability 🚀 feat(index.ts:** Export all modules from the src directory to improve code organization The changes in get-luminar.ts are purely cosmetic, removing unnecessary semicolons and whitespace to improve code readability. In index.ts, all modules from the src directory are now exported, improving code organization and making it easier to import modules from the package. ([861f074](https://github.com/nyxblabs/luminar/commit/861f074))
  - **types.ts:** Remove semicolons and trailing whitespaces, fix indentation and add missing types This commit removes semicolons and trailing whitespaces, fixes indentation, and adds missing types to improve code readability. ([2ca028d](https://github.com/nyxblabs/luminar/commit/2ca028d))
  - **luminar.ts:** Improve code readability by using consistent indentation and whitespace The changes in this commit are purely cosmetic and do not affect the functionality of the code. The code has been reformatted to use consistent indentation and whitespace to improve readability. ([d845fa3](https://github.com/nyxblabs/luminar/commit/d845fa3))

### 🏡 Chore

  - **package.json): add @types/node as a dev dependency ✨ feat(argv-iterator.ts:** Add support for luminar arguments and aliases The @types/node package was added as a dev dependency to provide type definitions for Node.js. The argvIterator function now supports luminar arguments and aliases. The parseLuminarArgv function parses luminar arguments and returns an array with the luminar name, value, and whether it is an alias. The spliceFromArgv function removes elements from the argv array based on the provided index. ([00e65cd](https://github.com/nyxblabs/luminar/commit/00e65cd))
  - **package.json): update repository and funding links, add scripts and devDependencies 🔧 chore(tsconfig.json:** Add trailing comma to compilerOptions The repository and funding links have been updated to reflect the new repository name. Scripts and devDependencies have been added to the package.json file to improve the development experience. A trailing comma has been added to the compilerOptions in the tsconfig.json file to improve readability. ([2b8f347](https://github.com/nyxblabs/luminar/commit/2b8f347))
  - **package.json:** Add release script to automate the release process The release script has been added to automate the release process. The script runs linting, testing, and creates a new release using the nyxlx package. It then pushes the changes to the main branch and publishes the package to the registry. This will save time and reduce the risk of human error during the release process. ([2216d9b](https://github.com/nyxblabs/luminar/commit/2216d9b))
  - **package.json): add consolji package as a dependency 🎉 feat(count-luminars.ts): add example to count the number of flags 🎉 feat(custom-type.ts): add example to demonstrate how to create a custom type 🎉 feat(dot-nested.ts): add example to demonstrate how to create a dot-nested object 🎉 feat(invert-boolean.ts:** Add example to demonstrate how to invert a boolean flag The `consolji` package is added as a dependency to the project. Four new examples are added to the project to demonstrate the usage of the `typeFlag` function. The `count-luminars.ts` example demonstrates how to count the number of flags. The `custom-type.ts` example demonstrates how to create a custom type. The `dot-nested.ts` example demonstrates how to create a dot-nested object. The `invert-boolean.ts` example demonstrates how to invert ([aa70136](https://github.com/nyxblabs/luminar/commit/aa70136))
  - **.eslintignore): add package.json and tsconfig.json to eslintignore 🔧 chore(.eslintrc): add rules and settings for react version and disable @next/next/no-html-link-for-pages rule 🚀 chore(package.json:** Update release script to use latest version of changelogen The changes to .eslintignore and .eslintrc are configuration changes to the linter. The addition of package.json and tsconfig.json to .eslintignore means that these files will be ignored by the linter. The addition of rules and settings for react version and disabling of @next/next/no-html-link-for-pages rule in .eslintrc improves the linting process. The update to the release script in package.json is to use the latest version of changelogen. ([4fd8f40](https://github.com/nyxblabs/luminar/commit/4fd8f40))

### 🎨 Styles

  - **utils.ts): format code with consistent indentation and remove unnecessary semicolons 💄 refactor(utils.ts): simplify the isReadonlyArray function by removing the parentheses around the argument 💄 refactor(utils.ts): simplify the hasOwn function by removing the parentheses around the argument 💄 refactor(utils.ts): simplify the normalizeBoolean function by removing the unnecessary if statement 💄 refactor(utils.ts): simplify the applyParser function by removing the unnecessary if statement 💄 refactor(utils.ts): simplify the validateLuminarName function by removing the unnecessary parentheses around the argument 💄 refactor(utils.ts): simplify the createRegistry function by removing the unnecessary parentheses around the arguments 💄 refactor(utils.ts:** Simplify the finalizeLuminars function by removing the unnecessary parentheses around the arguments These changes improve the readability and maintainability of the code by removing unnecessary syntax and formatting the code with consistent indentation. ([825add7](https://github.com/nyxblabs/luminar/commit/825add7))

### ❤️  Contributors

- Nyxb <contact@nyxb.xyz>

