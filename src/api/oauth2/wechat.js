// 1、引入wechat-oauth包
import OAuth from 'wechat-oauth'

// 2、生成一个OAuth的实例，appId和appSecert作为构造参数
const appId = process.env.VUE_APP_CLIENT_ID
const appSecert = process.env.UE_APP_CLIENT_SECRET

var oauthApi = new OAuth(appId, appSecert)

// 微信登录 https://www.jianshu.com/p/1c48ec65936b
console.info(oauthApi)
