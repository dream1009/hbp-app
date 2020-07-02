<template>
  <div class="lc-home">
    <div class="lc-home-logo">
      <van-icon name="logo" class="logo-icon animated slideInDown" />
    </div>
    <div class="lc-home-name" data-in-effect="fadeInLeftBig">
      {{ $t('welcome') }}
    </div>
    <div class="lc-home-time" v-text="percentText">
      0%
    </div>
    <div class="lc-home-copyright">
      <a href="javascript:void(0)" @click="goHome()">{{ $t('company') }}</a>©{{ $t('login.copyright') }}
    </div>
  </div>
</template>

<script>
// import TextEffect from 'text-effect'
export default {
  data() {
    return {
      percent: 0,
      percentText: '0%'
    }
  },
  mounted() {
    alert(123)
    // var te = new TextEffect('.lc-home-name').textillate()
    // te.on('end.tlt')
    this.$router.replace('/dashboard')
    // this.timeCount(() => {
    //   this.$router.replace('/dashboard')
    // })
  },
  methods: {
    goHome() {
      window.location.href = 'http://www.ecitychina.com'
    },
    timeCount(fn) {
      const duration = 1500
      const tick = 100
      const per = 100 / (duration / tick)

      let percent = 0
      const time = setInterval(() => {
        if (percent < 100) {
          percent += per
          this.percentText = `${parseInt(percent)}%`
        } else {
          clearInterval(time)
          fn()
        }
      }, tick)
    }
  }
}

</script>

<style lang="scss">
.lc-home {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: #fff;
  .lc-home-logo {
    position: absolute;
    top: 30%;
    left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
  }
  .logo-icon {
    font-size: 80px;
    color: #3598dc;
  }
  .lc-home-name {
    position: absolute;
    width: 100%;
    top: 45%;
    left: 0;
    font-size: 1.5rem;
    font-weight: 300;
    color: #666;
    text-align: center;
  }
  .lc-home-time {
    position: absolute;
    top: 50%;
    color: #666;
  }
  .lc-home-copyright,
  .lc-home-time {
    width: 100%;
    left: 0;
    font-size: 1rem;
    text-align: center;
  }
  .lc-home-copyright {
    position: fixed;
    bottom: 1rem;
    font-weight: 300;
    color: #999;
  }
}

.animated {
  -webkit-animation-duration: 1s;
  -moz-animation-duration: 1s;
  -o-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  -moz-animation-fill-mode: both;
  -o-animation-fill-mode: both;
  animation-fill-mode: both;
}
.animated.hinge {
  -webkit-animation-duration: 2s;
  -moz-animation-duration: 2s;
  -o-animation-duration: 2s;
  animation-duration: 2s;
}
@-webkit-keyframes fadeInLeftBig {
  0% {
    opacity: 0;
    -webkit-transform: translateX(-2000px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateX(0);
  }
}
@-moz-keyframes fadeInLeftBig {
  0% {
    opacity: 0;
    -moz-transform: translateX(-2000px);
  }
  100% {
    opacity: 1;
    -moz-transform: translateX(0);
  }
}
@-o-keyframes fadeInLeftBig {
  0% {
    opacity: 0;
    -o-transform: translateX(-2000px);
  }
  100% {
    opacity: 1;
    -o-transform: translateX(0);
  }
}
@keyframes fadeInLeftBig {
  0% {
    opacity: 0;
    transform: translateX(-2000px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
.fadeInLeftBig {
  -webkit-animation-name: fadeInLeftBig;
  -moz-animation-name: fadeInLeftBig;
  -o-animation-name: fadeInLeftBig;
  animation-name: fadeInLeftBig;
}

@-webkit-keyframes slideInDown {
  from {
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
    visibility: visible;
  }

  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes slideInDown {
  from {
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
    visibility: visible;
  }

  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

.slideInDown {
  -webkit-animation-name: slideInDown;
  animation-name: slideInDown;
}
</style>
