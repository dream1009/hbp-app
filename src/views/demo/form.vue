<template>
  <div>
    <div class="van-block__title">
      基础用法
    </div>
    <van-cell-group>
      <van-field
        v-model="form.text"
        v-validate="{ required: true}"
        :error="errors.has('text')"
        :error-message="errors.first('text') "
        label="单行文本"
        placeholder="请输入"
        autocapitalize="off"
        autocorrect="off"
        clearable
        required
        name="text"
      />

      <van-field
        v-model="form.textarea"
        label="多行文本"
        type="textarea"
        placeholder="请输入"
        rows="2"
        autosize
        clearable
        required
      />
      <van-field
        v-model="form.number"
        label="数字"
        type="number"
        placeholder="请输入"
        clearable
        required
      />

      <van-lc-radio
        v-model="form.radio"
        :options="options"
        label="单项选择"
        placeholder="请选择"
        clearable
        required
      />

      <van-lc-checkbox
        v-model="form.checkbox"
        :options="options"
        label="多项选择"
        placeholder="请选择"
        clearable
        required
      />

      <van-lc-checker
        v-model="form.checker1"
        :options="options"
        label="多选器单选"
        radio-required
        type="radio"
        :cols="3"
        checker
      />

      <van-lc-checker
        v-model="form.checker2"
        :options="options"
        :max="2"
        type="checkbox"
        checker
      />
      <van-lc-picker
        v-model="form.select"
        :options="options"
        label="下拉选择"
        placeholder="请选择"
        clearable
        required
      />
      <van-lc-date-picker
        v-model="form.date"
        label="日期"
        placeholder="请选择"
        format="yyyy-MM-dd"
        clearable
        required
      />
      <van-lc-dictionary
        v-model="form.dictionary"
        :multiple="false"
        label="数据字典单选"
        select-mode="any"
        display-mode="path"
        placeholder="请选择"
        cat-type="fieldControl"
        clearable
        required
      />

      <van-lc-dictionary
        v-model="form.dictionary1"
        label="数据字典多选"
        multiple
        placeholder="请选择"
        cat-type="fieldControl"
        store="string"
        clearable
        required
      />

      <van-lc-auto-number
        v-model="form.autoNumber"
        identity="xh"
        label="自动编号"
        clearable
        required
      />

      <van-lc-selector
        v-model="form.userlector"
        label="用户选择器"
        type="user"
        clearable
        required
      />

      <van-lc-selector
        v-model="form.orgSelector"
        label="组织选择器"
        type="org"
        multiple
        clearable
        required
      />

      <van-lc-selector
        v-model="form.postSelector"
        label="岗位选择器"
        type="position"
        multiple
        clearable
        required
      />

      <van-lc-selector
        v-model="form.roleSelector"
        label="角色选择器"
        type="role"
        multiple
        clearable
        required
      />

      <van-lc-custom-dialog
        v-model="form.customDialog"
        template-key="xjsqd"
        label="自定义对话框"
        multiple
        placeholder="请选择"
        clearable
      />

      <van-lc-type
        v-model="form.typeId"
        category-key="NOTICE_TYPE"
        label="公告类型"
        clearable
      />

      <van-lc-uploader
        v-model="form.uploader"
        multiple
        label="上传附件"
        placeholder="请上传附件"
        clearable
        required
      />

      <van-lc-address
        v-model="form.address"
        store="stringKey"
        placeholder="请选择"
        label="地址"
        clearable
        required
      />

      <van-lc-editor
        v-model="form.editor"
        :readonly="true"
        label="只读富文本框"
      />
      <van-lc-editor
        v-model="form.editor1"
        label="富文本框"
      />

      <van-lc-signature
        v-model="form.signature"
        clearable
        undoable
        required
        label="签名"
        placeholder="请在这里输入你的签名"
      />

      <van-cell>
        <van-row gutter="20">
          <van-col span="12">
            <van-button type="default" style="width:100%;" @click="onCancel">
              取消
            </van-button>
          </van-col>
          <van-col span="12">
            <van-button type="primary" style="width:100%;" @click="onSave">
              保存
            </van-button>
          </van-col>
        </van-row>
      </van-cell>
      <lc-toolbar
        :actions="actions"
      />
    </van-cell-group>
  </div>
</template>
<script>
import Vue from 'vue'
import LcControl from '@/components/LcControl'
Vue.use(LcControl)
import LcToolbar from '@/components/LcToolbar'

export default {
  components: {
    LcToolbar
  },
  data() {
    return {
      form: {
        text: '',
        textarea: '',
        number: '',
        radio: '选项3',
        checkbox: '选项2,选项4',
        checker1: '选项2',
        checker2: '选项2,选项1',
        select: '选项4',
        date: '2018-07-21',
        dictionary: 'baizu',
        dictionary1: 'zhuangzu,zangzu', // ['zhuangzu', 'zangzu']
        userlector: '[{id:"1",name:"管理员"}]',
        orgSelector: '[{id:"445920922105282560",name:"广州流辰"}]', // 445920922105282560,481058896081846272
        postSelector: '',
        roleSelector: '',
        customDialog: '', // '[{\"id_\":\"466335903523012608\",\"dhwb_\":\"测试\"}]',
        autoNumber: '',
        uploader: '', // '[{\"id\":\"494883331066822656\",\"fileName\":\"new 12\"}]',
        address: '{"street":"22","province":44,"city":4401,"country":"CN","district":440106}',
        editor: '<div>欢迎使用HBP平台<font color=\"red\">dddd</font></div><div></div>',
        editor1: '<div>欢迎使用HBP平台</div>',
        signature: 'data:image/png;base64,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',
        typeId: '489381580377161728'
      },

      options: [{
        value: '选项1',
        label: '黄金糕',
        disabled: true
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      actions: [
        {
          name: '取消',
          buttonType: 'default',
          callback: this.onCancel
        },
        {
          name: '保存',
          buttonType: 'primary',
          callback: this.onSave
        }
      ]
    }
  },
  methods: {
    onCancel() {
      this.$toast('取消')
    },
    onSave() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.$dialog.alert({
            message: this.format4popup(this.form)
          })
        } else {
          var name = document.getElementsByName(this.errors.items[0].field)
          if (name) {
            name[0].focus()
          }
          this.$toast('表单未正确填写！')
        }
      })
    },
    format4popup(object) {
      return JSON.stringify(object, null, 2)
        .replace(/</g, '&lt;').replace(/>/g, '&gt;')
    }
  }

}
</script>
