<template>
  <div :class="typePage == 1 ? 'estimate-c' : 'estimate-c-request'">
    <div class="estimate-c-title">
      <slot name="title"></slot>
    </div>
    <div class="estimate-c-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
    props: {
      typePage : {
        type : Number,
        default : 0
      }
},
    computed: {
      
    },
  }
</script>

<style lang="scss" scoped>
@import "@@/../common/assets/variables.scss";
.estimate-c {
  @media screen and (min-width: $screen-lg) {
    margin: 28px 0;
    display: flex;
    flex-direction: row;
    width: 100%;
    .estimate-c-title {
      display: flex;
      flex-direction: column;
      width: 144px;
      margin-right: 70px;
    }
    .estimate-c-content {
      width: 635px;
    }
  }
  @media screen and (min-width: 320px) and (max-width: $screen-lg - 1) {
    display: flex;
    flex-direction: column;
    margin: 24px 0;
    .estimate-c-title {
      display: flex;
      flex-direction: row;
      margin-bottom: 6px;
      align-items: center;
    }
  }
}
.estimate-c-request {
  display: flex;
  margin: 28px 0;
  flex-direction: row;
  width: 100%;
  @media screen and (min-width: $screen-lg) {
    .estimate-c-title {
      display: flex;
      flex-direction: column;
      width: 144px;
      margin-right: 70px;
    }
    .estimate-c-content {
      width: 635px;
    }
  }
  @media screen and (min-width: 320px) and (max-width: $screen-lg - 1) {
    .estimate-c-title {
      display: flex;
      flex-direction: row;
      margin-bottom: 6px;
      align-items: center;
    }
  }
}
</style> 