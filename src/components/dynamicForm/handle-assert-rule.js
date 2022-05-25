/**
 * 断言判断
 */

 import mapping from './utils/mapping';
 import validate from './utils/validate';
 
 /**
  * 值对比验证
  * @param {Number|String} value 对比值
  * @param {Object} assertItem 判断对象
  */
 function handleAssert(value, assertItem) {
   if (validate.isEmpty(value)) {
     return false;
   }
   const {
     fieldId,
     type
   } = assertItem;
   const val2 = mapping(this, fieldId);
   if (validate.isEmpty(val2)) {
     return true;
   }
   return (eval(`value ${type} val2`));
 }
 
 export default function(originField) {
   const rules = [];
   const {
     rule,
   } = originField;
   if (Array.isArray(rule) && rule.length) {
     rules.push({
       validator: (r, val, cb) => {
         let checkStatus = true;
         rule.every((i) => {
           try {
             const status = handleAssert.call(this, val, i);
             // 规则未通过，结束循环
             if (!status) {
               checkStatus = false;
               return false;
             }
             // 规则通过，下一条为 ‘或’ 验证通过，结束循环
             if (
               status
               && i.logicalOperator === '||'
             ) {
               checkStatus = true;
               return false;
             }
           } catch (error) {
             console.error(error);
           }
           return true;
         });
         if (!checkStatus) {
           cb(this.$t('gbebit_fw_0007', {
             name: this.$t(originField.name),
           }));
         } else {
           cb()
         }
       },
     });
   }
   return rules;
 }
 