export default {
  language: '中文',
  back: '返回',
  backHome: '返回首页',
  clear: '清空',
  close: '关闭',
  loading: '加载中...',
  saving: '保存中...',
  company: '',
  platform: 'HBP 平台',
  welcome: '欢迎使用 HBP 平台',
  route: {
    home: '首页',
    dashboard: '工作台',
    message: '消息',
    notice: '公告',
    noticeDetail: '公告详情',
    noticeEdit: '编辑公告',
    noticeAdd: '新建公告',
    contacts: '通讯录',
    my: '我的',
    setting: '设置',
    common: '常用应用',
    pending: '待办事宜',
    completed: '办结事宜',
    handled: '已办事宜',
    taskChange: '转办代理事宜',
    newProcess: '新建流程',
    myDraft: '我的草稿',
    myRequest: '我的请求',
    myRevoke: '可撤销事务'
  },
  components: {
    langSelect: {
      title: '切换语言',
      switchLang: '切换语言成功'
    },
    datePicker: {
      'year': '年',
      'month': '月',
      'date': '日',
      'hour': '时',
      'minute': '分',
      'second': '秒',
      'am': '上午',
      'pm': '下午'
    },
    autoNumber: {
      placeholder: '表单提交后生成编号'
    },
    checkbox: {
      title: '已选择{length}项'
    },
    uploader: {
      title: '上传附件',
      uploadingTitle: '上传附件',
      uploadedTitle: '已上传附件'
    },
    selector: {
      placeholder: '请选择{type}',
      user: '用户',
      org: '组织',
      position: '岗位',
      role: '角色'
    },
    dictionary: {
      fieldOptionsDictionary: '请绑定数据字典'
    },
    resultPage: {
      lost: '您要访问的页面已丢失',
      noRights: '您没有权限去该页面',
      network: '网络连接异常',
      empty: '暂无数据',
      finished: '没有更多数据'
    }
  },
  filters: {
    now: '刚刚',
    minutesAgo: '{time}分钟前',
    hourAgo: '{time}小时前',
    yesterday: '昨天',
    beforeYesterday: '前天',
    formatDate: 'MM月dd日',
    day: '天'
  },
  common: {
    input: '请输入',
    formError: '表单存在不规范值，请检查表单！',
    dialog: {
      warn: '温馨提示',
      title: '提示',
      multipleSelected: '已经选择了多项,请选择一项进行操作!',
      selectedRecords: '请选择记录！'
    },
    button: {
      search: '搜索',
      add: '添加',
      edit: '编辑',
      detail: '明细',
      history: '审批历史',
      ts: '暂存',
      save: '保存',
      close: '关闭',
      remove: '删除',
      refresh: '刷新',
      undo: '重做',
      more: '更多',
      reject: '驳回',
      revoke: '撤销',
      finish: '完成',
      cancel: '取消',
      agree: '同意',
      abandon: '弃权',
      oppose: '反对',
      agreeTrans: '同意流转',
      opposeTrans: '反对流转',
      stop: '终止',
      suspend: '挂起',
      recover: '恢复',
      manage: '管理',
      confirm: '确认',
      chargeback: '退单',
      rejectBill: '驳回',
      closeBill: '关单'
    },
    operate: {
      success: '操作成功',
      fail: '操作失败',
      makeSure: '您确定执行该操作吗？'
    }
  },
  validate: {
    'min_mum': '最少选择{item}项',
    'max_mum': '最多选择{item}项',
    'email': '请输入正确的邮箱地址.',
    'idcard': '请输入有效的身份证.',
    'zip': '请输入正确的邮政编码.',
    'phone': '请输入正确的手机号码.',
    'telephone': '请输入正确的电话号码.',
    'contact': '请输入正确的联系方式.',
    'invalid': '格式无效'
  },
  veeValidations: {
    newPassword: '新密码'
  },
  error: {
    network: '服务器君开小差了，请稍后再试',
    logout: {
      message: '您已被登出，请重新登录',
      title: '确定登出',
      confirmButtonText: '重新登录',
      cancelButtonText: '取消'
    },
    message: '{message}',
    messageCause: '{message}</br>错误原因：{cause}',
    cause: '错误原因：{cause}',
    unknown: '未知错误，错误码：{state}',
    400: '400请求错误',
    401: '401未授权，请登录',
    403: '403拒绝访问',
    404: '404请求地址出错: {url}',
    408: '408请求超时',
    500: '500服务器内部错误',
    501: '501服务未实现',
    502: '502网关错误',
    503: '503服务不可用',
    504: '504网关超时',
    505: '505HTTP版本不受支持',
    state: {
      6010101: '非法请求',
      6020101: '用户名或密码错误'
    }
  },
  // =========================以下是功能国际化============================
  login: {
    logIn: '登录',
    username: '用户名',
    password: '密码',
    seccode: '验证码',
    usernamePlaceholder: '请输入用户名',
    passwordPlaceholder: '请输入密码',
    code: '请输入验证码',
    mobile: '请输入手机号',
    usernameCorrect: '请输入正确的用户名.',
    passwordCorrect: '请输入至少5位的密码.',
    codeCorrect: '请输入正确的验证码.',
    codeLength: '验证码长度为4位',
    msgInit: '发送验证码',
    msgScuccess: '{time}秒后重发',
    remember: '记住账号',
    forget: '忘记密码',
    register: '注册账号',
    copyright: 'All Rights Reserved.'
  },
  my: {
    changePassword: '修改密码',
    setting: '设置',
    switchLang: '切换语言',
    logout: '退出登录',
    logoutMessage: '是否退出？',
    primitivePassword: '原始密码',
    newPassword: '新的密码',
    repeatPassword: '重复密码',
    inputPrimitivePassword: '请输入原始密码',
    inputNewPassword: '请输入新的密码',
    inputRepeatPassword: '请输入重复密码',
    changePasswordSuccess: '修改密码成功！',
    help: '帮助中心',
    about: '关于我们'
  },
  notice: {
    createNotice: '发公告',
    notices: '公告',
    drafts: '我的草稿',
    expired: '已过期'
  }
}
