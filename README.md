# node-dependency-updater


## usage

~~~ yaml
name: Bump Dependencies
on:
  schedule:
    - cron: "0 0 * * *"
  workflow_dispatch:

jobs:
  bump-dependencies:
    runs-on: ubuntu-latest
    steps:
      - name: Run Dependency Bump Action
        uses: jbigman/node-dependency-updater@main
        with:
          token: ${{ secrets.PAT_FOR_PULL_REQUEST }}
          
~~~

## Action inputs

| Name | Description | Default |
| --- | --- | --- |
| `ncu-options` | Any string that could fit with [raineorshine/npm-check-updates](https://github.com/raineorshine/npm-check-updates?tab=readme-ov-file#options) cli.<br> If you want only a bump on minor or patch, set : `-u -t minor` or `-u -t minor` | `-u` |
| `token` | The token that the action will use to checkout branch and create pull request. See [peter-evans/create-pull-request](https://github.com/peter-evans/create-pull-request?tab=readme-ov-file#token) | |

> [!IMPORTANT]  
> Check out `GITHUB_TOKEN` constraints [peter-evans/create-pull-request/#token](https://github.com/peter-evans/create-pull-request?tab=readme-ov-file#token)

Let me know if you need more inputs from [peter-evans/create-pull-request](https://github.com/peter-evans/create-pull-request) 



