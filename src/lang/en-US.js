export default {
  language: 'English',
  back: 'Back',
  backHome: 'Back dashboard',
  clear: 'Clear',
  close: 'Close',
  loading: 'Loading...',
  saving: 'Saving...',
  company: '',
  platform: 'HBP Platform',
  welcome: 'Welcome HBP platform',
  route: {
    Home: 'Home',
    Dashboard: 'Dashboard',
    message: 'Message',
    notice: 'Notice',
    noticeDetail: 'Notice detail',
    noticeAdd: 'New notice',
    noticeEdit: 'Edit notice',
    contacts: 'Contacts',
    my: 'Me',
    setting: 'Setting',
    common: 'Common',
    pending: 'Pending',
    completed: 'Completed',
    handled: 'Handled',
    taskChange: 'Transfer&Proxy',
    myRevoke: 'Revoke',
    newProcess: 'New',
    myDraft: 'Draft',
    myRequest: 'Request'
  },
  components: {
    langSelect: {
      title: 'Switch lang',
      switchLang: 'Switch lang success'
    },
    datePicker: {
      'year': 'y',
      'month': 'm',
      'date': 'day',
      'hour': 'h',
      'minute': 'min',
      'second': 's',
      'am': 'AM',
      'pm': 'PM'
    },
    autoNumber: {
      placeholder: 'Number generated after submitted'
    },
    checkbox: {
      title: 'Selected {length} item '
    },
    uploader: {
      title: 'Uploader',
      uploadingTitle: 'Uploading',
      uploadedTitle: 'Uploaded'
    },
    selector: {
      placeholder: 'Please select {type}',
      user: 'User',
      org: 'Org',
      position: 'Position',
      role: 'Role'
    },
    dictionary: {
      fieldOptionsDictionary: 'Please bind  the dictionary.'
    },
    resultPage: {
      lost: 'The page you are visiting has been lost',
      noRights: 'You do not have permission to go to this page',
      network: 'Network connection exception',
      empty: 'No Information',
      finished: 'No more data'
    }
  },
  filters: {
    now: 'Just now',
    minutesAgo: '{time} minutes ago',
    hourAgo: '{time} hour ago',
    yesterday: 'Yesterday',
    beforeYesterday: 'Before yesterday',
    formatDate: 'MM/dd'
  },
  common: {
    input: 'Please input',
    formError: 'The form has noncanonical values. Please check the form',
    dialog: {
      warn: 'Warn',
      title: 'Prompt',
      multipleSelected: 'Multiple items have been selected. Please select one to operate!',
      selectedRecords: 'Please select a record'
    },
    button: {
      search: 'Search ',
      add: 'Add ',
      edit: 'Edit ',
      detail: 'detail',
      history: 'history',
      ts: 'Temporary save',
      save: 'Save ',
      close: 'Close',
      remove: 'Delete ',
      refresh: 'Refresh',
      undo: 'Undo',
      more: 'More',
      reject: 'Reject',
      revoke: 'Revoke',
      finish: 'Finish',
      cancel: 'Cancel',
      agree: 'Agree',
      chargeback: 'Chargeback',
      rejectBill: 'rejectBill',
      closeBill: 'closeBill',
      stop: 'Stop',
      suspend: 'Suspend',
      recover: 'Recover',
      manage: 'Manage',
      confirm: 'confirm'
    },
    operate: {
      success: 'Operate success',
      fail: 'Operate fail',
      makeSure: 'Make sure operate?'
    }
  },
  validate: {
    'min_mum': 'Least select {item} ',
    'max_mum': 'Select {item} item at most ',
    'email': 'Please enter the correct email address.',
    'idcard': 'Please enter a valid idcard.',
    'zip': 'Please enter the correct zip code.',
    'phone': 'Please enter the correct phone number.',
    'telephone': 'Please enter the correct telephone number.',
    'contact': 'Please enter the correct contact number.',
    'invalid ': 'Format invalid'
  },
  error: {
    network: 'The server is running short. Please try again later',
    logout: {
      message: 'You have been logged out, you can cancel staying on the page, or login again ',
      title: ' Confirm Logout ',
      confirmButtonText: 'Login again ',
      cancelButtonText: 'Cancel'
    },
    message: '{message}',
    messageCause: '{message}</br>Error reason:{cause}',
    cause: 'Error reason:{cause}',
    unknown: 'Unknown error, error code: {state}',
    400: 'Request error ',
    401: 'Unauthorised, please login ',
    403: 'Denied access ',
    404: 'Request address error: {url}',
    408: 'Request timeout ',
    500: 'Server internal error ',
    501: 'Service not implemented ',
    502: 'Gateway error ',
    503: 'Service unavailable ',
    504: 'Gateway timeout ',
    505: 'HTTP version is not supported ',
    state: {
      6010101: 'Illegal request',
      6020101: 'User name or password error'
    }
  },
  // =========================以下是功能国际化============================
  login: {
    logIn: 'Log in',
    username: 'Username',
    password: 'Password',
    usernamePlaceholder: 'Please enter user name',
    passwordPlaceholder: 'Please enter password',
    code: 'Please enter verification code',
    mobile: 'Please enter phone number',
    usernameCorrect: 'Please enter the correct username.',
    passwordCorrect: 'Please enter a password of at least 5 digits.',
    codeCorrect: 'Please enter the correct verification code.',
    codeLength: 'The verification code length is 4 bits',
    msgInit: 'Send  code',
    msgScuccess: '{time} second',
    remember: 'Remember me',
    forget: 'Forget',
    register: 'Register',
    copyright: 'All Rights Reserved.'
  },
  my: {
    changePassword: 'Change password',
    setting: 'Setting',
    switchLang: 'Switch lang',
    logout: 'Log out',
    logoutMessage: 'Log out?',
    primitivePassword: 'Primitive',
    newPassword: 'New',
    repeatPassword: 'Repeat',
    inputPrimitivePassword: 'Please enter the original password',
    inputNewPassword: 'Please enter a new password',
    inputRepeatPassword: 'Please enter a duplicate password',
    changePasswordSuccess: 'Change password success!',
    help: 'Help',
    about: 'About us'
  },
  notice: {
    createNotice: 'Create',
    notices: 'Notices',
    drafts: 'Drafts',
    expired: 'Expired'
  }
}
