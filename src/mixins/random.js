const iconAry = ['approve', 'sign', 'official-document', 'reimbursement', 'my-request']

const colorAry = ['#e7505a', '#3598dc', '#32c5d2', '#578ebe', '#1bbc9b', '#3280fc', '#145ccd', '#8666b8', '#38b03f', '#03b8cf']

const custColor = '#288ef0'

export default {
  methods: {
    _random(ary, i) {
      if (i >= 0) {
        return ary[parseInt(i % ary.length)]
      }
      return ary[ Math.floor((Math.random() * ary.length))]
    },
    _randomIcon(i) {
      return this._random(iconAry, i)
    },
    _randomColor(i) {
      return this._random(colorAry, i)
    },
    _custColor() {
      return custColor
    }
  }
}
