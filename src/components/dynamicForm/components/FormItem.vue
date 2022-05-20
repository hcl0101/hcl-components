<template>
  <el-input
    v-if="item.component === 'el-input'"
    v-model="inpValue"
    clearable
    :maxlength="inpMaxLength"
    :type="item.inputType || 'text'"
    :placeholder="placeholder"
    :disabled="inpDisabled"
    @change="elInputChange"
  ></el-input>
  <el-select
    v-else-if="item.component === 'el-select'"
    v-model="inpValue"
    clearable
    collapse-tags
    :placeholder="placeholder"
    :multiple="item.multiple"
    :filterable="item.filterable"
    :remote="item.remote"
    :remote-method="selectRemoteEvt"
    :disabled="inpDisabled"
    @change="elSelectChange"
  >
    <el-option
      v-for="(optionItem, index) in optionList"
      :key="`${optionItem.value}_${index}`"
      :label="optionItem.label"
      :value="optionItem.value"
    />
  </el-select>
  <el-radio-group
    v-else-if="item.componentName === 'el-radio'"
    v-model="inpValue"
    @change="elRadioChange"
  >
    <el-radio
      v-for="(radioItem, index) in optionList"
      :key="`${radioItem.value}_${index}`"
      :label="radioItem.value"
      :disabled="inpDisabled"
    >
      {{ radioItem.label }}
    </el-radio>
  </el-radio-group>
  <el-checkbox-group
    v-else-if="item.componentName === 'el-checkbox'"
    v-model="inpValue"
    @change="elCheckBoxChange"
  >
    <el-checkbox
      v-for="(checkboxItem, index) in optionList"
      :key="`${checkboxItem.value}_${index}`"
      :label="checkboxItem.value"
      :disabled="inpDisabled"
    >
      {{ checkboxItem.label }}
    </el-checkbox>
  </el-checkbox-group>
  <el-date-picker
    v-else-if="item.component === 'el-date-picker'"
    v-model="inpValue"
    type="date"
    value-format="yyyy-MM-dd"
    :placeholder="placeholder"
    :readonly="inpReadonly"
    :disabled="inpDisabled"
    :picker-options="item.pickerOptions ? item.pickerOptions : {}"
    @change="elInputChange"
  />
</template>
<script>
export default {
  name: "",
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    item: {
      type: Object,
      default: () => ({}),
    },
    tpl: {
      type: Object,
      default: () => ({}),
    },
    value: null,
  },
  data() {
    return {
      inpValue: "",
      optionList: [],
      editStatus: true,
      defaultInputMaxLength: 20,
      defaultTextareaMaxLength: 100,
      inputDefaultPlaceholder: "请输入",
      selectDefaultPlaceholder: "请选择"
    };
  },
  computed: {
    inpDisabled() {
      if (this.item.$disabled) {
        return true;
      }
      return this.editStatus ? false : true;
    },
    inpMaxLength() {
      if (this.item.maxlength) {
        return this.item.maxlength;
      }
      if (this.item.component === "el-input-textarea") {
        return this.defaultTextareaMaxLength;
      } else {
        return this.defaultInputMaxLength;
      }
    },
    placeholder() {
      if (this.item.component === 'el-input') {
        return this.item.placeholder || this.inputDefaultPlaceholder;
      }
      return this.item.placeholder || this.selectDefaultPlaceholder;
    }
  },
  watch: {
    formData: {
      handler() {
        if (this.item.$calc) {
          if (this.calcTimer) {
            clearTimeout(this.calcTimer);
          }
          this.calcTimer = setTimeout(() => {
            this.inpValue = this.item.$calc();
          }, 300);
        }
      },
      deep: true,
      immediate: true,
    },
    inpValue: {
      handler() {
        this.hanldeInpValueChange();
      },
      deep: true,
    },
  },
  mounted() {
    this.init();
    this.handleSubscribe();
    this.initActionValue();
    this.initWatchValue();
  },
  beforeDestroy() {
    this.removePublish();
  },
  methods: {
    /**
     * 初始化
     */
    init() {
      const { fieldId, component, $index, $listen, options } = this.item;
      switch (component) {
        case "el-select":
        case "el-radio":
          this.optionList = options;
          break;
      }
    },
    /**
     * 初始化动态值
     */
    initActionValue() {
      const { $index, $listen, component } = this.item;
      // 动态赋值注册
      const [, groupNo, fieldId] = $index;
      const currentFieldIndex = $index.join(".");
      const actionCallback = (newValue, newLabel) => {
        this.inpValue = newValue;
        if (newLabel === undefined) {
          // 不存在的话，通过value取找对应的label
          this.initChange(component, newValue);
        } else {
          // 存在就直接写入
          this.formData[groupNo][fieldId + "--label"] = newLabel;
        }
      };
      if (!$listen.$actionValue[currentFieldIndex]) {
        $listen.$actionValue[currentFieldIndex] = [];
      }
      $listen.$actionValue[currentFieldIndex].push(actionCallback);
    },
    /**
     * 注入数据时，触发change事件
     */
    initChange(componentName, val) {
      switch (componentName) {
        case "el-radio":
          this.elRadioChange(val);
          break;
        case "el-checkbox":
          this.elCheckBoxChange(val);
          break;
        case "el-select":
          this.elSelectChange(val);
          break;
        case "el-input":
        case "el-date-picker":
          this.elInputChange(val);
          break;
      }
    },
    /**
     * 初始化监听
     */
    initWatchValue() {
      const { $index, $listen } = this.item;
      const currentFieldIndex = $index.join(".");
      if (!$listen.$actionPublish[currentFieldIndex]) {
        this.$actionPublish = null;
        return;
      }
      this.$actionPublish = $listen.$actionPublish[currentFieldIndex];
    },
    /**
     * 处理订阅
     */
    handleSubscribe() {
      const { $index, $listen, fieldId } = this.item;
      const index = $index.join(".");
      const waitSubscribe = $listen.$waitSubscribe[index];
      if (!waitSubscribe) {
        return;
      }
      waitSubscribe.forEach((i) => {
        let publisher = $listen.$publish[i.fieldId];
        const fn = (value) => {
          this.editStatus = this.inpValue === value;
        };
        if (publisher) {
          publisher.push(fn);
        }
      });
    },
    /**
     * 从发布者中移除订阅
     */
    removePublish() {
      const { $listen, fieldId } = this.item;
      const { $publish } = $listen;
      const key = `${fieldId}`;
      if ($publish[key]) {
        delete $publish[key];
      }
    },
    /**
     * 处理inpValue的例外监听
     */
    hanldeInpValueChange() {
      if (Array.isArray(this.$actionPublish)) {
        this.$actionPublish = this.$actionPublish.filter((f) =>
          f(this.inpValue, this)
        );
      }
    },
    /**
     * select远程搜索
     */
    selectRemoteEvt(label) {
      const { searchUrl, searchField } = this.item;
      const params = {};
      if (label) {
        params[searchField] = label;
      }
      request({
        url: searchUrl,
        method: "get",
        params,
      }).then((res) => {
        // 根据实际数据结构进行调整
        this.optionList = res;
      });
    },
    elInputChange() {},
    elSelectChange() {},
    elRadioChange() {},
    elCheckBoxChange() {},
  },
};
</script>