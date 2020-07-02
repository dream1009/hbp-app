## ResultPage 结果页

### 使用指南
``` javascript
import ResultPage from '@/components/ResultPage'

components: {
    ResultPage
}
```

### 代码演示

#### 基础用法


```html

  <div>
    <lc-result-page
      text="你要访问的页面已经丢失"
      :buttons="buttons"
      type="noRights"/>
  </div>

```

```javascript
export default {
  components: { LcResultPage },
  data() {
    return {
      buttons: [
        {
          text: '返回首页',
          click: this.onBack
        }]
    }
  },
  methods: {
    onBack() {
      console.log('back')
    }
  }
}
```


### Toolbar API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
|------|------|------|------|------|
| type | 页面类型 | `String` | empty | - |
| imgUrl | 背景图片 | `String` | - | - |
| text | 文本信息 | `String` | - | - |
| subtext | 文本信息 | `String` | - | - |
| buttons | 按钮 | `Array` | - | - |

```text
关于 type的值有：
1、 lost 丢失页面
2、 noRights 有权限去该页面
3、 network 网络连接异常
4、 empty 暂无信息
```

