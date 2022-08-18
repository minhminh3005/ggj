<template>
  <div class="flex mid search-bar" :class="{ 'on-search-focus': isSearchFocus }">
    <!-- desktop ui -->
    <div class="desktop-ui pos-rel">
      <input
        type="text"
        class="w-full h-full wrap-text"
        :placeholder="$t(6)"
        v-model="searchQuery"
        @keyup.enter="submit"
      />
      <button class="header-search-button pos-abs" @click="submit">
        <span class="glyphicon glyphicon-search"></span>
      </button>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/header-responsive.json'
const GCS_KEY = {
  en: '012690000178031241993:25ucukfzmyn',
  th: '012690000178031241993:y6rzyfwh2yc',
  vi: '012690000178031241993:xpqbaepzsj3'
}

export default {
  i18n: { messages: i18n },
  data() {
    let searchQuery = this.$nuxt._route.query
    return {
      isSearchFocus: false,
      searchQuery: searchQuery.q && !searchQuery.isindex ? searchQuery.q : '',
    }
  },
  methods: {
    focusSearch(val = null) {
      val = val != null? val : !this.isSearchFocus
      this.isSearchFocus = val
      this.$emit('onSearchFocus', val)
    },
    submit() {
      let cx = GCS_KEY[this.$i18n.locale] || '012690000178031241993:kfgxqharxde',
        cof = 'FORID%3A10',
        ie = 'UTF-8',
        lr = this.langSupported().includes(this.$i18n.locale) ? `lang_${this.$i18n.locale}` : 'lang_ja',
        q = this.searchQuery
      if (!this.searchQuery) {
        return
      }
      location.href = `/search?cx=${cx}&cof=${cof}&lr=${lr}&ie=${ie}&q=${q}`
    },
  },
  mounted() {
    this.$nuxt.$on('focusSearch', this.focusSearch)
    window.onresize = () => {
      this.focusSearch(false)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@@/../common/assets/variables.scss";
.header-search-button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  span.glyphicon {
    position: static;
    transform: translateY(-1px);
  }
}
.search-bar {
  flex: 0 1 446px;
  padding-right: 20px;
  .desktop-ui {
    width: 100%;
    height: 34px;
    opacity: 1;
    button {
      border: none;
      background: none;
      color: #5a5a5a;
      position: absolute;
      right: 0;
      top: 1px;
      height: 34px;
      width: 34px;
    }
    input {
      padding: 0 32px 0 12px;
      background: #f6f6f6 0% 0% no-repeat padding-box;
      border: 1px solid #aaa;
      border-radius: 6px;
      color: #5a5a5a;
      transition: all 0.3s;
      &:focus {
        background: #fff;
        border-color: #5d5a5a;
        box-shadow: 0 0 12px #cacaca;
      }
    }
  }
  $mobile-height: 50px;
  .mobile-ui-input {
    height: $mobile-height;
    position: fixed;
    width: 100%;
    top: 0;
    background: #fff;
    left: 0;
    transition: all 0.3s;
    transform: translateY(-$mobile-height);
    z-index: 1;
    padding: 8px 30px 8px 8px;
    input, button {
      border: none;
      background: none;
    }
    button {
      color: #5a5a5a;
    }
    input {
      // color: #c5c5c5;
      text-align: center;
      ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
        color: #c5c5c5;
        opacity: 1; /* Firefox */
        text-align: center;
      }
      :-ms-input-placeholder { /* Internet Explorer 10-11 */
        color: #c5c5c5;
        text-align: center;
      }
      ::-ms-input-placeholder { /* Microsoft Edge */
        color: #c5c5c5;
        text-align: center;
      }
    }
  }
  /deep/ .icon-cls {
    opacity: 1;
  }
  &.on-search-focus .mobile-ui-input {
    transform: translateY(0);
  }
  &.on-search-focus /deep/ .icon-cls {
    opacity: 0;
  }
}
</style>
