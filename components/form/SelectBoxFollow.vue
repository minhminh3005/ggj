<template>
  <div class="dropdown sl-QFVuO" :style="{ 'width': width || 'auto'}" ref="btn">
    <button :id="uid" type="button" class="sl-area flex space-between mid" data-toggle="dropdown" aria-haspopup="true"
            aria-expanded="false" @click="onClick"
    >
      <span class="selected_text">{{ displayText }}</span>
      <span class="caret" :class="caretDirection"></span>
    </button>
    <ul class="dropdown-menu" :aria-labelledby="uid" ref="ulRef">
      <li class="dd-item cursor-pointer" v-for="(item,index) in dataSource" :key="'35eZr'+index" @click="onSelect(item,index)">
        <small>{{ displayVal(item) }}</small>
      </li>
    </ul>
  </div>
</template>

<script>
import i18n from '@@/lang/common/navi-article.json'

export default {
  i18n: {
    messages: i18n,
  },
  model: {
    prop: 'selected',
    event: 'input',
  },
  props: {
    width: {
      type: String,
    },
    display: String,
    idVal: String,
    dataSource: {
      type: Array,
      default() {
        return []
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      $(this.$refs.btn).on('shown.bs.dropdown', () => {
        this.caretDirection = 'down'
      })
      $(this.$refs.btn).on('hidden.bs.dropdown', () => {
        this.caretDirection = 'up'
      })
    })
  },
  computed: {
    displayText() {
      return this.$t('48')
    },
  },
  methods: {
    displayVal(item) {
      if (this.display) {
        return item[this.display]
      }
      return item
    },
    onSelect(item, index) {
      let val
      if (this.idVal) {
        val = item[this.idVal]
      } else {
        val = index
      }
      this.$emit('input', val)
    },
    onClick() {
      this.$emit('buttonclick', this.$refs.ulRef)
    }
  },
  data() {
    return {
      uid: 'aaaa' + this._uid,
      caretDirection: '',
    }
  },
}
</script>


<style lang="scss" scoped>
$btn: #73a5d6;
.sl-QFVuO {
  .sl-area {
    height: 30px;
    outline: none;
    border: 1px solid $btn;
    background: transparent;
    border-radius: 2px;
    min-width: 100px;
    color: $btn;
    font-weight: bold;
    &:active {
      border-style: solid;
    }
  }
  .dd-item {
    margin: 2px 5px;
    padding: 5px 10px;
    font-weight: bold;
    &:first-child {
      color: #f00;
      border-bottom: solid 1px #7575757a;
    }
    &:hover {
      background-color: #f0f0f0;
    }
  }
  .sl-area[aria-expanded='true'] {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    left: -40px;
    min-width: 140px;
    border: none;
    z-index: 1000;
    padding: 5px 0;
    margin: 2px 0 0;
    list-style: none;
    background-color: #e5e5e5;
    box-shadow: 0 0 3px #00000029;
    border-radius: 3px;
  }
}
.fs-10 {
  font-size: 10px;
}
.hidden-item {
  visibility: hidden;
}
.caret {
  border-top: 7px dashed;
  &.down {
    transform: rotate(-180deg);
  }
}
</style>
