<template>
  <div>
    <div class="categories">
      <div
        class="item"
        v-for="(item, idx) in skillShare"
        :key="'cate' + idx"
        :class="[{'item-rm': idx > 7}, checlClass(idx)]"
      >
        <a :href="`/tools/search?large=${item.id}`">{{ item.id === 3 ? $t('9') : item.name }}</a>
        <div>{{ item.count ? `${item.count} ${$t('5')}` : $t('6') }}</div>
      </div>
    </div>
    <div id="toggle" class="btn-readmore" @click="onToggle">
      {{ textToggle }}
      <ChevronDown class="caret-icon icon-cls" />
    </div>
    <div class="illustrator">
      <div class="img-wrapper">
        <Lzimg :data-src="'/img/assets/pc/common/handly.png'" />
      </div>
      <div class="content">
        <div class="title">{{ $t('1') }}</div>
        <div class="cont">
          {{ $t('2') }}
          {{ $t('3') }}
        </div>
        <div class="cn-btn">
          <a href="/post/1/15356" class="button no-underlying">{{ $t('4') }}</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Lzimg from '@@/../components/Lzimg.vue'
import ChevronDown from '@@/../components/icons/ChevronDown.vue'
import i18n from '@@/lang/components-desktop/categories-list.json'

export default {
  i18n: {
    messages: i18n,
  },
  props: {
    title: String,
    info: String,
    skillShare: {
      type: Array,
      default: () => []
    }
  },
  components: {
    ChevronDown,
    Lzimg
  },
  data() {
    return {
      textToggle: this.$t('8'), // 8 see all 7 hide
      isOpen: false
    }
  },
  methods: {
    checlClass(idx) {
      if(idx < 8) return ''
      return this.isOpen ? 'open-item' : 'close-item'
    },
    onToggle() {
      if (!$('#toggle').hasClass('open')) {
        this.isOpen = true
        $('#toggle').addClass('open')
        this.textToggle = this.$t('7')
      } else {
        this.isOpen = false
        $('#toggle').removeClass('open')
        this.textToggle = this.$t('8')
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@@/../common/assets/variables.scss';
.categories {
  display: flex;
  flex-wrap: wrap;
  padding: 30px 0;
  transition: all 0.5s;
  .item {
    a {
      color: #5f95eb;
      text-decoration: underline;
      font-weight: bold;
      &:hover {
        color: #3d7ce0;
      }
    }
    div {
      margin-top: 10px;
    }
    width: 25%;
    margin-bottom: 30px;
  }
}
/deep/ .bg-handly {
  width: 200px;
  height: 100px;
}
.illustrator {
  margin-top: 90px;
  display: flex;
  justify-content: space-between;
  .content {
    width: 50%;
    .title {
      font-weight: bold;
      font-size: 19px;
    }
    .cont {
      color: #474747;
      margin: 20px 0;
      font-size: 15px;
      padding-bottom: 10px;
    }
    .button {
      background: #474747;
      color: #fff;
      font-weight: bold;
      padding: 10px 20px;
      cursor: pointer;
      width: fit-content;
      font-size: 15px;
      &:hover {
        background: #313131;
      }
    }
  }
}
.img-wrapper {
  display: flex;
  align-items: center;
  height: 200px;
  overflow: hidden;
  width: 40%;
  img {
    max-width: 370px;
  }
}
.btn-readmore {
  display: none;
}
@media only screen and (min-width: $screen-xs + 1) {
  .item-rm {
    opacity: 1 !important;
    height: auto !important;
    margin-bottom: 30px !important;
  }
}
@media only screen and (max-width: $screen-sm) {
  .categories {
    padding: 0;
    .item {
      width: 33%;
    }
  }
  .illustrator {
    flex-direction: column;
    .img-wrapper {
      margin: 0 auto;
      width: 50%;
    }
    .content {
      margin: 0 auto;
      margin-top: 20px;
    }
    .cn-btn {
      display: flex;
      justify-content: center;
    }
  }
}
@media only screen and (max-width: $screen-xs) {
  .categories {
    .item {
      width: 50%;
    }
  }
  .illustrator {
    .img-wrapper,
    .content {
      width: 90%;
    }
  }
  .item-rm {
    transition: all 0.3s linear 0s;
    &.open-item {
      opacity: 1;
      height: auto;
      margin-bottom: 30px;
    }
    &.close-item {
      opacity: 0;
      height: 0;
      margin-bottom: 0;
      z-index: -1;
    }
  }
  .btn-readmore {
    transition: all 0.5s;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 0;
    background: #fff 0% 0% no-repeat padding-box;
    border: 1px solid #5151514d;
    border-radius: 5px;
  }
}
.open {
  .caret-icon {
    transform: rotate(180deg);
  }
}
.caret-icon {
  transition: 0.8s ease;
  margin-left: 10px;
}
i.icon-cls {
  width: 15px !important;
  height: 15px !important;
}
</style>
