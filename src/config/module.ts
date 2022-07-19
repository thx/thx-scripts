// import * as path from 'path'
import { Configuration } from 'webpack/types'

const { NODE_ENV } = process.env
const isDevelopment = process.env.NODE_ENV !== 'production'

const rules = [
  {
    test: /\.(js|jsx|ts|tsx)$/,
    exclude: /node_modules/,
    use: {
      loader: require.resolve('babel-loader'),
      options: {
        presets: [
          [
            require.resolve('@babel/preset-env')
            // {
            //   targets: {
            //     edge: '17',
            //     firefox: '60',
            //     chrome: '67',
            //     safari: '11.1'
            //   },
            //   useBuiltIns: 'usage'
            // }
          ],
          require.resolve('@babel/preset-flow'),
          require.resolve('@babel/preset-react'),
          require.resolve('@babel/preset-typescript')
        ],
        plugins: [
          [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
          [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }],
          require.resolve('@babel/plugin-proposal-object-rest-spread'),
          require.resolve('@babel/plugin-syntax-dynamic-import'),
          [require.resolve('@babel/plugin-proposal-private-methods'), { loose: true }],
          [require.resolve('@babel/plugin-proposal-private-property-in-object'), { loose: true }],
          [require.resolve('@babel/plugin-transform-runtime'), { 'regenerator': true }],
          isDevelopment
            ? [require.resolve('babel-plugin-styled-components'), { displayName: true }]
            : require.resolve('babel-plugin-styled-components'),
          isDevelopment && require.resolve('react-refresh/babel')
        ].filter(Boolean),
        compact: NODE_ENV === 'production'
      }
    }
  },
  {
    test: /\.css$/,
    use: [
      require.resolve('style-loader'),
      require.resolve('css-loader')
    ]
  },
  {
    test: /\.less$/,
    use: [
      require.resolve('style-loader'),
      require.resolve('css-loader'),
      require.resolve('less-loader')
    ]
    // use: ['style-loader', 'fast-css-loader', 'less-loader']
    // exclude: path.resolve(__dirname, 'node_modules'),
  },
  {
    test: /\.(scss|sass)$/,
    use: [
      { loader: require.resolve('style-loader') },
      { loader: require.resolve('css-loader'), options: { sourceMap: false } },
      { loader: require.resolve('sass-loader'), options: { sourceMap: false } }
    ]
  },
  {
    test: /\.txt$/,
    use: require.resolve('raw-loader')
  },
  {
    test: /\.(png|jpg|gif|bmp)$/,
    // use: ['file-loader']
    use: [
      {
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]'
        }
      }
    ]
  },
  {
    test: /\.svg$/,
    use: [
      {
        loader: require.resolve('babel-loader'),
        options: {
          presets: [
            require.resolve('@babel/preset-env'),
            require.resolve('@babel/preset-react')
          ]
        }
      },
      {
        loader: require.resolve('react-svg-loader'),
        options: {
          jsx: true // true outputs JSX tags
        }
      }
    ]
  },
  // {
  //   test: /\.json$/,
  //   use: require.resolve('json-loader'),
  //   exclude: path.resolve(__dirname, 'node_modules')
  // },
  {
    test: /\.ttf$/,
    use: [
      require.resolve('file-loader')
    ]
  }
]

const config: Configuration = {
  module: { rules }
}

export default config
