/* eslint-disable no-unused-vars */
/**
 * 对象映射
 */

// Object Key 对象属性查找封装
class Mapping {
  /**
   * 字符串映射对象
   *
   * @param {object} obj 查找的对象
   * @param {string} key 查找的属性
   *
   * @return {any}
   */
  mapping(obj, key) {
    if (!obj || !key) {
      return undefined;
    }
    if (key.includes('..')) {
      return undefined;
    }
    if (key.indexOf('.') === 0 || key.lastIndexOf('.') === key.length - 1) {
      return undefined;
    }
    if (key.indexOf('.') > 0) {
      const keys = key.split('.');
      let val;
      let o = obj;
      for (let i = 0; i < keys.length; i += 1) {
        const subKey = keys[i];
        val = this.get(o, subKey);
        o = val;
        if (typeof val === 'undefined') {
          break;
        }
      }
      return val;
    }
    return this.get(obj, key);
  }

  /**
   * 获取数据
   * 支持处理数组指针
   * @param {Object} obj 属性对象
   * @param {String} key 属性名称
   * @return {Any}
   */
  get(obj, key) {
    if (!key) {
      return undefined;
    }
    // 匹配数组指针
    const match = key.match(/\[(\d*)\]/);
    if (match) {
      const pre = key.substring(0, match.index);
      const [
        index,
        num,
      ] = match;
      if (!num) {
        return undefined;
      }
      const list = pre.length > 0 ? obj[pre] : obj;
      const val = list[+num];
      if (!val) {
        return undefined;
      }
      if (key.length - index.length !== match.index) {
        return this.get(val, key.substring(match.index + index.length));
      }
      return val;
    }
    return obj[key];
  }

  /**
   * 数据根据key的映射进行组装
   */
  each(map, data) {
    const obj = {};
    Object.keys(map).forEach((i) => {
      obj[i] = this.mapping(data, map[i]);
    });
    return obj;
  }
}

// 兼容导出方法
function exp(obj, key) {
  if (this instanceof exp) {
    return new Mapping();
  }
  const mp = new Mapping();
  return mp.mapping(obj, key);
};

if (typeof module === 'object' && module.exports) {
  module.exports = exp;
} else {
  this.mapping = exp;
}