# THX Scripts

微前端构建工具，内置支持 Webpack5 模块邦联（Module Federation）。

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
![](https://img.shields.io/badge/webapck-5-brightgreen)

## Status
[![Open bug count](https://img.shields.io/github/issues-raw/thx/thx-scripts/type-bug.svg)](https://github.com/thx/thx-scripts/issues?q=is%3Aopen+is%3Aissue+label%3Atype%2Fbug)
[![Open issue count](https://img.shields.io/github/issues-raw/thx/thx-scripts.svg)](https://github.com/thx/thx-scripts/issues?q=is%3Aopen+is%3Aissue)
[![Closed issue count](https://img.shields.io/github/issues-closed-raw/thx/thx-scripts.svg)](https://github.com/thx/thx-scripts/issues?q=is%3Aissue+is%3Aclosed)

[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=thx_thx-scripts&metric=ncloc)](https://sonarcloud.io/dashboard?id=thx_thx-scripts)
[![Test coverage](https://codecov.io/gh/thx/thx-scripts/branch/master/graph/badge.svg)](https://codecov.io/gh/thx/thx-scripts)
[![Technical debt ratio](https://img.shields.io/codeclimate/tech-debt/thx/thx-scripts.svg)](https://codeclimate.com/github/thx/thx-scripts/trends/technical_debt)

[![Maintainability score](https://api.codeclimate.com/v1/badges/5d4326d6f68a2fa137cd/maintainability)](https://codeclimate.com/github/thx/thx-scripts/maintainability)
[![Quality issues](https://img.shields.io/codeclimate/issues/thx/thx-scripts.svg)](https://codeclimate.com/github/thx/thx-scripts/issues)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/thx/thx-scripts.svg?logo=lgtm)](https://lgtm.com/projects/g/thx/thx-scripts/context:javascript)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/thx/thx-scripts.svg)](https://lgtm.com/projects/g/thx/thx-scripts/alerts/)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fthx%2Fthx-scripts.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fthx%2Fthx-scripts?ref=badge_shield)

## Releases

[![github release link](https://img.shields.io/badge/github-release-blue?logo=github)](https://github.com/thx/thx-scripts/releases)
[![github release version](https://img.shields.io/github/tag/thx/thx-scripts.svg)](https://github.com/thx/thx-scripts/releases)
[![github commits since release](https://img.shields.io/github/commits-since/thx/thx-scripts/v0.9.1.svg)](https://github.com/thx/thx-scripts/compare/v0.8.0...master)

[![npm package link](https://img.shields.io/badge/npm-package-blue?logo=npm)](https://www.npmjs.com/package/thx-scripts)
[![npm release version](https://img.shields.io/npm/v/thx-scripts.svg)](https://www.npmjs.com/package/thx-scripts)
[![Typescript definitions](https://img.shields.io/npm/types/thx-scripts.svg)](https://www.npmjs.com/package/thx-scripts)

## 📦 Installation 安装

```shell
> yarn add thx-scripts --dev
```

## 📖 Build Configuration 构建配置

在应用根目录下新增 `.rmxrc` 文件，配置示例如下：

```json
{
  // Webpack 构建配置。
  "webpack": {
    "entry": {
      "index": "./src/index.tsx",
      "components/Hello": "./src/components/Hello.tsx"
    },
    "devServer": {
      "port": 9102
    }
  },
  // 可选。默认自动在浏览器中打开本地服务。值为 false 时禁用。
  "__unstable_auto_open": false,
  // 可选。默认开启 Webpack 5 ModuleFederationPlugin。值为 false 时禁用。
  "__unstable_module_federation": false,
  // 可选。额外的代理配置。通常不需要配置。
  "__unstable_dev_server_proxy": {},
  // 可选。RAP2 场景代理配置。通常不需要配置。
  "__unstable_rap2_scene_proxy": {}
}
```

## 📖 进阶：环境变量

> 增设环境变量的目的，是为了减少与 CLI 工具的整合成本。

为了自定义构建过程，除了修改上面的构建配置，还可以通过设置环境变量来影响。可选的环境变量如下：


* PAGE
* PORT、HTTPS
* MOCK、RAP_ID、RAP_HOST
* PROXY_IP、PROXY_HOST、PROXY_HTTPS、PROXY_PORT
* ANALYZE、ANALYZE_PORT

### PAGE

指定构建入口。如果不设置，则默认为 `src/index`。

```shell
> PAGE=src/index thx-scripts start
```

### PORT

指定本地服务的端口号。如果不设置，则自动查找空闲的端口号。

```shell
> PORT=1234 thx-scripts start
```

### HTTPS

指定本地服务是否开启 HTTPS。

```shell
> HTTPS=true thx-scripts start
```

### ANALYZE、ANALYZE_PORT

是否开启构建分析插件 webpack-bundle-analyzer。

```shell
> ANALYZE=true ANALYZE_PORT=1234 thx-scripts start
```

### MOCK、RAP_ID、RAP_HOST

接口代理到 RAP2 平台。

* `MOCK` 是否代理接口到 RAP2，配合 `RAP_ID`、`RAP_HOST` 使用。
* `RAP_ID` 指定 RAP2 平台的仓库 id，用于代理接口到 RAP2 平台。
* `RAP_HOST` 指定 RAP2 平台的地址，例如 `http://rap2api.taobao.org`，用于代理接口到 RAP2 平台。

```shell
# 内网
> MOCK=true RAP_ID=5496 RAP_HOST=http://rap2api.alibaba-inc.com thx-scripts start
```

```shell
# 外网
> MOCK=true RAP_ID=304935 RAP_HOST=http://rap2api.taobao.org thx-scripts start
```

### PROXY_IP、PROXY_HOST、PROXY_HTTPS、PROXY_PORT

* `PROXY_IP` 指定代理 IP，以及是否开启 HTTPS。
* `PROXY_HOST` 指定代理域名。
* `PROXY_HTTPS` 指定代理 IP 的协议是否为 HTTPS。默认不开启。
* `PROXY_PORT` 指定代理端口。默认 80。开启 HTTPS 后，默认 443。

```shell
> PROXY_IP=127.0.0.1 PROXY_HOST=local.proxy.com thx-scripts start
```

## 性能测试

TODO

## 🎗 License

Thx Scripts is MIT licensed.