/* eslint-disable */
// 截取年月日
export function _normalizeDate(date) {
  return date.substr(0, 10)
}

// 转为以万为单位
export function rendererZhMoneyWan(v) {
  if (isNaN(v)) {
    return v
  }
  v = v * 0.0001  // 10000
  v = parseInt(v)
  rendererZhMoney(v)
  return v
}
// 数字千分符
function rendererZhMoney(v) {
  if (isNaN(v)) {
    return v
  }
  v = (Math.round((v - 0) * 100)) / 100
  v = (v === Math.floor(v)) ? v + '.00' : ((v * 10 === Math.floor(v * 10)) ? v + '0' : v)
  v = String(v)
  var ps = v.split('.')
  var whole = ps[0]
  // var sub = ps[1] ? '.' + ps[1] : '.00'
  var r = /(\d+)(\d{3})/
  while (r.test(whole)) {
    whole = whole.replace(r, '$1' + ',' + '$2')
  }
  v = whole
  return v
}
// 数字千分符转数字
export function rendertoNumber(num) {
  num = num.split(',').join('')
  return num
}

export function _normalizeStr(str) {
  str = str || ''
  let arr = str.split(',')
  let newArr = arr.map(item => {
    return item
  })
  return newArr
}

export async function renderPageAsync(pdf, numPages, currPage) {
  for(var i = 1; i <= numPages; i++) {
    let page = await pdf.getPage(i)
    let scale = 1.5
    let viewport = page.getViewport(scale)
    let box = document.getElementById('box')
    let canvas = document.createElement('canvas')
    let context = canvas.getContext('2d')
    box.appendChild(canvas)
    canvas.height = viewport.height
    canvas.width = viewport.width
    // Render PDF page into canvas context.
    let renderContext = {
      canvasContext: context,
      viewport: viewport
    }
    page.render(renderContext)
  }
}

export function renderPage(pdf, numPages, currPage) {
  pdf.getPage(currPage++).then(page => {
    console.log(page)
    var scale = 1.5;
    var viewport = page.getViewport(scale)
    var box = document.getElementById('box')
    var canvas = document.createElement('canvas')
    var context = canvas.getContext('2d')
    box.appendChild(canvas)
    canvas.height = viewport.height
    canvas.width = viewport.width
    // Render PDF page into canvas context.
    var renderContext = {
      canvasContext: context,
      viewport: viewport
    }
    page.render(renderContext)   
    // next
    if(currPage <= numPages) {
      return renderPage(pdf, numPages, currPage)
    }
  })
}