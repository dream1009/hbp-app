import { getImage as getImageById, getFile as getFileById } from '@/api/platform/attachment'
var imageCache = {}
export function getImage(id) {
  return new Promise((resolve, reject) => {
    if (imageCache[id]) {
      resolve(imageCache[id])
      return
    }
    getImageById({ id: id })
      .then(response => {
        if (response.data.byteLength <= 0) {
          resolve()
          return
        }
        const base64 = 'data:image/png;base64,' + btoa(new Uint8Array(response.data)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
        )
        // console.log(base64)

        imageCache[id] = base64
        resolve(base64)
      }).catch(error => {
        reject(error)
      })
  })
}

export function getFile(id, type) {
  return new Promise((resolve, reject) => {
    if (imageCache[id]) {
      resolve(imageCache[id])
      return
    }
    getFileById({ 'id': id, 'type': type }).then(response => {
      if (response.data.byteLength <= 0) {
        resolve()
        return
      }
      console.log('getFile', response)
      const base64 = // btoa(response.data)
      btoa('data:application/pdf;base64,' + new Uint8Array(response.data)
        // .reduce((data, byte) => data + String.fromCharCode(byte), '')
      )
      // console.log(base64)

      imageCache[id] = base64
      resolve(base64)
    }).catch(error => {
      reject(error)
    })
  })
}
