name: Tests
on: [push, pull_request]

jobs:
    build:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v2
            - name: Install modules
            run: yarn
            - name: Run tests
            run: yarn test