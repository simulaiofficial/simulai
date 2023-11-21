# Contributing to Simulai

Thank you for your interest in Simulai!

## Prelude

Simulai is written with the following frameworks and tools:

- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Headless UI](https://headlessui.dev/)
- [Oh, Vue Icons!](https://oh-vue-icons.js.org/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)

We strongly encourage contributors to be familiarized with these tools.

## Initial Setup

### Installing Dependencies

Before you can start helping with Simulai, you will want to install and configure the following dependencies on your
machine:

* [Git](http://git-scm.com/)

* [Node.js v16.x (LTS)](http://nodejs.org)

* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Forking Simulai on GitHub

To contribute code to Simulai, you need to fork the [repository](https://github.com/simulaiofficial/simulai).

## Setup Simulai on Your Computer

### Clone the Repository

To build Simulai, you clone your fork of the repository:

2. Clone your GitHub forked repository:
   ```sh
   git clone https://github.com/<github_username>/simulai.git
   ```

3. Go to the Simulai directory:
   ```sh
   cd simulai
   ```

### Installing Dependencies

Install npm dependencies:

    ```sh
    npm i
    ```

## Start a Development Server

1. Start development server

    ```sh
    npm run dev
    ```

2. To access the local server, enter the following URL into your web browser:

    ```sh
    http://localhost:5173/
    ```

## Writing Tests

1. Run tests

First, familiarize yourself with the libraries we are using for tests.

Simulai uses [**Vitest**](https://vitest.dev) for unit and component tests, as well as [**Playwright**](https://playwright.dev) for e2e tests.

After cloning the repository to your local environment and running `npm i`, you can run tests with the following:

```sh
npm run test:unit
npm run test:e2e
```

The same tests will run for any PR requested to the `main` branch, and all tests should pass before any PR is merged.

2. Write tests

All new features should be accompanied by at least one test for the new feature.

All bug fixes should be accompanied by a test that replicates the bug.

**When writing a test, check that it fails correctly before checking that it passes.**

## Submit Your Contribution!

After you've made the improvements, you can open a pull request and a member of the Simulai team (well either SK or Alfred for now!) will work with you on the PR!