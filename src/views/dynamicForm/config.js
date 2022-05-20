export default [
  {
    groupNo: "basic",
    groupName: "基本信息",
    fields: [
      {
        "component": "el-input",
        "fieldId": "name",
        "name": "姓名",
        "display": 1,
        "required": 1,
        "edit": 1,
      },
      {
        "component": "el-select",
        "fieldId": "country",
        "name": "国家",
        "display": 1,
        "required": 1,
        "edit": 1,
        "options": [
          {
            label: "中国",
            value: "CN"
          },
          {
            label: "美国",
            value: "US"
          }
        ]
      },
    ]
  }
]