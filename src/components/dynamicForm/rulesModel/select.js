export default function (origin, cb) {
  const rule = [];
  // 读取规则
  if (origin.required === 1) {
    rule.push({
      required: true,
      message: '请选择',
      trigger: 'change',
    });
  }
  return rule;
};
