export default {
  language: '繁體中文',
  back: '返回',
  backHome: '返回首頁',
  clear: '清空',
  close: '關閉',
  loading: '加載中...',
  saving: '保存中...',
  company: '',
  platform: 'HBP 平台',
  welcome: '歡迎使用 HBP 平台',
  route: {
    home: '首頁',
    dashboard: '工作台',
    message: '消息',
    notice: '公告',
    noticeDetail: '公告詳情',
    noticeAdd: '新建公告',
    noticeEdit: '編輯公告',
    contacts: '通訊錄',
    my: '我的',
    setting: '設置',
    common: '常用應用',
    pending: '待辦事宜',
    completed: '辦結事宜',
    handled: '已辦事宜',
    taskChange: '轉辦代理事宜',
    newProcess: '新建流程',
    myDraft: '我的草稿',
    myRequest: '我的請求',
    myRevoke: '可撤銷事務'
  },
  components: {
    langSelect: {
      title: '切換語言',
      switchLang: '切換語言成功'
    },
    datePicker: {
      'year': '年',
      'month': '月',
      'date': '日',
      'hour': '時',
      'minute': '分',
      'second': '秒',
      'am': '上午',
      'pm': '下午'
    },
    autoNumber: {
      placeholder: '表單提交後生成編號'
    },
    checkbox: {
      title: '已選擇{length}項'
    },
    uploader: {
      title: '上傳附件',
      uploadingTitle: '上傳附件',
      uploadedTitle: '已上傳附件'
    },
    selector: {
      placeholder: '請選擇{type}',
      user: '用戶',
      org: '組織',
      position: '崗位',
      role: '角色'
    },
    dictionary: {
      fieldOptionsDictionary: '請綁定數據字典'
    },
    resultPage: {
      lost: '您要訪問的頁面已丟失',
      noRights: '您沒有權限去該頁面',
      network: '網絡連接異常',
      empty: '暫無數據',
      finished: '沒有更多數據'
    }
  },
  filters: {
    now: '剛剛',
    minutesAgo: '{time}分鐘前',
    hourAgo: '{time}小時前',
    yesterday: '昨天',
    beforeYesterday: '前天',
    formatDate: 'MM月dd日',
    day: '天'
  },
  common: {
    input: '請輸入',
    formError: '表單存在不規範值，請檢查表單！ ',
    dialog: {
      warn: '溫馨提示',
      title: '提示',
      multipleSelected: '已經選擇了多項,請選擇一項進行操作!',
      selectedRecords: '請選擇記錄！ '
    },
    button: {
      search: '搜索',
      add: '添加',
      edit: '編輯',
      detail: '明細',
      history: '審批歷史',
      ts: '暫存',
      save: '保存',
      close: '關閉',
      remove: '刪除',
      refresh: '刷新',
      undo: '重做',
      more: '更多',
      reject: '駁回',
      revoke: '撤銷',
      finish: '完成',
      cancel: '取消',
      agree: '同意',
      chargeback: '退單',
      rejectBill: '駁回',
      closeBill: '關單',
      stop: '終止',
      suspend: '掛起',
      recover: '恢復',
      manage: '管理',
      confirm: '確認'
    },
    operate: {
      success: '操作成功',
      fail: '操作失敗',
      makeSure: '請問確定執行該操作嗎？ '
    }
  },
  validate: {
    'min_mum': '最少選擇{item}項',
    'max_mum': '最多選擇{item}項',
    'email': '請輸入正確的郵箱地址.',
    'idcard': '請輸入有效的身份證.',
    'zip': '請輸入正確的郵政編碼.',
    'phone': '請輸入正確的手機號碼.',
    'telephone': '請輸入正確的電話號碼.',
    'contact': '請輸入正確的联系方式.',
    'invalid': '格式無效'
  },
  error: {
    network: '服務器君開小差了，請稍後再試',
    logout: {
      message: '您已被登出，可以取消繼續留在該頁面，或者重新登錄',
      title: '確定登出',
      confirmButtonText: '重新登錄',
      cancelButtonText: '取消'
    },
    message: '{message}',
    messageCause: '{message}</br>錯誤原因：{cause}',
    cause: '錯誤原因：{cause}',
    unknown: '未知錯誤，錯誤碼：{state}',
    400: '400請求錯誤',
    401: '401未授權，請登錄',
    403: '403拒絕訪問',
    404: '404請求地址出錯: {url}',
    408: '408請求超時',
    500: '500服務器內部錯誤',
    501: '501服務未實現',
    502: '502網關錯誤',
    503: '503服務不可用',
    504: '504網關超時',
    505: '505HTTP版本不受支持',
    state: {
      6010101: '非法請求',
      6020101: '用戶名或密碼錯誤'
    }
  },
  // =========================以下是功能國際化================== ==========
  login: {
    logIn: '登錄',
    username: '用戶名',
    password: '密碼',
    usernamePlaceholder: '請輸入用戶名',
    passwordPlaceholder: '請輸入密碼',
    code: '請輸入驗證碼',
    mobile: '請輸入手機號',
    usernameCorrect: '請輸入正確的用戶名.',
    passwordCorrect: '請輸入至少5位的密碼.',
    codeCorrect: '請輸入正確的驗證碼.',
    codeLength: '驗證碼長度為4位',
    msgInit: '發送驗證碼',
    msgScuccess: '{time}秒後重發',
    remember: '記住賬號',
    forget: '忘記密碼',
    register: '註冊賬號',
    copyright: 'All Rights Reserved.'
  },
  my: {
    changePassword: '修改密碼',
    setting: '設置',
    switchLang: '切換語言',
    logout: '退出登錄',
    logoutMessage: '是否退出？ ',
    primitivePassword: '原始密碼',
    newPassword: '新的密碼',
    repeatPassword: '重複密碼',
    inputPrimitivePassword: '請輸入原始密碼',
    inputNewPassword: '請輸入新的密碼',
    inputRepeatPassword: '請輸入重複密碼',
    changePasswordSuccess: '修改密碼成功！ ',
    help: '幫助中心',
    about: '關於我們'
  },
  notice: {
    createNotice: '發公告',
    notices: '公告',
    drafts: '我的草稿',
    expired: '已過期'
  }
}
