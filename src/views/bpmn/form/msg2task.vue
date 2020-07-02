<template>
</template>
<script>
import { getQueryString, setToken, setTitleHide } from '@/utils/auth'
import { apiToken4Free } from '@/api/login'
export default {
  data() {
    return {
    }
  },
  created() {
      const account = getQueryString('account')
      const code = getQueryString('code')
      const taskId = getQueryString('taskId')
      const _this = this
      if (account && code && taskId) {
          const param = { account: account, code: code, flag: 'true' }
          apiToken4Free(param).then(response => {
              const token = response.data.token
              setToken(token)
              setTitleHide('true')
              _this.$router.replace({ path: '/bpmn/form?taskId='+taskId })
              }
          )
      } else {
          _this.$router.push({ path: '/login'})
      }

  },
  methods: {
      getQueryString() {
          return getQueryString()
      }
  }
}
</script>
