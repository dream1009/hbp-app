/* Copyright 2016 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** globals pdfjsLib, pdfjsViewer */
import { Toast } from 'vant'
var pdfjsLib = require('pdfjs-dist')
var pdfjsViewer = require('pdfjs-dist/web/pdf_viewer.js')
var workerSrc = require('pdfjs-dist/build/pdf.worker.js')

if (!pdfjsLib.getDocument || !pdfjsViewer.PDFViewer) {
  alert('Please build the pdfjs-dist library using\n `gulp dist-install`')
}
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc

var USE_ONLY_CSS_ZOOM = true
var TEXT_LAYER_MODE = 0 // DISABLE
var MAX_IMAGE_SIZE = 1024 * 1024
var CMAP_URL = 'static/pdfjs-dist/cmaps/'
var CMAP_PACKED = true

var DEFAULT_SCALE_DELTA = 1.1
var MIN_SCALE = 0.25
var MAX_SCALE = 10.0
var DEFAULT_SCALE_VALUE = 'auto'

var PDFViewerApplication = {
  pdfLoadingTask: null,
  pdfDocument: null,
  pdfViewer: null,
  pdfHistory: null,
  pdfLinkService: null,

  /**
   * Opens PDF document specified by URL.
   * @returns {Promise} - Returns the promise, which is resolved when document
   *                      is opened.
   */
  open: function(params) {
    if (this.pdfLoadingTask) {
      // We need to destroy already opened document
      return this.close().then(function() {
        // ... and repeat the open() call.
        return this.open(params)
      }.bind(this))
    }

    var url = params.url
    var self = this

    // Loading document.
    var loadingTask = pdfjsLib.getDocument({
      url: url,
      maxImageSize: MAX_IMAGE_SIZE,
      cMapUrl: CMAP_URL,
      cMapPacked: CMAP_PACKED
    })
    this.pdfLoadingTask = loadingTask

    const toast = Toast.loading({
      duration: 0, // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      loadingType: 'spinner',
      message: '文件加载中'
    })
    var p = 0

    loadingTask.onProgress = function(progressData) {
      const percent = Math.round((progressData.loaded / progressData.total) * 100)
      if (percent > p && isNaN(percent)) {
        p = percent
        toast.message = `${percent} %`
      }
    }

    return loadingTask.promise.then(function(pdfDocument) {
      // Document loaded, specifying document for the viewer.
      self.pdfDocument = pdfDocument
      self.pdfViewer.setDocument(pdfDocument)
      self.pdfLinkService.setDocument(pdfDocument)
      self.pdfHistory.initialize(pdfDocument.fingerprint)
      // 清除加载
      toast.clear()

      self.setTitleUsingMetadata(pdfDocument)
    }, function(exception) {
      var message = exception && exception.message
      var l10n = self.l10n
      var loadingErrorMessage

      if (exception instanceof pdfjsLib.InvalidPDFException) {
        // change error message also for other builds
        loadingErrorMessage = l10n.get('invalid_file_error', null,
          'Invalid or corrupted PDF file.')
      } else if (exception instanceof pdfjsLib.MissingPDFException) {
        // special message for missing PDFs
        loadingErrorMessage = l10n.get('missing_file_error', null,
          'Missing PDF file.')
      } else if (exception instanceof pdfjsLib.UnexpectedResponseException) {
        loadingErrorMessage = l10n.get('unexpected_response_error', null,
          'Unexpected server response.')
      } else {
        loadingErrorMessage = l10n.get('loading_error', null,
          'An error occurred while loading the PDF.')
      }

      loadingErrorMessage.then(function(msg) {
        self.error(msg, { message: message })
      })
      // 清除
      toast.clear()
    })
  },

  /**
   * Closes opened PDF document.
   * @returns {Promise} - Returns the promise, which is resolved when all
   *                      destruction is completed.
   */
  close: function() {
    var errorWrapper = document.getElementById('errorWrapper')
    errorWrapper.setAttribute('hidden', 'true')

    if (!this.pdfLoadingTask) {
      return Promise.resolve()
    }

    var promise = this.pdfLoadingTask.destroy()
    this.pdfLoadingTask = null

    if (this.pdfDocument) {
      this.pdfDocument = null

      this.pdfViewer.setDocument(null)
      this.pdfLinkService.setDocument(null, null)
    }

    return promise
  },

  setTitleUsingMetadata: function(pdfDocument) {
    var self = this
    pdfDocument.getMetadata().then(function(data) {
      var info = data.info
      var metadata = data.metadata
      self.documentInfo = info
      self.metadata = metadata

      // Provides some basic debug information
      console.log('PDF ' + pdfDocument.fingerprint + ' [' +
                  info.PDFFormatVersion + ' ' + (info.Producer || '-').trim() +
                  ' / ' + (info.Creator || '-').trim() + ']' +
                  ' (PDF.js: ' + (pdfjsLib.version || '-') + ')')

      var pdfTitle
      if (metadata && metadata.has('dc:title')) {
        var title = metadata.get('dc:title')
        // Ghostscript sometimes returns 'Untitled', so prevent setting the
        // title to 'Untitled.
        if (title !== 'Untitled') {
          pdfTitle = title
        }
      }

      if (!pdfTitle && info && info['Title']) {
        pdfTitle = info['Title']
      }

      if (pdfTitle) {
        self.setTitle(pdfTitle + ' - ' + document.title)
      }
    })
  },

  setTitle: function pdfViewSetTitle(title) {
    document.title = title
    document.getElementById('title').textContent = title
  },

  error: function pdfViewError(message, moreInfo) {
    var l10n = this.l10n
    var moreInfoText = [l10n.get('error_version_info',
      { version: pdfjsLib.version || '?',
        build: pdfjsLib.build || '?' },
      'PDF.js v{{version}} (build: {{build}})')]

    if (moreInfo) {
      moreInfoText.push(
        l10n.get('error_message', { message: moreInfo.message },
          'Message: {{message}}'))
      if (moreInfo.stack) {
        moreInfoText.push(
          l10n.get('error_stack', { stack: moreInfo.stack },
            'Stack: {{stack}}'))
      } else {
        if (moreInfo.filename) {
          moreInfoText.push(
            l10n.get('error_file', { file: moreInfo.filename },
              'File: {{file}}'))
        }
        if (moreInfo.lineNumber) {
          moreInfoText.push(
            l10n.get('error_line', { line: moreInfo.lineNumber },
              'Line: {{line}}'))
        }
      }
    }

    var errorWrapper = document.getElementById('errorWrapper')
    errorWrapper.removeAttribute('hidden')

    var errorMessage = document.getElementById('errorMessage')
    errorMessage.textContent = message

    var errorMoreInfo = document.getElementById('errorMoreInfo')
    var moreInfoButton = document.getElementById('errorShowMore')
    var lessInfoButton = document.getElementById('errorShowLess')
    moreInfoButton.onclick = function() {
      errorMoreInfo.removeAttribute('hidden')
      moreInfoButton.setAttribute('hidden', 'true')
      lessInfoButton.removeAttribute('hidden')
      errorMoreInfo.style.height = errorMoreInfo.scrollHeight + 'px'
    }
    lessInfoButton.onclick = function() {
      errorMoreInfo.setAttribute('hidden', 'true')
      moreInfoButton.removeAttribute('hidden')
      lessInfoButton.setAttribute('hidden', 'true')
    }
    moreInfoButton.removeAttribute('hidden')
    lessInfoButton.setAttribute('hidden', 'true')
    Promise.all(moreInfoText).then(function(parts) {
      errorMoreInfo.value = parts.join('\n')
    })
  },

  progress: function pdfViewProgress(level) {
    var percent = Math.round(level * 100)
    // Updating the bar if value increases.
    if (percent > this.loadingBar.percent || isNaN(percent)) {
      this.loadingBar.percent = percent
    }
  },

  get pagesCount() {
    return this.pdfDocument.numPages
  },

  set page(val) {
    this.pdfViewer.currentPageNumber = val
  },

  get page() {
    return this.pdfViewer.currentPageNumber
  },

  zoomIn: function pdfViewZoomIn(ticks) {
    var newScale = this.pdfViewer.currentScale
    do {
      newScale = (newScale * DEFAULT_SCALE_DELTA).toFixed(2)
      newScale = Math.ceil(newScale * 10) / 10
      newScale = Math.min(MAX_SCALE, newScale)
    } while (--ticks && newScale < MAX_SCALE)
    this.pdfViewer.currentScaleValue = newScale
  },

  zoomOut: function pdfViewZoomOut(ticks) {
    var newScale = this.pdfViewer.currentScale
    do {
      newScale = (newScale / DEFAULT_SCALE_DELTA).toFixed(2)
      newScale = Math.floor(newScale * 10) / 10
      newScale = Math.max(MIN_SCALE, newScale)
    } while (--ticks && newScale > MIN_SCALE)
    this.pdfViewer.currentScaleValue = newScale
  },

  initUI: function pdfViewInitUI() {
    var linkService = new pdfjsViewer.PDFLinkService()
    this.pdfLinkService = linkService

    this.l10n = pdfjsViewer.NullL10n

    var container = document.getElementById('viewerContainer')
    var pdfViewer = new pdfjsViewer.PDFViewer({
      container: container,
      linkService: linkService,
      l10n: this.l10n,
      useOnlyCssZoom: USE_ONLY_CSS_ZOOM,
      textLayerMode: TEXT_LAYER_MODE
    })
    this.pdfViewer = pdfViewer
    linkService.setViewer(pdfViewer)

    this.pdfHistory = new pdfjsViewer.PDFHistory({
      linkService: linkService
    })
    linkService.setHistory(this.pdfHistory)

    document.getElementById('previous').addEventListener('click', function() {
      PDFViewerApplication.page--
    })

    document.getElementById('next').addEventListener('click', function() {
      PDFViewerApplication.page++
    })

    document.getElementById('zoomIn').addEventListener('click', function() {
      PDFViewerApplication.zoomIn()
    })

    document.getElementById('zoomOut').addEventListener('click', function() {
      PDFViewerApplication.zoomOut()
    })

    document.getElementById('pageNumber').addEventListener('click', function() {
      this.select()
    })

    document.getElementById('pageNumber').addEventListener('change',
      function() {
        PDFViewerApplication.page = (this.value | 0)

        // Ensure that the page number input displays the correct value, even if the
        // value entered by the user was invalid (e.g. a floating point number).
        if (this.value !== PDFViewerApplication.page.toString()) {
          this.value = PDFViewerApplication.page
        }
      })

    container.addEventListener('pagesinit', function() {
      // We can use pdfViewer now, e.g. let's change default scale.
      pdfViewer.currentScaleValue = DEFAULT_SCALE_VALUE
    })

    container.addEventListener('pagechange', function(evt) {
      var page = evt.pageNumber
      var numPages = PDFViewerApplication.pagesCount

      document.getElementById('pageNumber').value = page
      document.getElementById('previous').disabled = (page <= 1)
      document.getElementById('next').disabled = (page >= numPages)
    }, true)
  }
}

export default PDFViewerApplication
