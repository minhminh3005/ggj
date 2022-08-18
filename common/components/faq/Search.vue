<template>
  <div class="search-component">
    <div class="search-bar w-full flex mid">
      <!-- Input is for search keyword -->
      <form class="w-full" action="" autocomplete="off">
        <input
          name="search"
          type="search"
          maxlength="200"
          v-model="searchKeywords"
          @input="onChange()"
          @focus="onFocusIn"
          @focusout="onFocusOut"
          @compositionstart="onCompositionStart"
          @compositionend="onCompositionEnd"
          @keyup.down="onArrowDown"
          @keyup.up="onArrowUp"
          @keyup.enter="onEnter"
          :placeholder="$t('8')"
          class="w-full"
        />
      </form>
      <span class="faq-icon" @click="onSearch"><Search /></span>
      <span class="mobile-search" @click="openSearchMobile"></span>
      <!-- Autocomplete suggestion for desktop -->
      <div class="autocomplete desktop fixed-display flex layout-col" v-if="questions.length && showAutocomplete">
        <a
          v-for="(q, i) in questions"
          :key="`ct-${q.id}`"
          :href="`/faq/${q.id}`"
          :class="{ 'is-active': i === arrowCounter }"
          @click="selectQuestion(q)"
        >
          <span class="question-letter">Q.</span>
          {{ q.question }}
        </a>
      </div>
      <!-- Search for mobile -->
      <GogoModal :show="isShowSearchMobile" @update:show="(val) => (isShowSearchMobile = val)" class="search-modal">
        <div slot="modal-header" class="modal-header flex mid">
          <span class="faq-icon" @click="() => (isShowSearchMobile = false)"><ArrowLeft /></span>
          <form class="w-full" action="" @submit="onSearch" autocomplete="off">
            <input 
              name="search-mobile"
              maxlength="200"
              type="search"
              v-model="searchKeywords"
              @keyup.enter="onEnter"
              @input="onChange()"
              :placeholder="$t('8')"
              class="w-full pl-15 pr-15"
            />
          </form>
          <span class="faq-icon" @click="onSearch"><Search /></span>
        </div>
        <div slot="modal-body" class="share-body">
          <div class="autocomplete flex layout-col">
            <a
              v-for="(q, i) in questions"
              :key="`ct-${q.id}`"
              :href="`/faq/${q.id}`"
              :class="{ 'is-active': i === arrowCounter }"
            >
              <span class="question-letter">Q.</span>
              {{ q.question }}
            </a>
          </div>
        </div>
        <div slot="modal-footer"></div>
      </GogoModal>
    </div>
    <!-- Common keywords -->
    <div class="flex mid flex-wrap mt-20 gap-15" v-if="commonKeyword.length">
      <div class="bold common-title">{{ $t('7') }}</div>
      <div class="flex flex-wrap fs-13 gap-10">
        <a v-for="(kw, idx) in commonKeyword" :key="`ckw-${idx}`" class="common-keywords" :href="'/faq/search?q=' + kw">
          {{ kw }}
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import i18n from '@@/lang/desktop/faq.json'
import Search from '@@/../components/icons/Search.vue'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import ArrowLeft from '@@/../components/icons/ArrowLeft'
import { urlEscapeSpecialCharacter } from '@@/../common/assets/js/helper'

export default {
  i18n: {
    messages: i18n,
  },
  props: {
    commonKeyword: {
      type: Array,
      default() {return []}
    },
  },
  components: { 
    Search, 
    GogoModal,
    ArrowLeft,
  },
  data() {
    return {
      searchKeywords: unescape(this.$route.query.q || ''),
      questions: [],
      searchDebounce: this.debounce(this.onLooking.bind(this), 150),
      arrowCounter: -1,
      showAutocomplete: false,
      isShowSearchMobile: false,
      focusInput: false,
      japaneseIME: false,
    }
  },
  watch: {
    isShowSearchMobile(val) {
      if (val) {
        $('body').on("touchstart", this.onModalChange)
      } else {
        $('body').off("touchstart", this.onModalChange)
      }
    }
  },
  methods: {
    onSearch() {
      if (!this.searchKeywords) {
        return
      } else if (!this.searchKeywords.trim()) {
        location.href = `/faq/search`
      } else {
        // must use escape fn to escape UTF-8 characters
        // example: !@$%^&*&^^***((( -> %21%40%24%25%5E%26%2a%26%5E%5E%2a%2a%2a%28%28%28
        let esKeyword = urlEscapeSpecialCharacter(this.searchKeywords)
        location.href = `/faq/search?q=${esKeyword}`
      }
    },
    onChange() {
      this.arrowCounter = -1
      this.searchDebounce()
    },
    onLooking() {
      if(!this.searchKeywords.trim()) 
        this.questions = []
      else {
        this.GoGoHTTP.get(`/api/v3/surface/faq/suggest`, {
          params: {
            q: this.searchKeywords
          }
        }, 
          ).then(data => {
            this.questions = data || []
          })
        }
    },
    onArrowDown() {
      if (this.arrowCounter < this.questions.length-1) {
        this.arrowCounter = this.arrowCounter + 1
      } else {
        this.arrowCounter = 0
      }
    },
    onArrowUp() {
      if (this.arrowCounter > 0) {
        this.arrowCounter = this.arrowCounter - 1
      } else {
        this.arrowCounter = this.questions.length - 1
      }
    },
    onEnter() {
      if(this.arrowCounter != -1) {
        location.href = `/faq/${this.questions[this.arrowCounter].id}`
      } else if(!this.japaneseIME){
        this.onSearch()
      }
    },
    openSearchMobile() {
      this.isShowSearchMobile = true
      this.$nextTick(() => {
        $('input[name="search-mobile"]').focus().val(this.searchKeywords)
      })
    },
    onFocusIn() {
      this.focusInput = true
      this.showAutocomplete = true
    },
    onFocusOut() {
      this.focusInput = false
    },
    onCompositionStart() {
      this.japaneseIME = true
    },
    onCompositionEnd() {
      setTimeout(() => {
        this.japaneseIME = false
      }, 200)
    },
    onModalChange() {
      $('input[name="search-mobile"]').blur()
    },
    selectQuestion(q) {
      // Handle click outside input but in suggest list
      this.focusInput = true
      this.searchKeywords = q.question
    }
  },
  mounted() {
    // 38:up 40:down 13:enter
    $('input').bind('keydown', function(e){
      if(e.keyCode == '38' || e.keyCode == '40' || e.keyCode == '13'){
        e.preventDefault()
      }
    })

    // Handle click outside input and suggest list
    this.$nextTick(() => {
      window.addEventListener('click', () => {
        if(!this.focusInput) this.showAutocomplete = false
      })
    })
  }
}
</script>
<style lang='scss' scoped>
@import "@@/../common/assets/variables.scss";
@import '@@/../common/assets/faq/faq.scss';
.search-component {
  margin: 22px 0 20px;
  color: $grey4;
  @media only screen and (min-width: $screen-sm) {
    margin: 50px 0 55px;
  }
  position: relative;
}
.search-bar {
  border: 1px solid $grey2;
  height: 50px;
  padding: 15px;
  input {
    font-size: 16px;
    border: none;
    outline: none;
    color: $grey5;
    background-color: transparent;
    &::placeholder {
      font-size: 15px
    }
  }
}
.autocomplete {
  width: 100%;
  background: $white;
  padding: 15px;
  a {
    color: $grey4;
    width: 100%;
    font-size: 16px;
    padding: 6px 4px;
    text-decoration: none !important;
  }
  .is-active {
    background: #70c4f7cc;
    text-decoration: none;
  }
}
.desktop {
  display: none;
  @media only screen and (min-width: $screen-sm) {
    display: flex;
  }
  a:hover {
    background: #9ed9fdcc;
  }
}
.fixed-display {
  position: absolute;
  top: 50px;
  left: 0;
  border: 1px solid $grey1;
  box-shadow: 0 5px 10px 2px #00000029 !important;
}
.mobile-search {
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100% - 58px);
  height: 50px;
  background-color: transparent;
  @media only screen and (min-width: $screen-sm) {
    display: none;
  }
}
/deep/ .search-modal {
  .modal-dialog {
    height: 100% !important;
    margin: 0 !important;
  }
  .modal-content {
    height: 100% !important;
  }
  .modal-header {
    background-color: $white;
  }
}
/deep/ .share-body {
  overflow-y: scroll;
  height: 80%;
  &::-webkit-scrollbar {
  width: 2px;
  cursor: pointer;
  &-track {
    background: #fff;
    border-radius: 4px;
  }
  &-thumb {
    background: #d6d6d6;
    border-radius: 7px;
    cursor: pointer;
  }
}
}
.question-letter {
  font-weight: bold;
  color: $faq-q;
}
.common-title {
  font-size: 14px;
  font-weight: bold;
  line-height: 26px;
  @media only screen and (min-width: $screen-sm) {
    font-size: 15px;
  }
}
.common-keywords {
  cursor: pointer;
  text-align: center;
  border-radius: 3px;
  padding: 2px 15px;
  color: $white;
  text-decoration: none;
  background: $faq-q;
  border: 1px solid $faq-q;
  line-height: 20px;
  &:hover {
    color: $faq-q;
    background: $white;
  }
}
.faq-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  i {
    width: 23px;
    height: 23px;
  }
  @media only screen and (min-width: $screen-sm) {
    i {
      width: 28px;
      height: 28px;
    }
  }
}
.gap-15 {
  gap: 15px;
}
.gap-10 {
  gap: 10px;
}
</style>