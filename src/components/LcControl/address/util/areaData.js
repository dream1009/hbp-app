import { getData } from '@/api/platform/address'
import areaData from '@/utils/json/areaData.json'

export function getAreaData() {
  return new Promise((resolve, reject) => {
      resolve(areaData)
  })
}

