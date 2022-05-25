export default function (origin, cb) {
  const {
    required,
    minLength,
    maxLength
  } = origin;

  const rule = [];
  // 读取规则
  if (required === 1) {
    rule.push({
      required: true,
      message: '请输入',
      trigger: 'change',
    });
  }
  if (minLength || maxLength) {
    const ruleItem = {};
    if (minLength) {
      ruleItem.min = minLength;
    }
    if (maxLength) {
      ruleItem.max = maxLength;
    }
    if (minLength && maxLength) {
      ruleItem.message = `长度必须在${minLength}-${maxLength}之间`;
    } else
    if (maxLength) {
      ruleItem.message = `最大长度为${maxLength}`;
    } else
    if (minLength) {
      ruleItem.message = `最小长度为${minLength}`;
    }
    rule.push({
      ...ruleItem,
      trigger: 'change'
    });
  }

  return rule;
};
