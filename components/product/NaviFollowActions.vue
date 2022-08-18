<template>
  <div class="follow-group" :class="attrs.theme">
    <template v-if="attrs.showSelect">
      <SelectBoxFollow
        :data-source="selectList(product)"
        :display="'text'"
        :id-val="'id'"
        @input="handleSelect"
        @buttonclick="onSelectClick"
      />
    </template>
    <template v-else-if="attrs.showButton">
      <button :class="[isFollowed ? 'btn-following' : 'btn-follow', {'btn-wide':attrs.wideBtn}] " @click="onClick">
        {{
          $t(isFollowed ? 48 : 49)
        }}
      </button>
    </template>
    <template v-else>
      <a :href="attrs.url" class="gg-text"><small>{{ $t(50) }}</small></a>
    </template>
  </div>
</template>
<script>
import i18n from '@@/lang/common/navi-article.json'
import SelectBoxFollow from '@@/../components/form/SelectBoxFollow.vue'
import { gotoLogin } from '@/utils/client/common'

const UNFOLLOW = 3
const TURN_ON_NOTIFY = 2
const TURN_OFF_NOTIFY = 1

export default {
  components: { SelectBoxFollow },
  i18n: {
    messages: i18n,
  },
  props: {
    attrs: {
      type: Object,
      default: function() {
        return {}
      },
    },
    product: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      onNotify: [
        {
          id: UNFOLLOW,
          text: this.$t('51'), // Unfollow
        },
        {
          id: TURN_ON_NOTIFY,
          text: this.$t('52'), // Turn on notifications
        },
      ],
      offNotify: [
        {
          id: UNFOLLOW,
          text: this.$t('51'), // Unfollow
        },
        {
          id: TURN_OFF_NOTIFY,
          text: this.$t('53'), // Turn off notifications
        },
      ],
    }
  },
  computed: {
    isFollowed() {
      return this.product.isFollowed || 0
    }
  },
  methods: {
    selectList(item) {
      // isFollowed: 0 | 1 | 2 // 0: no follow, 1: follow & noti, 2: follow without noti
      return item.isNotification || item.isFollowed === 1 ? this.offNotify : this.onNotify
    },
    handleSelect(val) {
      if(!val) return
      if (!this.$store.state.user.id) {
        gotoLogin(`u=${location.pathname}`)
        return
      }
      if(val === UNFOLLOW) {
        this.$emit('onClick', this.product)
      }
      if(val === TURN_ON_NOTIFY || val === TURN_OFF_NOTIFY) {
        this.$emit('updateNotify', {
          item: this.product,
          num: val - 1
        })
      }
    },
    onClick() {
      if (!this.$store.state.user.id) {
        gotoLogin(`u=${location.pathname}`)
        return
      }
      this.$emit('onClick', this.product)
    },
    onSelectClick(e) {
      setTimeout(() => {
        let pB = $(e).parents('.product-horizontal').parent().get(0).getBoundingClientRect(),
            cB = e.getBoundingClientRect(),
            bt = cB.bottom - pB.bottom
        bt > 0 && (e.scrollIntoViewIfNeeded ? e.scrollIntoViewIfNeeded() : e.scrollIntoView({ block: 'end' }))
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@@/../common/assets/variables.scss";

$btn: #73a5d6;
$btn-hover: #4f87bd;
$white: #fff;
$radius:4px;
.follow-group {
  width: 100px;
  .btn-follow {
    color: $white;
    background: $btn;
    border-radius: $radius;
    border: none;
    padding: 5px 0;
    width: 100px;
    transition: 0.3s;
    font-weight: bold;
    &:hover {
      background: $btn-hover;
    }
  }
  .gg-text {
    width: 80px;
    color: #2d2d2d;
    small {
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
.theme-02,
.theme-03 {
  &.follow-group {
    display: flex;
    justify-content: end;
    margin-top: 15px;
    text-align: right;
    width: 100%;
    .gg-text {
      width: 100%;
    }
  }
}
.theme-03 {
  &.follow-group {
    .btn-following {
      color: $btn;
      background: $white;
      border: solid 1px #ddd;
      border-radius: $radius;
      padding: 5px 15px;
      height: 28px;
      transition: 0.3s;
      font-weight: bold;
      &:hover {
        border: solid 1px #b1b1b1;
      }
    }
    .btn-follow {
      color: $white;
      background: $btn;
      border-radius: $radius;
      font-weight: bold;
      border: none;
      padding: 5px 15px;
      transition: 0.3s;
      width: 110px;
      &:hover {
        background: $btn-hover;
      }
    }
  }
}
.btn-wide {
  width: 176px !important;
  @media only screen and (max-width: $screen-xs) {
    width: 115px !important;
  }
}
</style>
