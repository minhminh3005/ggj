<template>
  <div class="btn-group">
    <button class="btn-dropdown btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      <slot name="title"></slot>
    </button>
    <slot></slot>
  </div>
</template>

<script>

export default {
  mounted(){
    $('.dropdown-toggle').dropdown()
  }
}
</script>
<style lang="scss" scoped>
.drop-icon::after {
  font-family: Glyphicons Halflings, sans-serif;
  content: "\e113";
  font-size: 16px;
  font-weight: 300;
  float: right;
  color: #aeaeae;
}
.drop-icon.open::after {
  content: "\e114";
}
.btn-dropdown {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
</style>
