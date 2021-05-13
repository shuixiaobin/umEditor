UM.plugins['kityformula'] = function () {

  this.addInputRule(function (root) {
      $.each(root.getNodesByTagName('span'), function (i, node) {
          if (node.hasClass('mathquill-embedded-latex')) {
            var firstChild, latex = '';
            while(firstChild = node.firstChild()){
                latex += firstChild.data;
                node.removeChild(firstChild);
            }
            node.tagName = 'img'
            var latex = utils.unhtml(latex)
            node.setAttr({
              'src': '//latex.huatu.com/latex/convert?latex=' + encodeURIComponent(latex),
              'data-latex': latex,
              'style': ''
            })
              // node.tagName = 'iframe';
              // node.setAttr({
              //     'frameborder': '0',
              //     'src': me.getOpt('UMEDITOR_HOME_URL') + 'dialogs/formula/formula.html',
              //     'data-latex': utils.unhtml(latex)
              // });
          }
      });
  });

  this.addOutputRule(function (root) {
    $.each(root.getNodesByTagName('img'), function (i, node) {
      if (node.getAttr('data-latex')) {
        node.tagName = 'span';
        // <span class="mathquill-embedded-latex" style="width: 36px; height: 41px;">\frac{1}{2}</span>
        node.appendChild(UM.uNode.createText(node.getAttr('data-latex')));
        node.setAttr({
            'frameborder': '',
            'src': '',
            'data-latex': '',
            'class': 'mathquill-embedded-latex',
            'style': 'width: 36px; height: 41px;'
        });
      }
    });
  });

  this.commands['kityformula'] = {
    execCommand: function (cmd, latex) {
      debugger
    },
    queryCommandState: function (cmd) {
        return 0;
    },
    queryCommandValue: function (cmd) {
      debugger
    }
}
}
