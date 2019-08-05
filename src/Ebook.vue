<template>
    <div class="ebook">
      <title-bar :ifTitleAndMenuShow="ifTitleAndMenuShow"></title-bar>
      <div class="read-wrapper">
        <div id="read"></div>
        <div class="mask">
          <div class="left" @click="prevPage"></div>
          <div class="center" @click="toggleTitleAndMenu"></div>
          <div class="right" @click="nextPage"></div>
        </div>
      </div>
      <menu-bar :ifTitleAndMenuShow="ifTitleAndMenuShow"
                :fontSizeList="fontSizeList"
                :defaultFontSize="defaultFontSize"
                @setFontSize="setFontSize"
                :themeList = "themeList"
                :defaultTheme = "defaultTheme"
                @setTheme = "setTheme"
                :bookAvailable = "bookAvailable"
                @onProgressChange = "onProgressChange"
                :navigation = "navigation"
                @jumpTo = "jumpTo"
                ref="menuBar"></menu-bar>
    </div>
</template>

<script>
import TitleBar from '@/components/TitleBar'
import MenuBar from '@/components/MenuBar'
import Epub from 'epubjs' // 导入阅读器引擎
const DOWNLOAD_URL = '/static/2018_Book_AgileProcessesInSoftwareEngine.epub'
// global.epub = Epub
/* eslint-disable space-before-function-paren */
export default {
  components: {
    TitleBar,
    MenuBar
  },
  data() {
    return {
      ifTitleAndMenuShow: false,
      fontSizeList: [
        { fontSize: 12 },
        { fontSize: 14 },
        { fontSize: 16 },
        { fontSize: 18 },
        { fontSize: 20 },
        { fontSize: 22 },
        { fontSize: 24 }
      ],
      defaultFontSize: 16,
      themeList: [
        {
          name: 'default',
          style: {
            body: {
              'color': '#000', 'background': '#fff'
            }
          }
        },
        {
          name: 'eye',
          style: {
            body: {
              'color': '#000', 'background': '#ceeaba'
            }
          }
        },
        {
          name: 'night',
          style: {
            body: {
              'color': '#fff', 'background': '#000'
            }
          }
        },
        {
          name: 'gold',
          style: {
            body: {
              'color': '#000', 'background': 'rgb(241, 236, 226)'
            }
          }
        }
      ],
      defaultTheme: 0,
      // 图书是否处于可用状态
      bookAvailable: false,
      navigation: {}
    }
  },
  methods: {
    // 根据连接跳转到指定位置
    jumpTo(href) {
      this.rendition.display(href)
      // 跳转时隐藏标题栏和菜单栏
      this.hideTitleAndMenu()
    },
    hideTitleAndMenu() {
      // 隐藏标题栏和菜单栏
      this.ifTitleAndMenuShow = false
      // 隐藏菜单栏弹出的设置
      this.$refs.menuBar.hideSetting()
      // 隐藏目录
      this.$refs.menuBar.hideContent()
    },
    // progress 进度调的数值 （0-100）
    onProgressChange(progress) {
      const percentage = progress / 100
      const location = percentage > 0 ? this.locations.cfiFromPercentage(percentage) : 0
      this.rendition.display(location)
    },
    setTheme(index) {
      this.themes.select(this.themeList[index].name)
      this.defaultTheme = index
    },
    registerTheme() {
      this.themeList.forEach(theme => {
        this.themes.register(theme.name, theme.style)
      })
    },
    setFontSize(fontSize) {
      this.defaultFontSize = fontSize
      if (this.themes) {
        this.themes.fontSize(fontSize + 'px')
      }
    },
    toggleTitleAndMenu() {
      this.ifTitleAndMenuShow = !this.ifTitleAndMenuShow
      if (!this.ifTitleAndMenuShow) {
        this.$refs.menuBar.hideSetting()
      }
    },
    prevPage() {
      // Rendition.prev
      if (this.rendition) {
        this.rendition.prev()
      }
    },
    nextPage() {
    // Rendition.next
      if (this.rendition) {
        this.rendition.next()
      }
    },
    // 电子书的解析和渲染
    showEpub() {
      // 生成Book对象
      this.book = new Epub(DOWNLOAD_URL)
      // console.log(this.book)
      // 生成Redition，通过Book.renderTo
      this.rendition = this.book.renderTo('read', {
        // 制定渲染屏幕的宽高
        width: window.innerWidth,
        height: window.innerHeight
      })
      // 通过Redition.display渲染电子书
      this.rendition.display()
      // 获取到Theme对象
      this.themes = this.rendition.themes
      // 设置默认字体
      this.setFontSize(this.defaultFontSize)
      // this.themes.register(name, style)
      // this.themes.select(name）
      this.registerTheme()
      this.setTheme(this.defaultTheme)
      // this.themes.select('night')
      // 获取Locations对象
      // 通过epubjs的钩子函数来实现
      this.book.ready.then(() => {
        // 解析目录信息
        this.navigation = this.book.navigation
        // 解析进度信息
        return this.book.locations.generate()
      }).then(reault => {
        this.locations = this.book.locations
        // this.onProgressChange(50)
        // 保存解析状态
        this.bookAvailable = true
        // console.log(this.bookAvailable)
      })
    }
  },
  mounted() {
    this.showEpub()
  }
}
</script>

<style lang="scss" scoped>
@import 'assets/styles/global';
  .ebook {
    position: relative;
    .read-wrapper {
      .mask {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 100;
        display: flex;
        width: 100%;
        height: 100%;
        .left{
          flex: 0 0 px2rem(100); // 固定100个像素
          /*background: yellow;*/
        }
        .center{
          flex: 1;
          /*background: red;*/
        }
        .right{
          flex: 0 0 px2rem(100);
          /*background: orange;*/
        }
      }
    }
  }
</style>
