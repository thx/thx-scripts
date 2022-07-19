const { NODE_ENV } = process.env

const extra: any = NODE_ENV === 'development' ? {
  // https://webpack.js.org/configuration/mode/
  mode: 'development', // development | production
  // https://webpack.js.org/configuration/devtool/#devtool
  // MO TODO 优选 'source-map'
  // MO TODO Redux Dev Tool Trace 'eval-cheap-module-source-map'
  devtool: 'source-map'
} : {
  mode: 'production'
}

export default extra
