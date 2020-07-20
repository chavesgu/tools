<template>
  <div :class="{labelTop: labelPosition==='top'}" class="fts-input">
    <div v-if="label && labelPosition==='top'" class="label top">{{ label }}</div>
    <div :style="{height: inputHeight+'px'}" class="field-wrap">
      <div
        v-if="label && labelPosition==='left'"
        :style="{width: labelWidth+'px'}"
        class="label left"
      >{{ label }}</div>
      <div @click.stop="$emit('click')" class="field">
        <input
          :value="value"
          :maxLength="maxLength"
          :type="type"
          :placeholder="placeholder"
          :readonly="readonly"
          :disabled="disabled"
          @input="e => $emit('change', e.target.value)"
          @focus="$emit('focus')"
          @blur="$emit('blur')"
        >
      </div>
      <slot name="button"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'fts-input',
    model: {
      prop: 'value',
      event: 'change',
    },
    props: {
      value: {
        type: String,
      },
      maxLength: {
        type: Number,
        default: 99,
      },
      label: {
        type: String,
      },
      labelWidth: {
        type: Number,
        default: 90,
      },
      labelPosition: {
        type: String,
        default: 'top',
        validator(value) {
          return ['top', 'left'].indexOf(value) !== -1;
        },
      },
      inputHeight: {
        type: Number,
        default: 45,
      },
      type: {
        type: String,
        default: 'text',
        validator(value) {
          return ['text', 'tel', 'number', 'password'].indexOf(value) !== -1;
        },
      },
      placeholder: {
        type: String,
      },
      readonly: {
        type: Boolean,
        default: false,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>

<style scoped lang="less">
  @fts-input-bg-color: #fff;
  @fts-input-text-color: #282828;
  @fts-input-border-color: #f2f2f2;
  @fts-input-placeholder-color: #bbbbbb;
  @fts-input-text-size: 16px;
  @fts-input-caret-color: #3C44FF;
.fts-input{
  width: 100%;
  &.labelTop{
    padding-top: 12px;
  }
  .label{
    font-size: 12px;
    color: @fts-input-text-color;
  }
  .field-wrap{
    /*height: 45px;*/
    border-bottom: 1px solid @fts-input-border-color;
    display: flex;
    align-items: center;
    .field{
      flex: 1;
      height: 100%;
      input{
        width: 100%;
        height: 100%;
        line-height: 100%;
        color: @fts-input-text-color;
        font-size: @fts-input-text-size;
        border: none;
        margin: 0;
        padding: 0;
        background: @fts-input-bg-color;
        caret-color: @fts-input-caret-color;
        &::placeholder{
          color: @fts-input-placeholder-color;
        }
        &[disabled]{
          background: @fts-input-bg-color;
        }
      }
    }
  }
}
</style>
