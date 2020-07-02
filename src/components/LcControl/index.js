// LC定制的控件
import LcField from './field'
import LcRadio from './radio'
import LcCheckbox from './checkbox'
import LcChecker from './checker'
import LcPicker from './picker'
import LcDatePicker from './date-picker'
import LcUploader from './uploader'
import LcAddress from './address'
import LcAutoNumber from './auto-number'
import LcDictionary from './dictionary'
import LcSelector from './selector'
import LcCustomDialog from './custom-dialog'
import LcLinkdata from './linkdata'
import LcEditor from './editor'
import LcSignature from './signature'
import LcSwitch from './switch'
import LCType from './type'

import LcBpmInstHis from './bpm-inst-his'
import LcBpmLink from './bpm-link'
import LcApprovalHistory from './approval-history'
import LcFlowDiagram from './flow-diagram'
import LcApprovalOpinion from './approval-opinion'

import LcLabel from './label'
import LcDesc from './desc'
import LCHyperlink from './hyperlink'
import LCMap from './map'
import LCMapDevice from './mapdevice'
import LCWaterMeter from './meter'
import LcDaterange from './daterange'
import LcRate from './rate'
import LCMainWorkorder from './mainworkorder'
import LCWaterMateriel from './materiel'

const version = '1.0.0'
const components = [
  LcField,
  LcRadio,
  LcCheckbox,
  LcChecker,
  LcPicker,
  LcDatePicker,
  LcUploader,
  LcAddress,
  LcAutoNumber,
  LcDictionary,
  LcSelector,
  LcCustomDialog,
  LcLinkdata,
  LcEditor,
  LcSignature,
  LcSwitch,
  LCType,

  LcBpmInstHis,
  LcBpmLink,
  LcApprovalHistory,
  LcFlowDiagram,
  LcApprovalOpinion,

  LcDesc,
  LcLabel,
  LCHyperlink,
  LCMap,
  LCMapDevice,
  LcDaterange,
  LCWaterMeter,
  LcRate,
  LCMainWorkorder,
  LCWaterMateriel
]

const install = Vue => {
  components.forEach(Component => {
    Vue.use(Component)
  })
}
/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export {
  install,
  version,
  LcField,
  LcRadio,
  LcCheckbox,
  LcChecker,
  LcPicker,
  LcDatePicker,
  LcUploader,
  LcAddress,
  LcAutoNumber,
  LcDictionary,
  LcSelector,
  LcCustomDialog,
  LcLinkdata,
  LcEditor,
  LcSignature,
  LcSwitch,
  LCType,

  LcBpmInstHis,
  LcBpmLink,
  LcApprovalHistory,
  LcFlowDiagram,
  LcApprovalOpinion,

  LcDesc,
  LcLabel,
  LCHyperlink,
  LCMap,
  LcDaterange,
  LcRate,
  LCMainWorkorder,
  LCWaterMateriel
}

export default {
  install,
  version
}
