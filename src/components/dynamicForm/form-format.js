import models from "./rulesModel";
import handleAssertRule from './handle-assert-rule';
import validate from './utils/validate';

/**
 * 设置索引key
 */
 function setIndex(parents = [], key = 'formData') {
  const index = [...parents];
  index.push(key);
  return index;
}

/**
 * 处理表单字段
 */
 function handleFormFieldList(originFields, groupItem, $listen) {
  const formData = {};
  const rules = {};
  const fields = originFields.map((o) => {
    const fieldItem = {
      ...o,
      $index: setIndex(groupItem.$index, o.fieldId),
      $listen,
    };
    const model = models[o.component];
    if (!model) {
      return fieldItem;
    }
    // const assertRule = handleAssertRule.call(this, o);
    formData[o.fieldId] = validate.isSet(o.default) ? o.default : '';
    rules[o.fieldId] = model.call(this, o);
    // fieldItem.$tpl = item;
    fieldItem.$show = o.display === 1;
    fieldItem.$disabled = o.edit !== 1;
    // if (o.calculation) {
    //   fieldItem.$calc = (_this, isInTable, rowNumber) => {
    //     return handleCalc.call(_this, fieldItem, { isInTable, rowNumber });
    //   }
    // }
    if (o.control) {
      // 存的json中的control如果是Object，转成Array处理下
      if (!Array.isArray(o.control)) {
        o.control = [o.control];
      }
      $listen.$publish[o.fieldId] = [];
      o.control.forEach((i) => {
        const {
          fields,
          value,
        } = i;
        Array.isArray(fields) && fields.forEach((field) => {
          if (!$listen.$subscribe[field]) {
            $listen.$subscribe[field] = [];
          }
          $listen.$subscribe[field].push({
            ...o,
            rules,
            targetVal: value,
            validator: (watchValue) => {
              return watchValue === value;
            },
          });
        });
      });
      // 需要监听当前组件的值变更
      fieldItem.$$watchValue = (value) => {
        const fieldId = o.fieldId;
        if ($listen.$publish[fieldId]) {
          const map = {};
          $listen.$publish[fieldId].forEach(({ fn, index }) => {
            // fn(value) 的返回值是对应组件的editStatus
            // 当发布者中的订阅函数未执行，或执行结果为true时，继续执行该其他订阅
            // 即：当执行到为false时，不执行其余函数
            // 目的是为了解决多个字段控制同一个字段时的互斥问题
            if (map[index] === undefined || map[index] === true) {
              map[index] = fn(value);
            }
          });
        }
      };
    }

    return fieldItem;
  });

  return {
    formData,
    rules,
    fields,
  };
}

function format(list = []) {
  if (!Array.isArray(list)) {
    return [];
  }
  const rootIndex = setIndex();
  const $listen = {
    $publish: {},       // 发布者
    $subscribe: {},     // 订阅者
    $tranform: {},      // 数据转换
    $actionValue: {},   // 动态赋值
    $actionPublish: {}, // 动态响应的发布
  };
  const tplList = list.map((i) => {
    const groupItem = {
      ...i,
      $index: setIndex(rootIndex, i.groupNo),
      $listen,
    };
    // form表单
    const {
      fields,
      formData,
      rules,
    } = handleFormFieldList.call(this, i.fields, groupItem, $listen);
    groupItem.fields = fields;
    groupItem.$form = {
      formData,
      rules,
    };
    return groupItem;
  });

  return {
    tplList,
    $listen,
  };
};

export default format;