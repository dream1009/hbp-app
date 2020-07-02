/* eslint-disable */
const version = require('../../package.json').version;
const logoImage = require('./asserts/images/logo.png')

module.exports = {
  'zh-CN': {
    logo:logoImage,
    header: {
      logo: {
        image: logoImage,
        title: 'HBP 平台',
        version,
        href: '#/'
      }
    },
    nav: [
      {
        name: '开发指南',
        groups: [
          {
            list: [
              {
                path: '/intro',
                title: '介绍'
              },
              {
                path: '/quickstart',
                title: '快速上手'
              },
              {
                path: '/changelog',
                title: '更新日志'
              },
              {
                path: '/vant-css',
                title: '内置样式'
              },
              {
                path: '/theme',
                title: '定制主题'
              },
              {
                path: '/contribution',
                title: '开发指南'
              },
              {
                path: '/style-guide',
                title: '风格指南'
              },
              {
                path: '/demo',
                title: '示例页面'
              },
              {
                path: '/locale',
                title: '国际化'
              }
            ]
          }
        ]
      },
      {
        name: '组件',
        showInMobile: true,
        groups: [
          {
            groupName: '表单组件',
            list: [

            ]
          },{
            groupName: '基础组件',
            list: [
              // {
              //   path: '/avatar',
              //   title: '头像'
              // },
              // {
              //   path: '/checker',
              //   title: '选择器'
              // },
              {
                path: '/toolbar',
                title: '工具栏'
              },
              {
                path: '/cardList',
                title: '卡片列表'
              },
              {
                path: '/toast',
                title: '轻提示'
              }
            ]
          },{
            groupName: '业务组件',
            list: [
              {
                path: '/listResultPage',
                title: '分页结果'
              },
              {
                path: '/resultPage',
                title: '结果页'
              },
              {
                path: '/paletteButton',
                title: 'PaletteButton'
              },
              {
                path: '/poptip',
                title: '气泡提示'
              },
              {
                path: '/lcCard',
                title: '卡片'
              },
              {
                path: '/langSelect',
                title: '语言选择器'
              }
            ]
          }
        ]
      }
    ]
  }
};
