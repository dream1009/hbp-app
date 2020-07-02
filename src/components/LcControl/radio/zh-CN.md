## Radio 单选框

单选框，用于选择单个选项。

### 使用指南
``` javascript
import { LcRadio } from '@/components/LcControl/radio';

Vue.use(LcRadio);
或者  组件加入
components: {
  LcRadio
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
  <van-lc-radio v-model="value" placeholder="请选择" :options="[
        value: '选项1',
        label: '黄金糕',
        disabled: true
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }]" />
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
| options |下拉的选项  | `Array` | [] |
| value-key |选项存储值的key  | `String` | value|
| labelKey |选项展示值的key  | `String` | label|
|other-option-key|选项其他选项的key  | `String` | include_other_option|
|other-option-value|选项其他选项的值  | `String` | ''|



### Event 事件

| 事件 | 说明 | 回调参数 |
|-----------|-----------|-----------|
| click-icon | 点击尾部图标时触发 | - |
| change-other-option'| 修改其他选项值时触发 | - |




