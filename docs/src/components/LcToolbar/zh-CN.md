## Toolbar 标签栏

### 使用指南
``` javascript
import LcToolbar from '@/components/LcToolbar'

components: {
    LcToolbar
}
```

### 代码演示

#### 基础用法


```html

<lc-toolbar :actions="actions"/>

```

```javascript
export default {
  data() {
    return {
      actions: [{
          'name': '同意',
          'buttonType': 'primary',
          'callback': this.onClick
        }, {
          'name': '反对',
          'buttonType': 'danger',
          'callback': this.onClick
        }]
    }
  },
  methods: {
    onClick() {
        console.log("click")
    }
  }
}
```


#### 更多用法
通过 moreActions 属性，传入一个数组，数组每一项是一个对象。

```html

<lc-toolbar :moreActions="moreActions" :more-cancel-text="cancelText"/>

```

```javascript
export default {
  data() {
    return {
      moreActions: [
        {
        'name': '挂起',
        'buttonType': 'primary',
        'callback': this.onClick
        },{
        'name': '恢复',
        'buttonType': 'primary',
        'callback': this.onClick
        }
      ],  
      cancelText: '关闭'
    }
  },
  methods: {
    onClick() {
        console.log("click")
    }
  }
}
```
#### 修改菜单按钮标题
如果传入了menuButtonText属性，且不为空，则菜单按钮标题可自定义。

```html

<lc-toolbar :moreActions="moreActions" :more-cancel-text="cancelText" :menu-button-text="附加菜单"/>

```


### Toolbar API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
|------|------|------|-------|------|
| actions | 工具栏数组 | `Array` | `[]`| - |
| actions | 工具栏数组 | `Array` | `[]`| - |
| moreActions | 菜单选项 | `Array` |同actions | - |
| moreCancelText | 取消文本 | `String` |`取消`| - |
| menuButtonText | 菜单按钮文本 | `String` |  `更多`|- |


### actions
`API`中的`actions`为一个对象数组，数组中的每一个对象配置每一列，每一列有以下key：
| key  | 说明 | 
|------|------|
| name | 按钮标题 |
| buttonType | 按钮颜色 |
| callback | 按钮绑定的回调函数 |