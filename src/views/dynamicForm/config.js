export default [
  {
    groupNo: "basic",
    groupName: "基本信息",
    fields: [
      {
        component: "el-input",
        fieldId: "name",
        name: "姓名",
        default: "",
        display: 1,
        required: 1,
        edit: 1,
        minLength: 5,
        maxLength: 10
      },
      {
        component: "el-select",
        fieldId: "country",
        name: "国家",
        default: "",
        multiple: false,
        display: 1,
        required: 1,
        edit: 1,
        options: [
          {
            label: "中国",
            value: "CN"
          },
          {
            label: "美国",
            value: "US"
          },
          {
            label: "日本",
            value: "JPN"
          }
        ],
        control: [
          {
            value: "CN",
            fields: ["formData.basic.name"]
          },
          {
            value: "US",
            fields: ["formData.basic.name"]
          },
          {
            value: "US",
            fields: ["formData.basic.sex"]
          }
        ]
      },
      {
        component: "el-radio",
        fieldId: "sex",
        name: "性别",
        default: 0,
        display: 1,
        required: 1,
        edit: 1,
        options: [
          {
            label: "男",
            value: 0
          },
          {
            label: "女",
            value: 1
          },
        ],
      },
      {
        component: "el-checkbox",
        fieldId: "education",
        name: "学历",
        default: 0,
        display: 1,
        required: 1,
        edit: 1,
        options: [
          {
            label: "大专",
            value: 0
          },
          {
            label: "本科",
            value: 1
          },
          {
            label: "硕士",
            value: 2
          },
          {
            label: "博士",
            value: 3
          },
        ],
      }
    ]
  }
]