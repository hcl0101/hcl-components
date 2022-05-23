<template>
  <DynamicForm
    ref="dynamic-form"
    :form-mode="formMode"
    :form-config="formConfig"
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
    };
  },
  mounted() {
    // const fieldKey = "formData.basic.name";
    // this.$refs["dynamic-form"].registerActionPublish(fieldKey, (val) => {
    //   console.log(1111, val);
    // });
  },
  methods: {
    handleSubmit(formData) {
      console.log(11111, formData);
    },
  },
};
</script>