
## Build Setup

``` bash

# Install dependencies
npm install

# 建议不要用cnpm  安装有各种诡异的bug 可以通过如下操作解决npm速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 如果还是不行 取消ssl验证 
npm config set strict-ssl false
npm config set registry http://registry.npm.taobao.org/

#原来的npm
npm config set registry http://registry.npmjs.org 

#检查更新版本
npm outdated
ncu

# serve with hot reload at localhost:9528
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

#代码自动修复
npm run lint -- --fix
```

``` bash
#发布的目录不是，请修改了
assetsPublicPath:  '/ibps/', /
```



目录结构
├── build                      # 构建相关
├── public                     # 静态资源
│   │── static                 # 第三方资源（不打包资源）  富文本ueditor
│   │── favicon.ico            # favicon图标
│   └── index.html             # html模板
├── src                        # 源代码
│   ├── api                    # 所有请求
│   ├── assets                 # 主题 字体等静态资源
│   ├── business               # 业务组件（该组件是包含业务数据，比如人员选择器、上传附件、数据字典等）
│   ├── components             # 全局公用组件
│   ├── directives             # 全局指令
│   ├── filters                # 全局过滤
│   ├── i18n                   # 国际化 language
│   ├── icons                  # 项目所有 svg icons
│   ├── lang                   # 国际化 language
│   ├── layout                 # 全局 layout,目前有header-aside布局
│   ├── router                 # 路由
│   ├── pages                  # 公用页面  不涉及过多业务，比如错误页面，登录
│   ├── plugins                # 插件 封装（或者集成第三方）了一些插件，方便开发者进行开发
│   ├── store                  # 全局 store管理
│   ├── styles                 # 全局样式
│   ├── utils                  # 全局公用方法
│   ├── views                  # views 所有页面
│   ├── App.vue                # 入口页面
│   ├── main.js                # 入口文件 加载组件 初始化等
│   └── permission.js          # 权限管理
│   └── setting.js             # 全局默认配置
├── tests                      # 测试
├── .env.xxx                   # 环境变量配置
├── .eslintrc.js               # eslint 配置项
├── .babelrc                   # babel-loader 配置
├── .travis.yml                # 自动化CI配置
├── vue.config.js              # vue-cli 配置
└── package.json               # package.json

==================================

components                    // 组件目录
│   ├── Avatar                   // Avatar 头像等
│   ├── Bpmn                   // 流程组件包含流程图、审批历史
│   ├── CardList               //  卡片列表
│   ├── Checker                //  多选器
│   ├── DropMenu              //  下拉菜单
│   ├── DynamicForm             // 动态表单
│   ├── Formrender            // 表单渲染
│   ├── IndexList              // 通讯录、索引列表
│   ├── IndexSection           //通讯录 选择
│   ├── LangSelect             // 切换语言
│   ├── LcCard                 // 卡片视图
│   ├── LcControl             // 表单控件
│   ├── LcToolbar              // 工具栏
│   ├── ResultPage             // 结果页
