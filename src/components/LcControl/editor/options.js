import lang from '@/lang' // Internationalization 国际化
import i18n from '@/lang/vue-html5-editor' // Internationalization 国际化
export default {
  // 全局组件名称，使用new VueHtml5Editor(options)时该选项无效
  // global component name
  name: 'vue-html5-editor',
  // 是否显示模块名称，开启的话会在工具栏的图标后台直接显示名称
  // if set true,will append module name to toolbar after icon
  showModuleName: false,
  // 自定义各个图标的class，默认使用的是font-awesome提供的图标
  // custom icon class of built-in modules,default using font-awesome
  icons: {
    text: 'van-icon van-icon-font-size',
    color: 'van-icon van-icon-bg-colors',
    font: 'van-icon van-icon-font-colors',
    align: 'van-icon van-icon-align-left',
    list: 'van-icon van-icon-orderedlist',
    link: 'van-icon van-icon-link',
    unlink: 'van-icon van-icon-disconnect',
    tabulation: 'van-icon van-icon-table',
    image: 'van-icon van-icon-image',
    hr: 'van-icon van-icon-minus',
    eraser: 'van-icon van-icon-highlight',
    undo: 'van-icon van-icon-undo',
    'full-screen': 'van-icon van-icon-fullscreen',
    info: 'van-icon van-icon-infomation'
  },
  // 配置图片模块
  // config image module
  image: {
    // 文件最大体积，单位字节  max file size
    sizeLimit: 100 * 1024 * 1024,
    // 上传参数,默认把图片转为base64而不上传
    // upload config,default null and convert image to base64
    upload: {
      url: null,
      headers: {},
      params: {},
      fieldName: {}
    },
    // 压缩参数,默认使用localResizeIMG进行压缩,设置为null禁止压缩
    // compression config,default resize image by localResizeIMG (https://github.com/think2011/localResizeIMG)
    // set null to disable compression
    compress: {
      width: 1600,
      height: 1600,
      quality: 80
    },
    // 响应数据处理,最终返回图片链接
    // handle response data，return image url
    uploadHandler(responseText) {
      // default accept json data like  {ok:false,msg:"unexpected"} or {ok:true,data:"image url"}
      const json = JSON.parse(responseText)
      if (!json.ok) {
        alert(json.msg)
      } else {
        return json.data
      }
    }
  },
  // 语言，内建的有英文（en-us）和中文（zh-cnCN）
  // default en-us, en-us and zh-cn are built-in
  language: i18n[ lang.locale] ? lang.locale : 'zh-CN',
  i18n: i18n,
  // 隐藏不想要显示出来的模块
  // the modules you don't want
  hiddenModules: [],
  // 自定义要显示的模块，并控制顺序
  // keep only the modules you want and customize the order.
  // can be used with hiddenModules together
  visibleModules: [
    'text',
    'color',
    'font',
    'align',
    'list',
    'link',
    'unlink',
    'tabulation',
    'image',
    'hr',
    'eraser',
    'undo',
    'full-screen'
  ]
}

