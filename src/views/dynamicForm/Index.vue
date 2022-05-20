<template>
  <DynamicForm
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
  methods: {
    handleSubmit(formData) {
      console.log(11111, formData);
    },
  },
};
</script>