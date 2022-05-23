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
    v-else-if="item.component === 'el-radio'"
    v-model="inpValue"
    :disabled="inpDisabled"
    @change="elRadioChange"
  >
    <el-radio
      v-for="(radioItem, index) in optionList"
      :key="`${radioItem.value}_${index}`"
      :label="radioItem.value"
    >
      {{ radioItem.label }}
    </el-radio>
  </el-radio-group>
  <el-checkbox-group
    v-else-if="item.component === 'el-checkbox'"
    v-model="inpValue"
    :disabled="inpDisabled"
    @change="elCheckBoxChange"
  >
    <el-checkbox
      v-for="(checkboxItem, index) in optionList"
      :key="`${checkboxItem.value}_${index}`"
      :label="checkboxItem.label"
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
      inpValue: null,
      optionList: [],
      editStatus: true,
      defaultInputMaxLength: 20,
      defaultTextareaMaxLength: 100,
      defaultPlaceholder: {
        input: "请输入",
        select: "请选择",
      },
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
      if (this.item.component === "el-input") {
        return this.item.placeholder || this.defaultPlaceholder.input;
      }
      return this.item.placeholder || this.defaultPlaceholder.select;
    },
  },
  watch: {
    value: {
      handler(val) {
        this.inpValue = val;
      },
      immediate: true,
    },
    inpValue: {
      handler() {
        if (this.item.$$watchValue) {
          this.item.$$watchValue(this.inpValue);
        }
        this.hanldeInpValueChange();
      },
      immediate: true,
    },
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
     * 默认值和options
     */
    init() {
      if (this.item.default !== undefined) {
        this.inpValue = this.item.default;
      }
      const { fieldId, component, $index, $listen, options } = this.item;
      switch (component) {
        case "el-select":
          if (this.item.multiple) {
            this.inpValue = [];
          }
          this.optionList = options;
          break;
        case "el-radio":
          this.optionList = options;
          break;
        case "el-checkbox":
          this.inpValue = [];
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
    initChange(component, val) {
      switch (component) {
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
      // 当前字段的值，控制其他字段不可编辑
      waitSubscribe.forEach((i) => {
        let publisher = $listen.$publish[i.fieldId];
        const fn = (value) => {
          if (Array.isArray(value)) {
            // 多选的处理
            this.editStatus = !value.includes(i.targetVal);
          } else {
            this.editStatus = !(i.targetVal === value);
          }
          return this.editStatus;
        };
        publisher && publisher.push({ fn, index });
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
        this.$actionPublish = this.$actionPublish.filter((f) => {
          return f(this.inpValue, this);
        });
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
    elInputChange(val) {},
    elSelectChange(val) {},
    elRadioChange(val) {},
    elCheckBoxChange(val) {},
  },
};
</script>