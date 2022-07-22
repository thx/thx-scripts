# React Example

用于测试 React 套件、构建工具的示例仓库。

## 测试构建工具 thx-scripts

```sh
# dev
## 代理页面
nodemon --verbose --ext js,ts,tsx,json --watch ../../thx-scripts/src --exec 'ANALYZE=true PAGE=home,account,shared,foo/bar yarn run dev'
nodemon --verbose --ext js,ts,tsx,json --watch ../../thx-scripts/src --exec 'ANALYZE=true PORT=8081 PAGE=src/index,src/pages/home/index,src/pages/account,shared,foo/bar yarn run dev'

## 代理至 RAP
nodemon --verbose --ext js,ts,tsx,json --watch ../../thx-scripts/src --exec 'ANALYZE=true PAGE=home,account,shared,foo/bar RAP_ID=5496 yarn run dev'

## 代理至指定 IP
nodemon --verbose --ext js,ts,tsx,json --watch ../../thx-scripts/src --exec 'ANALYZE=true PAGE=home,account,shared,foo/bar PROXY_IP=127.0.0.1 yarn run dev'


# build
nodemon --verbose --ext js,ts,tsx,json --watch ../../thx-scripts/src --exec 'ANALYZE=true PAGE=home,account,shared,foo/bar yarn run build'
```
## 测试 Node V16
```
nodemon --verbose --ext js,ts,tsx,json --watch /Users/mo/mm/ws/mmfs/mm-cli/packages/thx-scripts --exec 'node -v; rm -fr node_modules; ls -al node_modules; yarn; yarn start'
```