## Checker 头像

### 使用指南
``` javascript
import Checker from '@/components/Checker';

```

### 代码演示

#### 基础用法

通过在`van-badge-group`上设置`active-key`属性来控制选中的`badge`

```html
<avatar
  :image="image"
  :size="size"
  circle
/>
```

``` javascript
export default {
  data() {
    return {
      image: '/',
      size: 50
    };
  }
};
```

### Badge API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
|------|------|------|------|------|
| image | 图片地址 | `String` | - | - |
| default-image | 默认图片 | `String` | - | - |
| rounded | 圆角 | `Boolean` | - | - |
| circle | 圆形 | `Boolean` | - | - |
| alt | 图片描述 | `String` | - | - |
| icon | 图标 | `String` | - | - |
| icon-class-prefix | 图标 | `String` | - | - |
| info | 图标描述 | `String` | - | - |
| text | 文本 | `String` | - | - |
| text-substr | 文本长度 | `Number` | 2 | - |
| size | 尺寸 | `Number` | - | - |
| size-unit | 尺寸单位 | `String` | px | - |
| color | 文字的颜色 | `String` | - | - |
| bg-color | 背景色 | `String` | - | - |
| thumb | 头像 | `String` | - | - |
| thumb-error | 失败的头像 | `String` | - | - |
