# MM CLI - React Scripts

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
![](https://img.shields.io/badge/webapck-5-brightgreen)

* 实现简洁，基于原生 webpack.config.js 配置。
* 构建速度比 mm-webpack 快 1-3 倍。

## RC 配置

文件 `.rmxrc` 示例：

```json
{
  "type": "react",
  "webpack": {},
  // 默认自动在浏览器中打开本地服务。值为 false 时禁用。
  "__unstable_auto_open": false,
  // 默认开启 Webpack 5 ModuleFederationPlugin。值为 false 时禁用。
  "__unstable_module_federation": false,
  // 额外的代理配置。通常不需要配置。
  "__unstable_dev_server_proxy": {},
    // RAP2 场景代理配置。通常不需要配置。
  "__unstable_rap2_scene_proxy": {}
}
```

## 环境变量

* PAGE
* PORT、HTTPS
* MOCK、RAP_ID、RAP_HOST
* PROXY_IP、PROXY_HOST、PROXY_HTTPS、PROXY_PORT
* ANALYZE、ANALYZE_PORT

### PAGE
指定构建入口。如果不设置，则默认为 `src/index`。

### PORT

指定本地服务的端口号。如果不设置，则自动查找空闲的端口号。

### HTTPS

指定本地服务是否开启 https。

### ANALYZE、ANALYZE_PORT

是否开启构建分析插件 webpack-bundle-analyzer。

### MOCK

接口代理到 RAP，配合 `RAP_ID` 使用。

### RAP_ID

指定 RAP2 平台的仓库 id，用于代理接口到 RAP2 平台。

### RAP_HOST

指定 RAP2 平台的地址，例如 `http://rap2api.taobao.org`，用于代理接口到 RAP2 平台。

### PROXY_IP

指定代理 IP，以及是否开启 HTTPS。

### PROXY_HOST

指定代理域名。

### PROXY_HTTPS

指定代理 IP 的协议是否为 HTTPS。

## 性能测试

TODO