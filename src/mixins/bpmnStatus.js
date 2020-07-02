
import { statusOptions } from '@/constants/bpmn'
export default {
  methods: {
    _getStatus(status) {
      try {
        if (typeof status === 'boolean') {
          return statusOptions.find(x => x.value === status).label
        }
        return status ? statusOptions.find(x => x.value === status).label : ''
      } catch (e) {
        return ''
      }
    },
    _getStatusType(status) {
      try {
        return status ? statusOptions.find(x => x.value === status).type : ''
      } catch (e) {
        return ''
      }
    }
  }
}
export const getStatus = (status) => {
  if (typeof status === 'boolean') {
    return statusOptions.find(x => x.value === status).label
  }
  return status ? statusOptions.find(x => x.value === status).label : ''
}

