<template>
  <section class="w-1000 flex space-between f-t-frame">
    <div class="f-t-title">{{ $t('1') }}</div>
    <div v-for="(text, index) in listText" :key="index">
      <div class="f-t-c-frame">
        <span class="f-t-text collapsed" :data-target="'#' + index" data-toggle="collapse" :aria-controls="index">{{ text.title }}</span> 
      </div>
      <div class="collapse" :id="index">
        <div style="padding: 6px 20px 16px;">
          <span class="f-t-text-hided" v-html="text.description"></span> 
        </div>
      </div>
    </div>
    <div class="f-t-line-last"></div>
  </section>
</template>
<script>
import i18n from '@@/lang/components-desktop/systemtrade-fixed-text.json'

export default {
  i18n: {
    messages: i18n,
  },
  computed :{
    listText(){
      return [ 
      {
        title: this.$t('2'), 
        description: this.$t('13') 
      },
      {
        title: this.$t('3'), 
        description: this.$t('14') 
      },
      {
        title: this.$t('4'), 
        description: this.$t('15')  
      },
      {
        title: this.$t('5'), 
        description: this.$t('16') 
      },
      {
        title: this.$t('6'), 
        description: this.$t('17') 
      },
      {
        title: this.$t('7'), 
        description: this.$t('18') 
      },
      {
        title: this.$t('8'), 
        description: this.$t('19') 
      },
      {
        title: this.$t('9'), 
        description: this.$t('20') 
      },
      {
        title: this.$t('10'), 
        description: this.$t('21') 
      },
      {
        title: this.$t('11'), 
        description: this.$t('22') 
      },
      {
        title: this.$t('12'), 
        description: this.$t('23') 
      }
    ]
    }
  },
}
</script>
<style lang="scss" scoped>
.f-t-frame {
  margin-top: 58px;
  flex-direction: column;
  .f-t-text-hided {
    font: normal normal normal 15px/25px Meiryo, sans-serif;
    color: #5e5e5e;
  }
  .f-t-c-frame {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0 6px 0;
    cursor: pointer;
    margin-right: 6px;
    border-top: 1px solid #ebebeb;
    :nth-child(1) {
      border-top: 1px solid transparent;
    }
    .f-t-text {
      font: normal normal bold 18px/27px Meiryo, sans-serif;
      width: 100%;
      color: #666;
    }
    .icon-cls {
      width: 14px;
      height: 14px;
    }
  }
  .f-t-title {
    font: normal normal bold 23px/34px Meiryo, sans-serif;
    color: #73cdd6;
    border-bottom: 3px solid #73cdd6;
  }
  .f-t-line-last {
    background-color: #888;
    width: 100%;
    height: 1px;
  }
  .f-t-text::after {
    font-family: Glyphicons Halflings, sans-serif;
    content: "\e113";
    font-size: 16px;
    font-weight: 300;
    float: right;
    color: #aeaeae;
  }
  .f-t-text.collapsed::after {
    content: "\e114";
  }
}
</style>
