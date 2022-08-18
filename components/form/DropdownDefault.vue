
<template>
  <div class="series-period inline-flex mid">
    <span class="title"> {{ title }}: &nbsp;</span>
    <div class="dropdown">
      <button :id="uid" type="button" class="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
        {{ displaySelected || '新着順' }}
        <span class="caret"></span>
      </button>
      <ul class="dropdown-menu" :aria-labelledby="uid">
        <li class="pl-10 pt-10 pb-5" :class="{'selected': selectedIndex == index}" 
            v-for="(item,index) in dataSource" :key="'35eZr'+index" 
            @click="onSelect(item,index)"
        >
          {{ displayVal(item) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'selected',
    event: 'input',
  },
  props: {
    width: {
      type: String,
    },
    title: {
      type: String,
      default: ''
    },
    display: {
      type: String,
      default: ''
    },
    idVal: String,
    dataSource: {
      type: Array,
      default() {
        return []
      },
    },
    selected: {
      type: [String, Number],
      default: 0,
    },
    showCheck: {
      type: [Boolean, Number],
      default: true,
    },
  },
  computed: {
    displaySelected() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.selectedIndex = this.idVal
        ? this.dataSource.findIndex(item => item.id === Number(this.selected))
        : this.selected < this.dataSource.length
          ? this.selected
          : this.dataSource.length - 1
      if (this.display) {
        return this.dataSource[this.selectedIndex][this.display]
      }
      return this.dataSource[this.selectedIndex]
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
      this.selectedIndex = index
      let val
      if (this.idVal) {
        val = item[this.idVal]
      } else {
        val = index
      }
      this.$emit('input', val)
    },
  },
  data() {
    return {
      uid: this._uid + 'nfJBC',
      selectedIndex: this.idVal
        ? this.dataSource.findIndex(item => item.id === this.selected)
        : this.selected < this.dataSource.length
          ? this.selected
          : this.dataSource.length - 1,
    }
  },
}
</script>
<style lang="scss" scoped>
$grey-color: #c9c9c9;
$black-color: #2c2c2c;
$background-color: #e6e6e6;

.title {
  margin-right: 10px; 
  font-size: 13px
}
.selected {
  font-weight: bold;
}
.btn {
  font-size: 13px;
  padding: 1px 6px;
  background-color: #fff;
}
.series-period{
  margin : 10px 0;
}
.series-period, .category {
  button {
    border: none;
    outline: none;
    font-weight: bold;
    &:active, &:focus {
      background-color: $background-color;
      outline: none !important;
    }
  }
  li {
    color: $grey-color;
    cursor: pointer;
    &:hover {
      background-color: $background-color;
    }
  }
}
.status-list {
  span {
    margin-right: 10px;
    height: 36px;
    cursor: pointer;
    width: 52px;
    text-align: center;
    &:hover {
      color: $black-color;
    }
  }
}
@media screen and (max-width: 1023px) {
  .series-period, .category {
    align-items: center;
    margin-right: 20px;
  }
}
@media screen and (max-width: 480px) {
  .status-list, .category, .series-period {
    margin-top: 15px !important;
  }

  .series-period {
    width: 50% !important;
    margin-right: 0 !important;
  }

  .category {
    margin-right: 0 !important;
    width: 50% !important;
  }
}
</style>
