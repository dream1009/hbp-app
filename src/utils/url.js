/**
 * 获得地址栏的某个参数
 * @param       {[type]} name [description]
 * @constructor
 */
export function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

/**
 * 是否是微信
 */
export function validataWechat() {
  return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
}

/**
 * 是否是ip
 * @param ipstr
 * @returns {boolean}
 */
export function isIp(ipstr)
{
  try
  {
    if(ipstr=="" || ipstr==undefined)return false;
    if(!/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){2}\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-4])$/.test(ipstr))
    {
      return false;
    }
    var ls=ipstr.split('.');
    if(ls==null || ls.length!=4 || ls[3]=="0" || parseInt(ls[3])===0)
    {
      return false;
    }
    return true;
  }catch(ee){}
  return false;
}

export function getApi(baseUrl, redirectApi) {
  if (redirectApi) {
    if (isIp(redirectApi) && baseUrl.indexOf('${0}') !== -1) {
      baseUrl = baseUrl.replace('${0}', redirectApi)
    }
  }
  return baseUrl
}
