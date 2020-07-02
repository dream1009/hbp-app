## ListResultPage 分页结果

### 使用指南
``` javascript
import ListResultPage from '@/components/ListResultPage'

components: {
    ListResultPage
}
```

### 代码演示

#### 基础用法


```html

<list-result-page
    :result-type="resultType"
    :error-type="errorType"
    :result-message="resultMessage"/>

```

```javascript
export default {
  data() {
    return {
      resultType: 'init',
      errorType: null,
      resultMessage: null,
    }
  }
}
```


### Toolbar API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
|------|------|------|------|------|
| finished | 请求情况 | `Boolean` | - | - |
| finishedText | 情况文本 | `String` | - | - |
| resultType | 结果状态 | `String` | - | - |
| resultMessage | 结果信息 | `String` | - | - |

```text
关于 resultType
目前list 状态：
1、 init 展示初始列表;
2、 finished 加载完成;
3、 empty  没有数据;
4、 error  异常;
5、 未加载完成的 null
```

