<template style="width:577px;height:378px">
    <div style="height:520px">
        <iframe :id="editorId" class="zhlEditor" src="static\umeditor-1.2.3\indexUm.html" frameborder="0" width="100%" height="100%"></iframe>
    </div>
</template>


<script>
    // <img src="http://latex.codecogs.com/gif.latex?\sqrt{a^2+b^2}">
    import { mapGetters, mapActions } from "vuex";
    export default {
      data() {
        return {
          editorId: this.type + "ueditorId" + this.choiceIndex,
          editor: ""
        };
      },
      created() {
        sessionStorage.setItem("WEBPACK_AJAX_BASE_URL", encodeURI(WEBPACK_AJAX_BASE_URL));
      },
      props: {
        setValue: {
          type: String,
          default: ""
        },
        type: {
          type: String,
          default: ''
        },
        choiceIndex: {
          type: String,
          default: "A"
        }
      },
      mounted() {
        var that = this;
        document
          .getElementById(this.editorId)
          .setAttribute("style", "overflow-y: scroll;");

        var iframe = document.getElementById(this.editorId);
        iframe.onload = function() {
          that.initUmeditor();
        };
      },
      watch: {
        setValue(val) {
          if (val == "") this.editor.setContent(val);
        }
      },
      methods: {
        initUmeditor() {
          this.editor = document.getElementById(this.editorId).contentWindow.um;
          this.editor.setContent(this.setValue);
          this.editor.addListener(
            "contentChange keyup keydown",
            function() {
              // const subStr = new RegExp("&#39;", "g");
              const wordCount = this.editor.getContentLength(true);
              // 获取标签内容
              const reg1 = /<img(.*?)\/?>/g
              const reg2 = /data-latex="(.*?)"/
              const content = this.editor.getContent().replace(reg1, (t, c1) => {
                const arr = reg2.exec(c1)

                if (arr && arr.length > 1) {
                  const latex = arr[1]
                  return `<span class="mathquill-embedded-latex">${latex}</span>`
                }

                return t
              })
              // .replace(subStr, "");
              // 获取文本内容
              const plainTxt = this.editor.getPlainTxt()
              // .replace(subStr, "");
              this.$nextTick(() => {
                if (this.type == "paste")
                  //批量录入的
                  this.$store.dispatch("setBatchPaste", content);
                else if (
                  this.type == "editChoices" ||
                  this.type == "editMaterialList"
                )
                  //..editMaterialList复选题材料
                  this.$store.dispatch(this.type, {
                    //选项
                    content: content,
                    index: this.choiceIndex
                  });
                else this.$store.dispatch(this.type, content);
                this.$emit('change', content)
              });
            }.bind(this)
          );

          // this.editor.addListener("blur", () => {
          //   console.log(this.num + "失去焦点");
          //   //vex里数据同步，根据id隐藏相应的编辑器
          //   this.$store.dispatch("setEditHidden", this.num);
          // });
        },
        getEditorContent() {
          return this.editor.getContent();
        },
        getEditorTxt() {
          return this.editor.getPlainTxt();
        },
        setDisabled() {
          //  不可编辑
          this.editor.setDisabled();
        },
        setEnabled() {
          //  可编辑
          this.editor.setEnabled();
        },
        setVal() {
          this.editor.setContent(this.setValue);
        },
        setLatexVal(a) {
          this.editor.setContent(a);
        },
        insertLatex (str) {
          this.editor.execCommand('inserthtml', str, true)
        }
      }
    };
</script>

<style scoped>
</style>
