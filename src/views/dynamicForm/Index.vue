<template>
  <DynamicForm
    ref="dynamic-form"
    :form-mode="formMode"
    :form-config="formConfig"
    :action-publish-config="actionPublishConfig"
    @submit="handleSubmit"
  />
</template>
<script>
import DynamicForm from "@/components/dynamicForm/Index.vue";
import formConfig from "./config.js";
export default {
  components: {
    DynamicForm,
  },
  data() {
    return {
      formMode: "create",
      formConfig: formConfig,
      actionPublishConfig: [
        {
          fieldKey: "formData.basic.name",
          cb: this.handleNameChange,
        },
        {
          fieldKey: "formData.basic.country",
          cb: this.handleCountryChange,
        },
      ],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs["dynamic-form"].setFieldsValue({
        basic: { name: "xxx", "name--label": "xxx111" },
      });
    });
  },
  methods: {
    handleNameChange(val) {
      console.log("name", val);
    },
    handleCountryChange(val) {
      console.log("country", val);
    },
    handleSubmit(formData) {
      console.log(11111, formData);
    },
  },
};
</script>