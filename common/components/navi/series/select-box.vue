<template>
  <div class="dropdown dropdown-box">
    <button :id="uid" type="button" class="sl-area flex space-between mid" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      <span>{{ displaySelected }}</span>
      <span class="caret"></span>
    </button>
    <ul class="dropdown-menu" :aria-labelledby="uid">
      <li class="dd-item cursor-pointer" :class="{'selected': selectedIndex == index}" v-for="(item,index) in dataSource" :key="'35eZr'+index" @click="onSelect(item,index)">
        <span :class="{'hidden-item': selectedIndex !== index}" class="glyphicon glyphicon-ok fs-10 mr-5" aria-hidden="true" v-if="showCheck"></span>{{ displayVal(item) }}
      </li>
    </ul>
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
    display: String,
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
      this.selectedIndex = this.idVal
        ? this.dataSource.findIndex(item => item.id === this.selected)
        : this.selected < this.dataSource.length
          ? this.selected
          : this.dataSource.length - 1
      let checkIndex = this.selectedIndex
      if(this.selectedIndex < 0 || isNaN(this.selectedIndex)) {
        checkIndex = 0
      }
      if (this.display) {
        return this.dataSource[checkIndex][this.display]
      }
      return this.dataSource[checkIndex]
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
.dropdown-box {
  .sl-area {
    height: 25px;
    min-width: 115px;
    color: #595959;
    background: #ffffff;
    border-radius: 5px;
    border: 1px solid #c4c4c4;
    padding: 5px 20px;
    outline: none;
    &:active {
      border-style: solid;
    }
  }
  .dd-item {
    margin: 2px 5px;
    padding: 2px 2px;
    border-radius: 4px;
    &:hover {
      background-color: #f0f0f0;
    }
  }
  .sl-area[aria-expanded='true'] {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .dropdown-menu {
    margin-top: 0;
    border-top: none;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    min-width: 100%;
    width: auto;
    white-space: nowrap;
  }
}
.fs-10 {
  font-size: 10px;
}
.hidden-item {
  visibility: hidden;
}
.selected {
  pointer-events: none;
  color: #b5b5b5;
}
</style>

