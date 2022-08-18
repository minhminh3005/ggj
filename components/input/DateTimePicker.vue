<template>
  <div class="flex mid">
    <span class="left m-r-5" v-if="left">{{ left }}</span>
    <div :ref="'dateTimePicker'" class="flex mid input-group date gg-datetime-picker m-tb-5" :class="attrs.class">
      <input v-bind="attrs" ref="displayDateTime" class="form-control" style="width: 200px;" />
      <span class="flex center mid input-group-addon">
        <CalendarAlt />
      </span>
    </div>
  </div>
</template>

<script>
import { TIME_ZONE } from '@@/../common/assets/js/consts'
import CalendarAlt from '@@/../components/icons/CalendarAlt.vue'
import './eonasdan-bootstrap-datetimepicker.css'
import './eonasdan-bootstrap-datetimepicker'
import i18n from '@@/lang/components/datetime-picker.json'

// import ComponentValidation from '@/components/common/validations/component-validation.js'
export default {
  i18n: {
    messages: i18n,
  },
  beforeCompile() {
    this.control = null
  },
  components: {
    CalendarAlt
  },
  model: {
    prop: 'date',
    event: 'input',
  },
  // mixins: [ComponentValidation],
  props: {
    format: {
      type: String,
      default: 'YYYY/MM/DD',
    },
    date: Number,
    left: String,
    attrs: {
      type: Object,
      default() {
        return {}
      }
    },
    endDate: {
      type: Boolean,
      default: false,
    },
    minDate: {
      type: Boolean,
      default: true,
    },
    minString: {
      type: String,
      default: '2000-01-01',
    },
    defaultStart: {
      type: Boolean,
      default: false,
    },
    initialValue: {
      type: [Number],
      default: undefined
    },
    widgetPositioning: {
      type: Object,
      default() {
        return {
          horizontal: 'left',
          vertical: 'auto'
        }
      }
    }
  },
  data() {
    return {
      uid: this._uid,
      initiated: 0,
      isChanging: false,
      enableTime:
        this.format.includes('HH:mm') || this.format.includes('hh:mm'),
    }
  },
  mounted() {
    moment.updateLocale('ja', {
      months : [
        this.$t('1'),
        this.$t('2'),
        this.$t('3'),
        this.$t('4'),
        this.$t('5'),
        this.$t('6'),
        this.$t('7'),
        this.$t('8'),
        this.$t('9'),
        this.$t('10'),
        this.$t('11'),
        this.$t('12'),
      ],
    })

    if (process.server) {
      return
    }
    let me = this,
    opt = {
      locale: this.$i18n.locale,
      format: me.format,
      minDate: me.minDate
        ? moment(this.minString).tz(TIME_ZONE[this.$i18n.locale])
        : undefined,
      keyBinds: {
        up: null,
        down: function(widget) {
          if (!widget) {
            this.show()
            return
          }
        },
        left: null,
        right: null,
        t: null,
        delete: null,
      },
      widgetPositioning: this.widgetPositioning,
      tooltips: {
        today: this.$t('today'),
        clear: this.$t('clear'),
        close: this.$t('close'),
        selectMonth: this.$t('selectMonth'),
        prevMonth: this.$t('prevMonth'),
        nextMonth: this.$t('nextMonth'),
        selectYear: this.$t('selectYear'),
        prevYear: this.$t('prevYear'),
        nextYear: this.$t('nextYear'),
        selectDecade: this.$t('selectDecade'),
        prevDecade: this.$t('prevDecade'),
        nextDecade: this.$t('nextDecade'),
        prevCentury: this.$t('prevCentury'),
        nextCentury: this.$t('nextCentury')
      }
    }

    if(this.$i18n.locale == 'ja') {
      opt.dayViewHeaderFormat = `YYYY${this.$t('year')} MMMM`
    }
  
    me.control = $(this.$refs.dateTimePicker)

    if (me.date) {
      me.control.datetimepicker(Object.assign({}, opt, {
        date: this.enableTime
          ? moment(me.date * 1e3).tz(TIME_ZONE[this.$i18n.locale])
          : moment(me.date * 1e3).tz(TIME_ZONE[this.$i18n.locale]),
      }))
    } else {
      me.control.datetimepicker(opt)
    }
    me.initiated++
    me.control.on('dp.change', e => {
      if (!me.isChanging) {
        me.isChanging = true
        let _tmp = e.date ? moment(e.date).tz(TIME_ZONE[this.$i18n.locale]) : null,
          _date = null
        if (me.enableTime) {
          _date = _tmp ? _tmp.unix() : 0
        } else {
          _date = _tmp
            ? me.endDate
              ? _tmp.endOf('day').unix()
              : _tmp.startOf('day').unix()
            : null
        }
        if (me.initiated <= 1 && me.defaultStart && !me.date) {
          me.control.data('DateTimePicker').date(
            moment()
              .tz(TIME_ZONE[this.$i18n.locale])
              .startOf('day')
          )
          me.initiated++
          _date = moment()
            .tz(TIME_ZONE[this.$i18n.locale])
            .startOf('day')
            .unix()
        }
        me.$emit('input', _date, me.date)
        me.$nextTick(() => {
          me.isChanging = false
        })
      }
    })
    this.$nextTick(this.handleDisplayingPastDates)
  },
  watch: {
    date(value) {
      if (value) {
        if (!this.isChanging) {
          this.isChanging = true
          this.control
            .data('DateTimePicker')
            .date(
              this.enableTime
                ? moment(value * 1e3)
                : moment(value * 1e3).tz(TIME_ZONE[this.$i18n.locale])
            )
          this.$nextTick(() => {
            this.isChanging = false
          })
        }
      } else {
        this.$refs.displayDateTime.value = ''
      }
    },
    minString(value) {
      if (value) {
        if (!this.isChanging) {
          this.isChanging = true
          this.control.data('DateTimePicker').minDate(this.minString)
          this.$nextTick(() => {
            this.isChanging = false
          })
        }
      }
    },
    initialValue(value) {
      if (value) this.handleDisplayingPastDates()
    }
  },
  methods: {
    handleDisplayingPastDates() {
      if (this.initialValue && ((this.initialValue*1e3) < Date.now()) && this.date === this.initialValue) {
        $(this.$refs.displayDateTime).val(moment(this.initialValue*1e3).tz(TIME_ZONE[this.$i18n.locale]).format(this.format))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$input-height: 50px;
.gg-datetime-picker {
  position: relative;
  height: $input-height;
  input {
    height: $input-height;
  }
}
.left {
  display: inline-block;
  white-space: nowrap;
}
.create-product {
  .gg-datetime-picker {
    z-index: auto !important;
  }
}
.mp-ds .gg-datetime-picker {
  height: 32px;
  input.form-control {
    height: 32px;
  }
}
.input-group-addon {
  height: 100%;
  width: 60px;
  .icon-cls {
    width: 26px;
    display: flex;
    margin: 0;
    height: 26px;
  }
}
</style>
