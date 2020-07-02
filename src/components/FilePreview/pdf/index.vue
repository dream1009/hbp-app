<template>
  <div id="container">
    <div id="viewerContainer">
      <div id="viewer" class="pdfViewer" />
    </div>

    <div id="errorWrapper" hidden="true">
      <div id="errorMessageLeft">
        <span id="errorMessage" />
      </div>

      <div id="errorMessageRight">
        <van-button id="errorShowMore" size="mini">更多</van-button>
        <van-button id="errorShowLess" size="mini">隐藏</van-button>
      </div>
      <div class="clearBoth" />
      <textarea id="errorMoreInfo" hidden="true" readonly="readonly" />
    </div>

    <footer>
      <div id="previous" class="toolbarButton pageUp" title="Previous Page">
        <van-icon name="up" />
      </div>
      <div id="next" class="toolbarButton pageDown">
        <van-icon name="down" title="Next Page" />
      </div>
      <input
        id="pageNumber"
        type="number"
        class="toolbarField pageNumber"
        value="1"
        size="4"
        min="1"
        @focus="onFocus"
      >

      <div id="zoomOut" class="toolbarButton zoomOut" title="Zoom Out">
        <van-icon name="minus-circle" />
      </div>
      <div id="zoomIn" class="toolbarButton zoomIn" ttitle="Zoom In">
        <van-icon name="plus-circle" />
      </div>
    </footer>
  </div>
</template>
<script>
import PDFViewerApplication from './viewer'

export default {
  methods: {
    animationStartedClosure() {
      // The offsetParent is not set until the PDF.js iframe or object is visible.
      // Waiting for first animation.
      return new Promise(
        function(resolve) {
          window.requestAnimationFrame(resolve)
        })
    },
    load(url) {
      if (this.$utils.isEmpty(url)) return

      PDFViewerApplication.initUI()
      // We need to delay opening until all HTML is loaded.
      this.animationStartedClosure().then(function() {
        PDFViewerApplication.open({
          url: url
        })
      })
    },
    onFocus() {
      setTimeout(function() {
        document.body.scrollTop = document.body.scrollHeight
      }, 300)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/pdf/viewer.scss';
</style>
