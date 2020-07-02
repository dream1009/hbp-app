## 快速上手

### 安装依赖
```bash
npm install 
```

>## TIP
>强烈建议不要用直接使用 cnpm 安装，会有各种诡异的 bug，可以通过重新指定 registry 来解决 npm 安装速度慢的问题。若还是不行，可使用 yarn 替代 npm。<br/>
>Windows 用户若安装不成功，很大概率是node-sass安装失败，解决方案。

```bash
npm install --registry=https://registry.npm.taobao.org
```

### 启动项目
```bash
npm run dev
```

启动完成后会自动打开浏览器访问 http://localhost:9999， 你看到下面的页面就代表操作成功了。
