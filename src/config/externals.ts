// import { Configuration } from 'webpack/types'

// : Configuration
const externalsConfig = {
  // 下面是一些常见示例
  externals: {
    // 🔧 基础框架 React
    // 'react': 'React',
    // 'react-dom': 'ReactDOM',
    // 'styled-components': 'styled',
    // 'redux': 'Redux',
    // 'react-redux': 'ReactRedux',
    // 'redux-saga': 'ReduxSaga',
    // 'redux-saga/effects': 'ReduxSagaEffects',
    // 'react-router-dom': 'ReactRouterDOM',

    // 🔧 基础组件 Next
    // '@alife/next': 'Next',
    // '@alife/next/dist/next.css': 'Next',
    // '@alifd/next': 'Next',
    // '@alifd/next/dist/next.css': 'Next'

    // ========== backup ==========
    // react: { root: 'React', commonjs: 'react', commonjs2: 'react', amd: 'react' },
    // 'react-dom': { root: 'ReactDOM', commonjs: 'react-dom', commonjs2: 'react-dom', amd: 'react-dom' }
    // redux: { root: 'Redux', commonjs: 'redux', commonjs2: 'redux', amd: 'redux' },
    // 'react-redux': { root: 'ReactRedux', commonjs: 'react-redux', commonjs2: 'react-redux', amd: 'react-redux' },
    // 'redux-saga': { root: 'ReduxSaga', commonjs: 'redux-saga', commonjs2: 'redux-saga', amd: 'redux-saga' },
    // 'redux-saga/effects': { root: 'ReduxSagaEffects', commonjs: 'redux-saga/effects', commonjs2: 'redux-saga/effects', amd: 'redux-saga/effects' },
    // 'styled-components': { root: 'styled', commonjs: 'styled-components', commonjs2: 'styled-components', amd: 'styled-components' },

    // jquery: { root: 'jQuery', commonjs: 'jquery', commonjs2: 'jquery', amd: 'jquery' },
    // mockjs: { root: 'Mock', commonjs: 'mockjs', commonjs2: 'mockjs', amd: 'mockjs' },
    // lodash: { root: '_', commonjs: 'lodash', commonjs2: 'lodash', amd: 'lodash' },
    // moment: { root: 'moment', commonjs: 'moment', commonjs2: 'moment', amd: 'moment' },
    // json5: { root: 'JSON5', commonjs: 'JSON5', commonjs2: 'JSON5', amd: 'JSON5' },
    // mousetrap: { root: 'Mousetrap', commonjs: 'Mousetrap', commonjs2: 'Mousetrap', amd: 'Mousetrap' },
    // prettier: { root: 'prettier', commonjs: 'prettier', commonjs2: 'prettier', amd: 'prettier' },
    // urijs: { root: 'URI', commonjs: 'urijs', commonjs2: 'urijs', amd: 'urijs' },

    // '@alife/next': { root: 'Next', var: 'window.Next', commonjs: '@alife/next', commonjs2: '@alife/next', amd: '@alife/next' },
    // '@alife/next/dist/next.css': { root: 'Next', var: 'window.Next', commonjs: '@alife/next', commonjs2: '@alife/next', amd: '@alife/next' },
    // '@alifd/next': { root: 'Next', var: 'window.Next', commonjs: '@alifd/next', commonjs2: '@alifd/next', amd: '@alifd/next' },
    // '@alifd/next/lib': { root: 'Next', var: 'window.Next', commonjs: '@alifd/next/lib', commonjs2: '@alifd/next/lib', amd: '@alifd/next/lib' },
    // '@alifd/next/dist/next.css': { root: 'Next', var: 'window.Next', commonjs: '@alifd/next', commonjs2: '@alifd/next', amd: '@alifd/next' }

    // '@antv/data-set': { root: 'DataSet', var: 'window.DataSet', commonjs: '@antv/data-set', commonjs2: '@antv/data-set', amd: '@antv/data-set' },
    // 'viser-react': { root: 'ViserReact', var: 'window.ViserReact', commonjs: 'viser-react', commonjs2: 'viser-react', amd: 'viser-react' },

    // visualengine: { root: 'VisualEngine', commonjs: '@ali/visualengine', commonjs2: '@ali/visualengine', amd: '@ali/visualengine' },
    // '@ali/visualengine': { root: 'VisualEngine', commonjs: '@ali/visualengine', commonjs2: '@ali/visualengine', amd: '@ali/visualengine' },
    // 'visualengine-utils': { root: 'VisualEngineUtils', commonjs: '@ali/visualengine-utils', commonjs2: '@ali/visualengine-utils', amd: '@ali/visualengine-utils' },
    // '@ali/visualengine-utils': { root: 'VisualEngineUtils', commonjs: '@ali/visualengine-utils', commonjs2: '@ali/visualengine-utils', amd: '@ali/visualengine-utils' },

    // 'babel-standalone': { root: 'Babel', commonjs: 'babel-standalone', commonjs2: 'babel-standalone', amd: 'babel-standalone' }
    // Uncaught TypeError: (0 , _styledComponents.injectGlobal) is not a function
    // https://www.styled-components.com/docs/api#deprecated-injectglobal
    // [Deprecated] injectGlobal
    // The injectGlobal API was removed and replaced by createGlobalStyle in styled-components v4.
    // TODO 降级至 v3

    // ComponentsBundle: { root: 'ComponentsBundle', commonjs: 'ComponentsBundle', commonjs2: 'ComponentsBundle', amd: 'ComponentsBundle' },
    // DesignerComponentsBundle: { root: 'DesignerComponentsBundle', commonjs: 'DesignerComponentsBundle', commonjs2: 'DesignerComponentsBundle', amd: 'DesignerComponentsBundle' },
    // RendererComponentsBundle: { root: 'RendererComponentsBundle', commonjs: 'RendererComponentsBundle', commonjs2: 'RendererComponentsBundle', amd: 'RendererComponentsBundle' },
  }
}

export default externalsConfig.externals
