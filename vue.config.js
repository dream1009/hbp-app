'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

// 拼接路径
function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'IBPS 平台' // page title
const port = 8989 // dev port
/**
 *  基础路径 注意发布之前要先修改这里
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
const publicPath = './'

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  publicPath: publicPath,
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },

    proxy: {
      '^/ddapi': {
        target: 'https://oapi.dingtalk.com',
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: {
          '^/ddapi': '/'
        }
      }
    }
    // proxy: {
    //   // change xxx-api/login => mock/login
    //   // detail: https://cli.vuejs.org/config/#devserver-proxy
    //   [process.env.VUE_APP_BASE_API]: {
    //     target: `http://localhost:${port}/mock`,
    //     changeOrigin: true,
    //     pathRewrite: {
    //       ['^' + process.env.VUE_APP_BASE_API]: ''
    //     }
    //   }
    // }
    // after: require('./mock/mock-server.js')
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src'),
        'vue$': 'vue/dist/vue.esm.js'
      }
    }
  },
  chainWebpack(config) {
    /**
     * 删除懒加载模块的 prefetch preload，降低带宽压力
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#prefetch
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#preload
     * 而且预渲染时生成的 prefetch 标签是 modern 版本的，低版本浏览器是不需要的
     */
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    // 解决 cli3 热更新失效 https://github.com/vuejs/vue-cli/issues/1559
    config.resolve
      .symlinks(true)
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()
    // 开发环境
    config
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('source-map')
      )
    // 非开发环境
    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                vant: {
                  name: 'chunk-vant', // split vant into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?vant(.*)/ // in order to adapt to cnpm
                },
                pdfjs: {
                  name: 'chunk-pdfjs',
                  test: /[\\/]node_modules[\\/]_?pdfjs-dist(.*)/,
                  priority: 21
                },
                hlsjs: {
                  name: 'chunk-hlsjs',
                  test: /[\\/]node_modules[\\/]_?hls.js(.*)/,
                  priority: 22
                },
                // videojs: {
                //   name: 'chunk-videojs',
                //   test: /[\\/]node_modules[\\/]_?video.js(.*)/,
                //   priority: 23
                // },
                // bpmnjs: {
                //   name: 'chunk-bpmnjs',
                //   test: /[\\/]node_modules[\\/]_?bpmn-js(.*)/,
                //   priority: 24
                // },
                // diagramjs: {
                //   name: 'chunk-diagramjs',
                //   test: /[\\/]node_modules[\\/]_?diagram-js(.*)/,
                //   priority: 25
                // },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
