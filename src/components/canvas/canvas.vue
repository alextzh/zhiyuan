<template>
  <div id="pdf-viewer">
    <span class="plus" @click="plus">+</span>
    <span class="minus" @click="minus">-</span>
    <span class="close" @click="close">X</span>
  </div>
</template>

<script type="text/ecmascript-6">
const PDFJS = require('pdfjs-dist').PDFJS
PDFJS.workerSrc = require('pdfjs-dist/build/pdf.worker.min')

export default{
  data() {
    return {
      pdfurl: 'https://cdn.mozilla.net/pdfjs/tracemonkey.pdf',
      pdfDoc: null, // pdfjs 生成的对象
      scale: 1, // 放大倍数
      current: 1, // 当前页数
      numPages: null, // 总页数
      maxscale: 2, // 最大放大倍数
      minscale: 0.8 // 最小放大倍数
    }
  },
  mounted() {
    setTimeout(() => {
      this.initPdf()
    }, 20)
  },
  methods: {
    initPdf() {
      if (!this.pdfurl) {
        return false
      }
      // PDFJS.getDocument(this.pdfurl).then(pdfDoc => {
      //   this.pdfDoc = pdfDoc
      //   this.pageCount = this.pdfDoc.numPages
      //   this.renderPage(this.pageNum)
      // })
      PDFJS.getDocument(this.pdfurl).then(pdfDoc => {
        this.pdfDoc = pdfDoc
        this.numPages = pdfDoc.numPages
        this.renderPage(this.pdfDoc, this.numPages, this.current)
      })
    },
    renderPage(pdf, numPages, current) {
      pdf.getPage(current++).then(page => {
        // console.log('page', page);
        // page.getTextContent().then(v=>console.log(v));
        this.scale = document.body.getBoundingClientRect().width / page.view[2]
        this.minscale = document.body.getBoundingClientRect().width / page.view[2]
        var viewport = page.getViewport(this.scale)
        // Prepare canvas using PDF page dimensions.
        var canvas = document.createElement('canvas')
        var context = canvas.getContext('2d')
        document.body.appendChild(canvas)
        canvas.height = viewport.height
        canvas.width = viewport.width
        // Render PDF page into canvas context.
        var renderContext = {
          canvasContext: context,
          viewport: viewport
        }
        page.render(renderContext)
        // next
        if (current <= numPages) return this.renderPage(pdf, numPages, current)
      })
    },
    // renderPage(pageNum) {
    //   this.pageRendering = true
    //   this.pdfDoc.getPage(pageNum).then(page => {
    //     if (this.initFlag) {
    //       this.scale = document.body.getBoundingClientRect().width / page.view[2]
    //       this.minscale = this.scale
    //     }
    //     this.initFlag = false
    //     const viewport = page.getViewport(this.scale)
    //     const canvas = this.$refs.canvas
    //     const context = canvas.getContext("2d")
    //     canvas.height = viewport.height
    //     canvas.width = viewport.width
    //     const renderContext = {
    //       canvasContext: context,
    //       viewport: viewport
    //     }
    //     const renderTask = page.render(renderContext)
    //     // Wait for rendering to finish
    //     renderTask.promise.then(() => {
    //       this.pageRendering = false
    //       const pageNumPending = this.pageNumPending
    //       if (pageNumPending !== null) {
    //         // New page rendering is pending
    //         renderPage(pageNumPending)
    //         this.pageNumPending = null
    //       }
    //     })
    //   })
    // },
    // 放大
    plus() {
      if (this.scale >= this.maxscale) return
      this.scale += 0.1
      this.renderPage(this.pdfDoc, this.numPages, this.current)
    },
    // 缩小
    minus() {
      if (this.scale <= this.minscale) return
      this.scale -= 0.1
      this.renderPage(this.pdfDoc, this.numPages, this.current)
    },
    close() {
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="scss">
#pdf-viewer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
  ::-webkit-scrollbar {
    width: 0
  }
  .plus, .minus, .close {
    position: absolute;
    right: 10px;
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    text-align: center;
    line-height: 40px;
    background: rgba(0,0,0,.3);
    color: red;
  }
  .plus {
    bottom: 110px;
  }
  .minus {
    bottom: 60px;
  }
  .close {
    bottom: 10px;
  }
}
</style>
