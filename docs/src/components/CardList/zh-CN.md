## CardList 卡片

### 使用指南
``` javascript
import CardList from '@/components/CardList';

```

### 代码演示

#### 基础用法


```html
<card-list
  :title="item.procDefName"
  :desc="item.subject"
  :date="item.date"
  :tag="status"
  :tag-type="statusType"
  is-link
  @click="onClick(item)"/>
```

``` javascript
export default {
  data() {
    return {
      item: {
        procDefName: '',
        subject: '管理员发起请假流程',
        date: '2018-11-11',
        status: '运行中',
        statusType: 'primary',
      }
    };
  },
  methods:{
    onClick(){
      console.log('click')
    }
  }
};
```

### CardList API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
|------|------|------|------|------|
| avatar | 头像 | `Boolean` | true | - |
| icon | 图标 | `String` | - | - |
| bg-color | 背景色 | `String` | - | - |
| color | 颜色 | `String` | - | - |
| image | 图片 | `String` | - | - |
| thumb | 头像 | `String` | - | - |
| title | 标题 | `String` | - | - |
| circle | 圆形 | `String` | - | - |
| rounded | 圆角 | `String` | - | - |
| size | 尺寸 | `String` | 40 | - |
| desc | 描述 | `String` | - | - |
| centered | 居中 | `Boolean` | true | - |
| date| 日期 | `[Number, String, Date]` | - | - |
| tag | 标签 | `[Number, String]` | - | - |
| tag-type | 标签类型 | `String` | primary | - |
| tag-plain | 是否为空心样式 | `Boolean` | true | - |
| tag-mark | 是否为标记样式 | `Boolean` | - | - |
| is-link | 是否链接 | `Boolean` | false | - |
| clickable | 能否点击 | `Boolean` | - | - |
| arrow-direction |  | `String` | - | - |
| border | 显示边框 | `Boolean` | true | - |
| check-mode | 选择模式 | `Boolean` | false | - |
| checked | 是否选中 | `Boolean` | false | - |
