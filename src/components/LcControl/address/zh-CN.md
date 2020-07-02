## Address 地址

地址 用于选择国家、省市区、街道。

### 使用指南
``` javascript
import { VanLcAddress } from '@/components/LcControl/address';

Vue.use(VanLcAddress);
或者  组件加入
components: {
  VanLcAddress
}


或者 全局使用
import LcControl from '@/components/LcControl'
Vue.use(LcControl)
```

### 代码演示

#### 基础用法
通过 v-model 绑定输入框的值

```html
<van-cell-group>
    <van-lc-address
      v-model="value"
      store="stringKey"
      placeholder="请选择"
      label="地址"
      clearable
      required
      />
</van-cell-group>
```


### API

Field 默认支持 Input 标签所有的原生属性，比如 `maxlength`、`placeholder`、`autofocus` 等

| 参数 | 说明 | 类型 | 默认值 |
|-----------|-----------|-----------|-------------|-------------|
| label | 输入框左侧文本 | `String` | - |
| desc | 描述【增加】 | `String` | - |
| value | 当前输入的值 | `String | Number` | - |
| border | 是否显示内边框 | `Boolean` | `true` |
| disabled | 是否禁用输入框 | `Boolean` | `false` |
| readonly | 是否只读 | `Boolean` | `false` |
| clearable | 是否启用清除控件 | `Boolean` | `false` |
| required | 是否显示表单必填星号 | `Boolean` | `false` |
| is-link | 是否展示右侧箭头并开启点击反馈 | `Boolean` | `false` |
| error | 是否将输入内容标红 | `Boolean` | `false` |
| error-message | 底部错误提示文案，为空时不展示 | `String` | `''` |
| label-align | 文本对齐方式，可选值为 `center` `right` | `String` | `left` |
| input-align | 输入框内容对齐方式，可选值为 `center` `right` | `String` | `left` |
| icon | 输入框尾部图标 (可选值见 Icon 组件)  | `String` | - |
| left-icon | 输入框左侧图标 (可选值见 Icon 组件)  | `String` | - |
| data-type |数据类型 可选值为 `all`, `code`, `name`| `String` | `all` |
| store | 存储值（返回值）类型  可选值为 `stringKey`, `array`, `string`| `String` | `stringKey` |
| store-separator | 存储值（返回值）分割符,对于设置`string` 类型的分隔符有效  | `String` | `,` |
| separator | 展示值的分割符  | `String` | `/` |
| top |  最大区域,可选值为  `country`、`province`、`city`、`district`  | `String` | `country` |
| top-val |  最大区域的值，如:top='province'  topVal='CN'  | `String,Number` | `0` |
| level |  最小区域(或者等级),可选值为  `country`、`province`、`city`、`district`  | `String` | `district` |
| has-street |  支持街道  | `Boolen` | `true` |
| street-placeholder |  街道占位符  | `String` | `请输入详细地址` |




### Event 事件

| 事件 | 说明 | 回调参数 |
|-----------|-----------|-----------|
| change-street| 修改街道值时触发 | street：街道值 |




