<template>
  <el-collapse v-model="activeNames">
    <GroupItem
      v-for="tplItem in tplList"
      :ref="tplItem.groupNo"
      :key="tplItem.groupName"
      :tpl="tplItem"
      :form-mode="formMode"
      :form-data="formData"
      @change="groupFormDataChange($event, tplItem)"
    />
  </el-collapse>
</template>
<script>
import GroupItem from "./components/GroupItem.vue";
import formFormat from "./form-format.js";
export default {
  components: {
    GroupItem,
  },
  props: {
    formMode: {
      type: String,
      default: "create", // create,update,detail
    },
    formConfig: {
      type: Array,
      default: () => [],
    },
    actionPublishConfig: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      formData: {},
      tplList: [],
      activeNames: [],
    };
  },
  created() {
    this.formatTpls();
  },
  methods: {
    formatTpls() {
      const { $listen, tplList } = formFormat.call(this, this.formConfig);
      this.$listen = $listen;
      this.tplList = tplList;
      this.actionPublishConfig.forEach((item) => {
        this.registerActionPublish(item.fieldKey, (val) => {
          item.cb(val);
          return true;
        });
      });
    },
    /**
     * 注册监听动态发布
     * 观察者模式，用于监听某一个变量的改变
     */
    registerActionPublish(key, cb) {
      if (!this.$listen) {
        return;
      }
      const { $actionPublish } = this.$listen;
      if (!$actionPublish[key]) {
        $actionPublish[key] = [];
      }
      $actionPublish[key].push(cb);
    },
    /**
     * 设置表单值
     */
    setFieldsValue(data) {
      const { $actionValue } = this.$listen;
      this.tplList.forEach((tpl) => {
        const { groupNo, fields } = tpl;
        const groupData = data[groupNo];
        Object.keys(groupData)
          .filter((v) => v.indexOf("--label") == -1)
          .forEach((field) => {
            const key = `formData.${groupNo}.${field}`;
            $actionValue[key].forEach((f) =>
              f(groupData[field], groupData[field + "--label"])
            );
          });
      });
    },
    /**
     * 组件表单数据变化
     */
    groupFormDataChange(formData, groupTpl) {
      this.formData[groupTpl.groupNo] = formData;
    },
  },
};
</script>