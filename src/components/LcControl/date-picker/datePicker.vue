<template>
  <div :class="[type]" class="lc-date-picker">
    <van-picker
      ref="picker"
      :columns="columns"
      :title="title"
      :confirm-button-text="confirmButtonText"
      :cancel-button-text="cancelButtonText"
      show-toolbar
      @change="$_onPickerChange"
      @confirm="$_onPickerConfirm"
      @cancel="$_onPickerCancel"
    />
  </div>
</template>

<script>
import i18n from '@/lang' // Internationalization 国际化
// yyyy-MM-dd HH:mm:ss => Year-Month-Date Hour:Minute
// 目前支持类型
const TYPE_FORMAT = {
  'yyyy': 'Year',
  'yy': 'ShortYear',
  'MM': 'Month',
  'M': 'ShortMonth',
  'dd': 'Date',
  'd': 'ShortDate',
  'HH': 'Hour',
  'H': 'ShortHour',
  'mm': 'Minute',
  'm': 'ShortMinute',
  'ss': 'Second',
  's': 'ShortSecond'
}

/**
 * 数组转对象
 */
function toObject(values) {
  const results = {}
  values.forEach((v) => {
    for (const key in v) {
      results[key] = v[key]
    }
  })
  return results
}

const TYPE_FORMAT_INVERSE = toObject(
  Object.keys(TYPE_FORMAT).map(item => {
    return {
      [TYPE_FORMAT[item]]: item
    }
  }))

const TYPE_METHODS = {
  'Year': 'getFullYear',
  'ShortYear': 'getFullYear',
  'Month': 'getMonth',
  'ShortMonth': 'getMonth',
  'Date': 'getDate',
  'ShortDate': 'getDate',
  'Hour': 'getHours',
  'ShortHour': 'getHours',
  'Minute': 'getMinutes',
  'ShortMinute': 'getMinutes',
  'Second': 'getSeconds',
  'ShortSecond': 'getSeconds'
}

export default {
  name: 'DatePicker',

  props: {
    type: { // date, time, datetime,custom
      type: String,
      default: 'date'
    },
    customTypes: { // 自定义类型  yyyy, MM, dd, hh, mm,ss
      type: Array,
      default() {
        return []
      },
      validator(val) {
        let res = true
        val.forEach(type => {
          type = TYPE_FORMAT[type] || type
          /* istanbul ignore if */
          if (!(type in TYPE_METHODS)) {
            return (res = false)
          }
        })
        return res
      }
    },
    minDate: {
      type: Date
    },
    maxDate: {
      type: Date
    },
    defaultDate: {
      type: Date
    },
    minuteStep: {
      type: Number,
      default: 1
    },
    unitText: {
      type: Array,
      default() {
        return [
          i18n.t('components.datePicker.year'),
          i18n.t('components.datePicker.month'),
          i18n.t('components.datePicker.date'),
          i18n.t('components.datePicker.hour'),
          i18n.t('components.datePicker.minute'),
          i18n.t('components.datePicker.second')
        ]
      }
    },
    todayText: {
      type: String,
      default: ''
    },
    halfDayText: {
      type: Array,
      default() {
        return [
          i18n.t('components.datePicker.am'),
          i18n.t('components.datePicker.pm')]
      }
    },
    textRender: {
      type: [Function, String],
      default: ''
    },
    isTwelveHours: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    confirmButtonText: {
      type: String
    },
    cancelButtonText: {
      type: String
    }
  },

  data() {
    return {
      currentDateIns: new Date(),
      columnData: [],
      oldColumnData: null,
      columnDataDefault: [],
      columnDataGenerator: [],
      disabledCascadeComlumnIndex: [] // columns do not need cascading
    }
  },

  computed: {
    picker() {
      return this.$refs['picker']
    },
    currentYear() {
      return this.currentDateIns.getFullYear()
    },
    currentMonth() {
      return this.currentDateIns.getMonth() + 1
    },
    currentDate() {
      return this.currentDateIns.getDate()
    },
    columns() {
      const defValue = this.columnDataDefault
      const results = this.columnData.map((values, i) => {
        let defaultIndex = 0
        const vals = values.map((v, j) => {
          if (defValue[i] === v.value) { defaultIndex = j }
          return v
        })
        return {
          defaultIndex: defaultIndex,
          values: vals
        }
      })
      return results
    }
  },

  watch: {
    defaultDate() {
      this.$_initPickerColumn()
    },
    minDate() {
      this.$_initPickerColumn()
    },
    maxDate() {
      this.$_initPickerColumn()
    }
  },

  mounted() {
    this.$_initPicker()
  },

  methods: {
    // MARK: private methods
    $_initPicker() {
      this.$_initPickerColumn()
    },
    /**
     * 初始化列的值
     */
    $_initPickerColumn() {
      this.$_resetPickerColumn()
      this.$_initColumnDataGenerator()
      this.$_initColumnData(0, this.columnDataDefault)
    },
    /**
     * 重置选择器的值
     */
    $_resetPickerColumn() {
      this.oldColumnData = null
      this.columnData = []
      this.columnDataDefault = []
      this.columnDataGenerator = []
    },
    /**
     * 初始化列的数据
     */
    $_initColumnData(columnIndex, defaultDate = [], isSetColumn = true) {
      const columnData = this.columnData
      const columnDataGenerator = this.columnDataGenerator
      for (let i = columnIndex, len = columnDataGenerator.length; i < len; i++) {
        // Collect parameters for columnDataGenerator
        const columnDataGeneratorParams = []
        const generator = columnDataGenerator[i]

        for (let j = 0; j < i; j++) {
          if (defaultDate[j]) {
            columnDataGeneratorParams.push(defaultDate[j])
            continue
          }

          const itemIndex = this.picker.getColumnIndex(j) || 0
          if (columnData[j]) {
            columnDataGeneratorParams.push(columnData[j][itemIndex]['value'])
          } else {
            columnDataGeneratorParams.push('')
            console.warn(`DatePicker columnData of index ${j} is void`)
          }
        }
        // Generator colume data with columnDataGeneratorParams
        const curColumnData = generator ? generator.apply(this, columnDataGeneratorParams) : ''

        // set picker column data & refresh picker
        isSetColumn && this.picker.setColumnValues(i, curColumnData)

        // store column date
        this.$set(columnData, i, curColumnData)
      }

      isSetColumn && this.picker.setColumnValue(columnIndex, null)
    },
    /**
     * 生成列的数据
     */
    $_initColumnDataGenerator() {
      const defaultDate = this.$_getDefaultDate()
      switch (this.type) {
        case 'date':
          this.$_initColumnDataGeneratorForDate(defaultDate)
          break
        case 'time':
          this.$_initColumnDataGeneratorForTime(defaultDate)
          this.disabledCascadeComlumnIndex = [0, 1, 2]
          break
        case 'datetime':
          this.$_initColumnDataGeneratorForDate(defaultDate)
          this.$_initColumnDataGeneratorForTime(defaultDate)
          this.disabledCascadeComlumnIndex = [2, 3, 4, 5]
          break
        default:
          this.$_initColumnDataGeneratorForCustom(defaultDate)
          break
      }
    },
    $_initColumnDataGeneratorForDate(defaultDate) {
      this.columnDataGenerator = this.columnDataGenerator.concat([
        this.$_generateYearData,
        this.$_generateMonthData,
        this.$_generateDateData
      ])

      this.columnDataDefault = defaultDate ? this.columnDataDefault.concat([
        defaultDate.getFullYear(),
        defaultDate.getMonth() + 1,
        defaultDate.getDate()
      ]) : []
    },
    $_initColumnDataGeneratorForTime(defaultDate) {
      this.columnDataGenerator = this.columnDataGenerator.concat([
        this.$_generateHourData,
        this.$_generateMinuteData
      ])

      if (this.isTwelveHours) {
        this.columnDataGenerator.push(this.$_generateAPData)
        if (defaultDate) {
          const hourInfo = this.$_transHourTo12(defaultDate.getHours())
          this.columnDataDefault = this.columnDataDefault.concat([
            hourInfo.hour,
            defaultDate.getMinutes(),
            hourInfo.ap
          ])
        }
      } else {
        this.columnDataDefault = defaultDate ? this.columnDataDefault.concat([
          defaultDate.getHours(),
          defaultDate.getMinutes()
        ]) : []
      }
    },
    $_initColumnDataGeneratorForCustom(defaultDate) {
      let hourInfo

      this.customTypes.forEach((type, index) => {
        type = TYPE_FORMAT[type] || type
        if (type === 'Date' || type === 'Hour' || type === 'Minute' || type === 'Second' ||
          type === 'ShortDate' || type === 'ShortHour' || type === 'ShortMinute' || type === 'ShortSecond') {
          this.disabledCascadeComlumnIndex.push(index)
        }
        this.columnDataGenerator.push(this[`$_generate${type}Data`])

        if (defaultDate) {
          let value = defaultDate[TYPE_METHODS[type]]()

          if (type === 'Month' || type === 'ShortMonth') {
            value += 1
          }

          if (this.isTwelveHours && type === 'Hour') {
            hourInfo = this.$_transHourTo12(value)
            value = hourInfo.hour
          }
          this.columnDataDefault.push(value)
        }
      })

      if (this.isTwelveHours && ~this.customTypes.indexOf('Hour')) {
        this.columnDataGenerator.push(this.$_generateAPData)
        this.columnDataDefault.push(hourInfo.ap)
      }
    },
    $_getDefaultDate() {
      const defaultDate = this.defaultDate
      const minDate = this.minDate
      const maxDate = this.maxDate

      if (!defaultDate) {
        return defaultDate
      }

      if (minDate && defaultDate.getTime() < minDate.getTime()) {
        return minDate
      }

      if (maxDate && defaultDate.getTime() > maxDate.getTime()) {
        return maxDate
      }

      return defaultDate
    },
    // ===============年============
    $_generateYearDataByType(type = 'Year') {
      const start = this.minDate ? this.minDate.getFullYear() : this.currentYear - 20
      const end = this.maxDate ? this.maxDate.getFullYear() : this.currentYear + 20
      if (start > end) {
        console.warn('MinDate Year should be earlier than MaxDate')
        return
      }
      return this.$_generateData(start, end, type, this.unitText[0], 1)
    },

    $_generateYearData() {
      return this.$_generateYearDataByType()
    },
    $_generateShortYearData() {
      return this.$_generateYearDataByType('ShortYear')
    },
    // ===============月============

    $_generateMonthDataByType(year = this.currentYear, type = 'Month') {
      let start, end

      if (this.minDate && this.minDate.getFullYear() === year) {
        start = this.minDate.getMonth() + 1
      } else {
        start = 1
      }

      if (this.maxDate && this.maxDate.getFullYear() === year) {
        end = this.maxDate.getMonth() + 1
      } else {
        end = 12
      }

      return this.$_generateData(start, end, type, this.unitText[1] || '')
    },

    $_generateMonthData(year) {
      return this.$_generateMonthDataByType(year)
    },
    $_generateShortMonthData(year) {
      return this.$_generateMonthDataByType(year, 'ShortMonth')
    },

    // ===============日============
    $_generateDateDataByType(year = this.currentYear, month = this.currentMonth, type = 'Date') {
      let start, end

      if (this.minDate &&
          this.minDate.getFullYear() === year &&
          this.minDate.getMonth() + 1 === month) {
        start = this.minDate.getDate()
      } else {
        start = 1
      }

      if (this.maxDate &&
          this.maxDate.getFullYear() === year &&
          this.maxDate.getMonth() + 1 === month) {
        end = this.maxDate.getDate()
      } else {
        end = new Date(year, month, 0).getDate()
      }

      const dateData = this.$_generateData(start, end, type, this.unitText[2] || '', 1, arguments)

      if (year === this.currentYear && month === this.currentMonth &&
          this.currentDate >= start && this.currentDate <= end &&
          this.todayText) {
        const currentDateIndex = this.currentDate - start
        const currentDate = dateData[currentDateIndex].text
        dateData[currentDateIndex].text = this.todayText.replace('&', currentDate)
      }

      return dateData
    },
    $_generateDateData(year, month) {
      return this.$_generateDateDataByType(year, month)
    },
    $_generateShortDateData(year, month) {
      return this.$_generateDateDataByType(year, month, 'ShortDate')
    },
    // ===============时============
    $_generateHourDataByType(type = 'Hour') {
      let start = this.minDate ? this.minDate.getHours() : 0
      let end = this.maxDate ? this.maxDate.getHours() : 23

      if (end < start) {
        end = 23
      }

      if (this.isTwelveHours) {
        start = this.$_transHourTo12(start).hour
        end = this.$_transHourTo12(end).hour
      }

      if (start > end) {
        console.warn('MinDate Hour should be earlier than MaxDate')
        return
      }

      const hoursData = this.$_generateData(start, end, type, this.unitText[3] || '', 1, arguments)

      if (this.isTwelveHours && hoursData[0].value === 0) {
        let text
        const _this = this
        if (this.textRender) {
          text = this.textRender.apply(_this, [
            TYPE_FORMAT_INVERSE[type],
            ...arguments,
            12
          ])
        }
        hoursData[0].text = text || `12${this.unitText[3] || ''}`
      }

      return hoursData
    },
    $_generateHourData() {
      return this.$_generateHourDataByType()
    },
    $_generateShortHourData() {
      return this.$_generateHourDataByType('ShortHour')
    },
    // ===============分============
    $_generateMinuteDataByType(type = 'Minute') {
      const start = this.minDate ? this.minDate.getMinutes() : 0
      const end = this.maxDate ? this.maxDate.getMinutes() : 59
      return this.$_generateData(start, end, type, this.unitText[4] || '', this.minuteStep, arguments)
    },
    $_generateMinuteData() {
      return this.$_generateMinuteDataByType()
    },
    $_generateShortMinuteData() {
      return this.$_generateMinuteDataByType('ShortMinute')
    },
    // ===============秒============
    $_generateSecondDataByType(type = 'Second') {
      const start = this.minDate ? this.minDate.getSeconds() : 0
      const end = this.maxDate ? this.maxDate.getSeconds() : 59
      return this.$_generateData(start, end, type, this.unitText[5] || '', this.minuteStep, arguments)
    },
    $_generateSecondData() {
      return this.$_generateSecondDataByType()
    },
    $_generateShortSecondData() {
      return this.$_generateSecondDataByType('ShortSecond')
    },
    $_generateAPData() {
      return [{
        text: this.halfDayText[0],
        type: 'HalfDay',
        typeFormat: 'HalfDay',
        value: 0
      }, {
        text: this.halfDayText[1],
        type: 'HalfDay',
        typeFormat: 'HalfDay',
        value: 1
      }]
    },
    $_generateData(from, to, type, unit, step = 1, args) {
      let count = from
      let text
      const data = []

      args = args || []
      const _this = this

      while (count <= to) {
        // eslint no-useless-call: "error"
        this.textRender &&
        (text = this.textRender.apply(_this, [TYPE_FORMAT_INVERSE[type], ...args, count]))

        data.push({
          text: text || `${count}${unit}`,
          value: count,
          typeFormat: TYPE_FORMAT_INVERSE[type] || type,
          type
        })
        count += step
      }

      return data
    },
    $_transHourTo12(hour) {
      if (hour < 12) {
        return {
          hour,
          ap: 0 // 0 a.m, 1 p.m
        }
      } else {
        return {
          hour: hour - 12,
          ap: 1 // 0 a.m, 1 p.m
        }
      }
    },

    $_onPickerChange(picker, value, index) {
      // columnIndex, itemIndex, value
      this.$emit('change', picker, value, index)

      // column of time parts do not need cascading 部分数据是不需要级联的
      if (~this.disabledCascadeComlumnIndex.indexOf(index)) {
        return
      }

      if (index < this.columnData.length - 1) {
        this.$_initColumnData(index + 1)
      }
    },
    $_onPickerConfirm(columnsValue) {
      this.$emit('confirm', columnsValue)
    },
    $_onPickerCancel() {
      this.$emit('cancel')
      if (this.oldColumnData) {
        this.columnData = [...this.oldColumnData]
      }
    },

    getFormatDate(format = 'yyyy-MM-dd hh:mm:ss') {
      const values = this.picker.getValues()
      let hourTo24 = false
      if (this.isTwelveHours) {
        const halfHour = [...values].splice(values.length - 1, 1)[0]
        halfHour.value && (hourTo24 = true)
      }

      values.forEach(item => {
        /* istanbul ignore if */
        if (!item) {
          return
        }

        let value = hourTo24 && item.type === 'Hour' ? item.value + 12 : item.value

        if (item.typeFormat === 'yy') {
          value = (value + '').substr(2)
        } else {
          if (item.typeFormat.length === 2 && value < 10) {
            value = '0' + value
          }
        }

        format = format.replace(item.type, value)
        format = format.replace(TYPE_FORMAT_INVERSE[item.type], value)
      })

      return format
    }
  }
}
</script>

