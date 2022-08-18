import debounce from 'lodash/debounce'
// import { imgRegex, ytRegExp, ytRegExpForStart } from '../../../common/variables'
import { ytRegExp, ytRegExpForStart } from '../../../common/variables'
import {
  removeWhiteCharacters,
  parseHTMLCharacters,
} from '../../../common/characters'

import { checkExtension, checkFileSize } from '../../../common/common-files'
import {VIEW} from '../../pages/users/edit/const'

/* eslint-disable no-undef */
export const Initial = function (...input) {
  if(typeof ($)==='undefined') return
  let [
    id,
    mode,
    accept,
    handleSetContent,
    handleSetIsShowPopupFormatCode,
    handleSetSnContext,
    content,
    maxSize,
    maxFiles,
    maxLength,
    showPopupWarningExtensions,
    handleSetErrorImgs,
    handleSetIsShowPopupWarningMaxFiles,
    contentTextMode,
    contentHTMLMode,
    contentFormatButton,
    contentTooltipFormatButton,
    toolbar,
  ] = input
  let arrMyButton = toolbar.find((p) => p[0] === 'mybutton')
  const button = {}
  let codemirror = {}
  if (arrMyButton && arrMyButton.length) {
    if (arrMyButton[1].find((p) => p === 'textMode')) {
      button.textMode = function () {
        const button = $.summernote.ui.button({
          codeviewButton: true,
          contents: contentTextMode,
          className: 'mode-btn text-btn active',
          click: function () {
            if (mode === 1) return
            const htmlContent = document
              .querySelector(`#simple-editor-${id} .CodeMirror`)
              .CodeMirror.getValue()
            // self.$emit('input', htmlContent)
            handleSetContent(htmlContent)
            $(`#simple-editor-${id} .note-editable`).css('display', 'block')
            mode = 1
            const summerNote = $(`#${id}`)
            summerNote.summernote('codeview.deactivate')
            $(`#simple-editor-${id} .text-btn`)
              .addClass('active')
              .removeClass('html-active')
              .removeClass('.active-code')
            $(`#simple-editor-${id} .html-btn`)
              .removeClass('active')
              .removeClass('html-active')
              .removeClass('active-code')
            $('.format-code-btn')
              .attr('disabled', 'disabled')
              .addClass('disabled')
          },
        })
        return button.render()
      }
    }

    if (arrMyButton[1].find((p) => p === 'htmlMode')) {
      button.htmlMode = function () {
        const button = $.summernote.ui.button({
          codeviewButton: true,
          contents: contentHTMLMode,
          className: 'html-btn mode-btn',
          click: function () {
            if (mode === 2) return

            $(`#simple-editor-${id} .note-editable`).css('display', 'none')
            mode = 2
            $(`#${id}`).summernote('codeview.activate')

            $(`#simple-editor-${id} .text-btn`)
              .removeClass('active')
              .addClass('html-active')
            $(`#simple-editor-${id} .html-btn`)
              .addClass('active')
              .addClass('html-active')
              .addClass('active-code')

            // allow upload img in HTML mode
            $(`#simple-editor-${id} .note-btn`)
              .find('.note-icon-picture')
              .parent()
              .removeClass('disabled')
              .removeAttr('disabled')

            $(`#simple-editor-${id}`)
              .find('.format-code-btn')
              .removeClass('disabled')
              .removeAttr('disabled')
            let codemirror = document.querySelector(
                `#simple-editor-${id} .CodeMirror`
              )?.CodeMirror,
              isPasteData = false,
              counter = 0

            codemirror.on('paste', () => {
              isPasteData = true
            })
            codemirror.on('update', () => {
              if (isPasteData && !content) {
                if (counter == 1) {
                  counter = 0
                  isPasteData = false
                  codemirror.getDoc().setCursor({
                    line: codemirror.lineCount(),
                    ch: $('.note-editable').html().length,
                  })
                } else {
                  counter += 1
                }
              } else {
                counter = 0
                isPasteData = false
              }
            })
            codemirror.getDoc().setCursor({
              line: codemirror.lineCount(),
              ch: $('.note-editable').html().length,
            })
            // self.cmSelection && codemirror.setSelection({line: self.cmSelection, ch: 0})
          },
        })
        return button.render()
      }
      codemirror = {
        theme: 'monokai',
        mode: 'text/html',
        htmlMode: true,
        lineNumbers: true,
        lineWrapping: true,
        indentUnit: 4,
        autofocus: true,
      }
    }
  }
  const viewButton = toolbar.find((p) => p[0] === VIEW)
  if (viewButton && viewButton.length) {
    if (viewButton[1].find((p) => p === 'formatter')) {
      button.formatter = function (context) {
        handleSetSnContext(context)
        // create button
        const button = $.summernote.ui.button({
          contents: contentFormatButton,
          tooltip: contentTooltipFormatButton,
          className: 'format-code-btn',
          click() {
            handleSetIsShowPopupFormatCode(true)
          },
          callback(e) {
            // disable button by default
            e.attr('disabled', 'disabled').addClass('disabled')
          },
        })
        return button.render() // return button as jquery object
      }
    }
  }

  button.countText = function () {
    const button = $.summernote.ui.button({
      codeviewButton: true,
      contents: 'count-text',
      className: 'btn-count-text',
    })
    return button.render()
  }

  $.extend($.summernote.lang, jpLanguage)
  $(`#${id}`).summernote({
    lang: 'ja-JP',
    // placeholder: this.$t('editor-content'),
    tabSize: 4,
    disableResizeEditor: false,
    disableDragAndDrop: true,
    linkTargetBlank: true,
    codeviewFilter: true,
    codeviewIframeFilter: false,
    tooltip: false,
    focus: false,
    toolbar: toolbar,
    maxTextLength: maxLength,
    followingToolbar: true,
    fontSizes: [
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '20',
      '24',
      '28',
      '32',
      '36',
    ],
    buttons: {
      ...button,
    },
    callbacks: {
      onInit: function () {
        $('input[id^=note-dialog-image-file-]').attr('accept', accept)
        // self.dispatchEditor()
      },
      onFocus: function () {
        if ($('.summernote').summernote('isEmpty')) {
          $('.summernote').html('')
        }
      },
      onChange: debounce(function (contents) {
        //TODO: Thao, Need check contents before update
        handleSetContent(contents)
        calculateSEO(id, mode, contents)
      }, 300),
      onChangeCodeview: debounce(function (contents) {
        //TODO: Thao, Need check contents before update
        handleSetContent(contents)
        calculateSEO(id, mode, contents)
      }, 300),
      onImageUpload: (files) =>
        uploadTmpImage(
          files,
          id,
          maxSize,
          maxFiles,
          accept,
          showPopupWarningExtensions,
          handleSetErrorImgs,
          handleSetIsShowPopupWarningMaxFiles
        ),
      // onMediaDelete: function($target) {
      //   self.removeTmpImg($target[0].outerHTML)
      // },
      onPaste: function (e) {
        // Firefox fix
        const clipboard =
          (e.originalEvent || e).clipboardData || window.clipboardData
        if (
          typeof InstallTrigger !== 'undefined' ||
          navigator.userAgent.includes('Firefox') /*fallback to userAgent*/
        ) {
          const htmlContent = clipboard.getData('text/html')
          const plainText = clipboard.getData('Text')
          const summerNote = $(`#${id}`)
          if (plainText && !htmlContent) {
            e.preventDefault()
            const div = document.createElement('div')
            div.innerHTML = (plainText || '').replaceAll('\n', '<br/>')
            summerNote.summernote('pasteHTML', $(div).html())
          }
          return
        }
      },
    },
    codemirror: {
      ...codemirror,
    },
  })
  $(`#${id}`).summernote('code', content || '')
  let videoNote = $(`#${id}`).summernote(
    'module',
    'videoDialog'
  ).createVideoNode
  $(`#${id}`).summernote('module', 'videoDialog').createVideoNode = function (
    url
  ) {
    let variable = videoNote.call(this, ...arguments),
      $video

    if (variable) return variable

    // eslint-disable-next-line no-useless-escape
    const ytMatch = url.match(ytRegExp)

    if (ytMatch) {
      const youtubeId = ytMatch[5]
      let start = 0
      if (typeof ytMatch[6] !== 'undefined') {
        const ytMatchForStart = ytMatch[7].match(ytRegExpForStart)
        if (ytMatchForStart) {
          for (let n = [3600, 60, 1], i = 0, r = n.length; i < r; i++) {
            start +=
              typeof ytMatchForStart[i + 1] !== 'undefined'
                ? n[i] * parseInt(ytMatchForStart[i + 1], 10)
                : 0
          }
        }
      }
      $video = $('<iframe>')
        .attr('frameborder', 0)
        .attr(
          'src',
          '//www.youtube.com/embed/' +
            youtubeId +
            (start > 0 ? '?start=' + start : '')
        )
        .attr('width', '640')
        .attr('height', '360')
      $video.addClass('note-video-clip')
      return $video[0]
    }

    return variable
  }
}

export const onAcceptFormatCode = function (id, snContext) {
  let cm = document.querySelector(
      `#simple-editor-${id} .CodeMirror`
    ).CodeMirror,
    m = snContext.modules
  // push history for redo
  snContext.layoutInfo.editable.html(m.codeview.purify(cm.getValue()))
  m.editor.history.recordUndo()
  cm.autoFormatRange(
    { line: 0, ch: 0 },
    { line: cm.lineCount(), ch: $('.note-editable').html().length }
  )
  setTimeout(() => {
    cm.refresh()
  })
}

function calculateSEO(id, mode, contents) {
  //check SEO characters length
  let seoLength = 0,
    rawContent
  if (mode == 1) {
    //check in text mode

    let element = $(`#simple-editor-${id}`).find('.note-editable').get(0)
    if (element) {
      rawContent = removeWhiteCharacters(element.innerText)
    } else {
      rawContent = ''
    }
  } else if (mode == 2) {
    //check in html mode
    rawContent = parseHTMLCharacters(contents)
  }
  // remove line break characters
  seoLength = (rawContent || '').length

  $(`#simple-editor-${id}`).find('.btn-count-text').text(` ${seoLength} `)
}

async function uploadTmpImage(...input) {
  const [
    files,
    id,
    maxSize,
    maxFiles,
    accept,
    showPopupWarningExtensions,
    handleSetErrorImgs,
    handleSetIsShowPopupWarningMaxFiles,
  ] = input
  let editor = document.getElementById(`simple-editor-${id}`)
  if (editor) {
    let imgElements = editor.querySelectorAll('img')
    if (imgElements.length + files.length > maxFiles) {
      handleSetIsShowPopupWarningMaxFiles(true)
      return
    }
  }

  let errorImgs = []
  for (let i = 0; i < files.length; i++) {
    if (
      !checkExtension(files[i], accept.split(/,\s*/)) ||
      !checkFileSize(files[i], maxSize)
    ) {
      errorImgs.push(files[i])
    }
  }

  if (errorImgs.length > 0) {
    handleSetErrorImgs(
      errorImgs.map((p) => ({
        name: p.name,
        size: formatBytes(p.size),
        extension: p.name ? p.name.split('.').pop() : '',
      }))
    )
    showPopupWarningExtensions()
    return
  }
  let sn = $(`#${id}`)
  for (let item of files) {
    const img = new Image()
    img.src = URL.createObjectURL(item)
    img.className = 'summer-note-img'
    img.dataset['fileName'] = item.name

    sn.summernote('editor.saveRange')
    sn.summernote('editor.restoreRange')
    sn.summernote('editor.focus')
    sn.summernote('insertNode', img)
  }
}

function formatBytes(bytes, decimals = 2) {
  // https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
  // Math.floor = round down - Math.log = logaric - Math.pow(k,i) = k^i
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function setEditorValue(id, value) {
  if(typeof(window.$)  !== 'undefined' && typeof(window.$.summernote)  === 'object') {
    $(`#${id}`).summernote('code', value || '')
  }
}
export function destroyEditor(editorId) {
  if(typeof(window.$)  !== 'undefined' && typeof(window.$.summernote)  === 'object') {
    $(`${editorId}`).summernote('destroy')
  }
}
/* eslint-enable no-undef */

const jpLanguage =  {
  'ja-JP': {
    font: {
      bold: '太字',
      italic: '斜体',
      underline: '下線',
      clear: 'クリア',
      height: '文字高',
      name: 'フォント',
      strikethrough: '取り消し線',
      subscript: 'Subscript',
      superscript: 'Superscript',
      size: '大きさ'
    },
    image: {
      image: '画像',
      insert: '画像挿入',
      resizeFull: '最大化',
      resizeHalf: '1/2',
      resizeQuarter: '1/4',
      floatLeft: '左寄せ',
      floatRight: '右寄せ',
      floatNone: '寄せ解除',
      shapeRounded: 'Shape: Rounded',
      shapeCircle: 'Shape: Circle',
      shapeThumbnail: 'Shape: Thumbnail',
      shapeNone: 'Shape: None',
      dragImageHere: 'ここに画像をドラッグしてください',
      dropImage: 'Drop image or Text',
      selectFromFiles: '画像ファイルを選ぶ',
      maximumFileSize: 'Maximum file size',
      maximumFileSizeError: 'Maximum file size exceeded.',
      url: 'URLから画像を挿入する',
      remove: '画像を削除する',
      original: 'Original'
    },
    video: {
      video: '動画',
      videoLink: '動画リンク',
      insert: '動画挿入',
      url: '動画のURL',
      providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion, Youku)'
    },
    link: {
      link: 'リンク',
      insert: 'リンク挿入',
      unlink: 'リンク解除',
      edit: '編集',
      textToDisplay: 'リンク文字列',
      url: 'URLを入力してください',
      openInNewWindow: '新しいタブで開く'
    },
    table: {
      table: 'テーブル',
      addRowAbove: '行を上に追加',
      addRowBelow: '行を下に追加',
      addColLeft: '列を左に追加',
      addColRight: '列を右に追加',
      delRow: '行を削除',
      delCol: '列を削除',
      delTable: 'テーブルを削除'
    },
    hr: {
      insert: '水平線の挿入'
    },
    style: {
      style: 'スタイル',
      p: '標準',
      blockquote: '引用',
      pre: 'コード',
      h1: '見出し1',
      h2: '見出し2',
      h3: '見出し3',
      h4: '見出し4',
      h5: '見出し5',
      h6: '見出し6'
    },
    lists: {
      unordered: '通常リスト',
      ordered: '番号リスト'
    },
    options: {
      help: 'ヘルプ',
      fullscreen: 'フルスクリーン',
      codeview: 'コード表示'
    },
    paragraph: {
      paragraph: '文章',
      outdent: '字上げ',
      indent: '字下げ',
      left: '左寄せ',
      center: '中央寄せ',
      right: '右寄せ',
      justify: '均等割付'
    },
    color: {
      recent: '現在の色',
      more: 'もっと見る',
      background: '背景色',
      foreground: '文字色',
      transparent: '透明',
      setTransparent: '透明にする',
      reset: '標準',
      resetToDefault: '標準に戻す'
    },
    shortcut: {
      shortcuts: 'ショートカット',
      close: '閉じる',
      textFormatting: '文字フォーマット',
      action: 'アクション',
      paragraphFormatting: '文章フォーマット',
      documentStyle: 'ドキュメント形式',
      extraKeys: 'Extra keys'
    },
    help: {
      'insertParagraph': '改行挿入',
      'undo': '一旦、行った操作を戻す',
      'redo': '最後のコマンドをやり直す',
      'tab': 'Tab',
      'untab': 'タブ戻し',
      'bold': '太文字',
      'italic': '斜体',
      'underline': '下線',
      'strikethrough': '取り消し線',
      'removeFormat': '装飾を戻す',
      'justifyLeft': '左寄せ',
      'justifyCenter': '真ん中寄せ',
      'justifyRight': '右寄せ',
      'justifyFull': 'すべてを整列',
      'insertUnorderedList': '行頭に●を挿入',
      'insertOrderedList': '行頭に番号を挿入',
      'outdent': '字下げを戻す（アウトデント）',
      'indent': '字下げする（インデント）',
      'formatPara': '段落(P tag)指定',
      'formatH1': 'H1指定',
      'formatH2': 'H2指定',
      'formatH3': 'H3指定',
      'formatH4': 'H4指定',
      'formatH5': 'H5指定',
      'formatH6': 'H6指定',
      'insertHorizontalRule': '&lt;hr /&gt;を挿入',
      'linkDialog.show': 'リンク挿入'
    },
    history: {
      undo: '元に戻す',
      redo: 'やり直す'
    },
    specialChar: {
      specialChar: 'SPECIAL CHARACTERS',
      select: 'Select Special characters'
    }
  }
}
