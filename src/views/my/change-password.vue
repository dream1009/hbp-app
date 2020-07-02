<template lang="html">
  <div>
    <van-nav-bar
      :title="generateTitle()"
      :left-text="$t('back')"
      left-arrow
      fixed
      @click-left="onBack"
    />
    <van-cell-group>
      <van-field
        v-model="form.primitivePassword"
        v-validate="{ required: true}"
        :label="$t('my.primitivePassword')"
        :placeholder="$t('my.inputPrimitivePassword')"
        :error="errors.has('primitivePassword')"
        :error-message="errors.first('primitivePassword')"
        type="password"
        name="my.primitivePassword"
        required
        clearable
      />
      <van-field
        ref="my_newPassword"
        v-model="form.newPassword"
        v-validate="{ required: true}"
        :label="$t('my.newPassword')"
        :placeholder="$t('my.inputNewPassword')"
        :error="errors.has('my.newPassword')"
        :error-message="errors.first('my.newPassword')"
        type="password"
        name="my.newPassword"
        required
        clearable
      />
      <van-field
        v-model="form.repeatPassword"
        v-validate="{ required: true,confirmed: 'my_newPassword' }"
        :label="$t('my.repeatPassword')"
        :placeholder="$t('my.inputRepeatPassword')"
        :error="errors.has('my.repeatPassword')"
        :error-message="errors.first('my.repeatPassword')"
        type="password"
        name="my.repeatPassword"
        required
        clearable
      />
    </van-cell-group>
    <lc-toolbar
      :actions="actions"
    />
  </div>
</template>

<script>
import { changePwd } from '@/api/platform/org/user'
import navbar from '@/mixins/navbar'
import LcToolbar from '@/components/LcToolbar'
export default {
  components: {
    LcToolbar
  },
  mixins: [navbar],
  data() {
    return {
      form: {
        primitivePassword: '',
        newPassword: '',
        repeatPassword: ''
      },
      actions: [{
        'name': this.$t('common.button.save'),
        'buttonType': 'primary',
        'callback': this.onSave
      }]
    }
  },
  methods: {
    updatePassWord() {
      changePwd(this.form).then(response => {
        this.$toast.success(this.$t('my.changePasswordSuccess'))
        this.$router.push({ name: 'my' })
      }).catch(e => {
        console.error(e.cause)
      })
    },
    onSave() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.updatePassWord()
        } else {
          var name = document.getElementsByName(this.errors.items[0].field)
          if (name) {
            name[0].focus()
          }
          this.$toast(this.errors.items[0].msg)
        }
      })
    }
  }
}
</script>
