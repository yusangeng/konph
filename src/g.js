/**
 * 获取全局对象
 * @author yusangeng
 */

const getGlobal = new Function('return this')

export default getGlobal()
