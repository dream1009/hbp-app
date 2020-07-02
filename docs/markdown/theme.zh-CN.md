## 定制主题

`HBP`提供了一套默认主题，CSS 命名采用 BEM 的风格，方便使用者覆盖样式。如果你想完全替换主题色或者其他样式，可以使用下面的方法：


###  本地构建
可以通过在本地构建 vant-css 的方式生成所需的主题

```bash
# 克隆仓库
git clone git@github.com:youzan/vant.git
cd packages/vant-css
```

在本地 vant-css 仓库中，修改 src/common/var.css 中的颜色变量，然后执行以下构建命令，即可生成对应的样式文件
```bash
npm run build
```
