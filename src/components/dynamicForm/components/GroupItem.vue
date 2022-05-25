<template>
  <el-collapse-item :title="tpl.groupName" :name="tpl.groupName">
    <el-form
      ref="hclForm"
      :model="groupFormData"
      :rules="rules"
      :inline="true"
      :validate-on-rule-change="false"
      size="small"
      label-width="180px"
      class="hcl-group-form"
    >
      <template v-for="fieldItem in tpl.fields">
        <el-form-item
          v-if="fieldItem.$show"
          :key="fieldItem.fieldId"
          :ref="fieldItem.fieldId"
          :prop="fieldItem.fieldId"
          :label="fieldItem.name"
          class="hcl-el-form-parse"
        >
          <FormItem
            v-model="groupFormData[fieldItem.fieldId]"
            :item="fieldItem"
            :form-data="formData"
            :form-type="formType"
            :tpl="tpl"
            @change="handleFormChange"
          />
        </el-form-item>
      </template>
    </el-form>
  </el-collapse-item>
</template>
<script>
import FormItem from "./FormItem.vue";
export default {
  components: {
    FormItem
  },
  props: {
    tpl: {
      type: Object,
      default: () => ({}),
    },
    formData: {
      type: Object,
      default: () => ({}),
    },
    formType: {
      type: String,
      default: "create",
    },
  },
  data() {
    return {
      groupFormData: {},
      rules: {},
    };
  },
  created() {
    this.init();
  },
  watch: {
    groupFormData: {
      handler(val) {
        const { groupNo } = this.tpl;
        this.$emit("change", {
          ...this.formData[groupNo],
          ...this.groupFormData,
        });
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    init() {
      if (!this.tpl.$form) {
        return;
      }
      const { formData = {}, rules = {} } = this.tpl.$form;
      const { groupNo = "" } = this.tpl;
      this.groupFormData = {
        ...formData,
        ...this.groupFormData,
      };
      this.rules = {
        ...rules,
      };
    },
    handleFormChange() {

    }
  }
};
</script>