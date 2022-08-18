<template>
  <div class="flex mid search-bar" :class="{ 'on-search-focus': isSearchFocus }">
    <!-- desktop ui -->
    <div class="desktop-ui hidden-xs hidden-sm pos-rel">
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
    <!-- mobile ui -->
    <div class="mobile-ui-input pos-rel flex">
      <div class="flex mid w-full" style="border: 2px solid rgb(170, 170, 170); border-radius: 6px; background: rgb(246, 246, 246); padding: 0 10px">
        <div style="height: 24px; border-right: 1px solid #d3d3d3; padding-right: 10px;">
          <LogoMark style="height: 100%; width: auto;" />
        </div>
        <input
          type="text"
          ref="searchInput"
          class="w-full h-full wrap-text pl-10 pr-10"
          :placeholder="$t(7)"
          v-model="searchQuery"
          @keyup.enter="submit"
        />
        <button class="header-search-button" @click="submit">
          <span class="glyphicon glyphicon-search"></span>
        </button>
      </div>
      <span
        style="right: 7px; top: calc(50% - 6px);"
        class="glyphicon glyphicon-remove pos-abs"
        @click="() => focusSearch(false)"
      ></span>
    </div>
  </div>
</template>

<script>
import LogoMark from '@@/../components/icons/LogoMark.vue'
import i18n from '@@/lang/components-desktop/header-responsive.json'
const GCS_KEY = {
  en: '012690000178031241993:25ucukfzmyn',
  th: '012690000178031241993:y6rzyfwh2yc',
  vi: '012690000178031241993:xpqbaepzsj3'
}

export default {
  i18n: { messages: i18n },
  components: {
    LogoMark,
  },
  data() {
    let searchQuery =  this.$nuxt._route ? this.$nuxt._route.query : ''
    // duplicate query q in faq OAM-72187
    if(this.$nuxt._route.path.startsWith('/faq'))
      searchQuery = ''
    return {
      isSearchFocus: false,
      searchQuery: searchQuery.q && !searchQuery.isindex ? searchQuery.q : '',
    }
  },
  methods: {
    onScroll() {
      document.removeEventListener('scroll', this.onScroll)
      // hide search input part
      this.focusSearch(false)
      setTimeout(() => {
        this.$refs.searchInput.blur()
      })
      this.$nuxt.$emit('toggleShowNotification', false)
    },
    focusSearch(val = null) {
      this.isSearchFocus = val
      if (!val) {
        // close search
        return
      }
      this.$refs.searchInput.focus()

      this.$nextTick(() => {
        setTimeout(() => {
          document.addEventListener('scroll', this.onScroll)
        }, 500) // 500ms, delay until animation finish 
      })
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
  @media only screen and (min-width: $screen-sm) {
    flex: 0 1 446px;
    padding-right: 20px;
  }
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
    padding: 10px 30px 10px 10px;
    input, button {
      border: none;
      background: none;
    }
    button {
      color: #5a5a5a;
    }
    input {
      // color: #c5c5c5;
      text-align: left;
      ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
        color: #c5c5c5;
        opacity: 1; /* Firefox */
      }
    }
  }
  /deep/ .icon-cls {
    opacity: 1;
  }
  &.on-search-focus {
    .mobile-ui-input {
      transform: translateY(0);
    }
    /deep/ .icon-cls {
      opacity: 0;
    }
  }
}
</style>
