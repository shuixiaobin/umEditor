;(function () {
  var iframeCache = null

  function createIframe () {
    var link = UMEDITOR_CONFIG.UMEDITOR_HOME_URL + 'dialogs/kityformula/iframe/index.html'
    var iframe = document.createElement('iframe')
    iframe.src = link
    iframe.width = "780px"
    iframe.height = "380px"
    return iframe
  }
  var cacheMe
  UM.registerWidget('kityformula', {
    tpl: '<div class="kityformula-content" style="width: 780px; height: 383px"></div>',
    initContent (editor) {
      if (iframeCache == null) {
        iframeCache = createIframe()
      }

      var me = this, $root = me.root()
      cacheMe = me

      $root.html($.parseTmpl(me.tpl, {}))

      var $content = me.root().find('.kityformula-content')

      $content.append(iframeCache)


      var range = editor.selection.getRange(),
      img = range.getClosedNode()
      if (img && img.tagName == 'IMG' && img.hasAttribute('data-latex')) {
        iframeCache.contentWindow.addEventListener('load', function () {
          iframeCache.contentWindow.setLatex(img.getAttribute('data-latex'))
        })
      }

    },
    initEvent () {

    },
    buttons: {
      'ok': {
        exec: function (editor, $w, e, modal) {
          if (!iframeCache) return
          var me = cacheMe
          var cacheIsShown = modal.data('isShown')
          modal.data('isShown', false)
          iframeCache.contentWindow.getImageData().then(function (src) {
            editor.execCommand('inserthtml', src, true)
            modal.data('isShown', cacheIsShown)
            modal.hide()
          }).catch(function (e) {
            modal.data('isShown', cacheIsShown)
            alert(e.message)
          })
        }
      },
      'cancel': {
        exec (editor) {
        }
      },
    },
    width: 785,
    height: 385,
  })
})()
