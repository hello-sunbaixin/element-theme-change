<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <el-color-picker v-model="colors.primary" @change="changeColor"></el-color-picker>
    <el-tabs v-model="activeName">
      <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
      <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
      <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import generateColors from '../utils/colors'
export default {
  data() {
    return {
      colors: {
        primary: '#409EFF'
      },
      styleFiles: [],
      fontFiles: ['element-icons.ttf', 'element-icons.woff'],
      fonts: [],
      originalStylesheetCount: -1,
      originalStyle: '',
      msg: 'Welcome to Your Vue.js App',
      activeName: "second"
    }
  },
  async created() {

    await Promise.all([this.getIndexStyle(), this.getSeparatedStyles(), this.getFontFiles()]);
    localStorage.getItem('colors') && (this.colors.primary = localStorage.getItem('colors'));
    this.changeColor();

  },
  mounted() {

  },
  methods: {
    getIndexStyle() {
      return this.getFile('//unpkg.com/element-ui/lib/theme-chalk/index.css')
        .then(({ data }) => {
          this.originalStyle = this.getStyleTemplate(data);
        })
    },
    getSeparatedStyles() {
      return this.getFile('//unpkg.com/element-ui/lib/theme-chalk/')
        .then(({ data }) => {
          return data.match(/href="[\w-]+\.css"/g).map(str => str.split('"')[1])
        })
        .then(styleFiles => {

          return Promise.all(styleFiles.map(file => {
            return this.getFile(`//unpkg.com/element-ui/lib/theme-chalk/${file}`)
          }))
        })
        .then(files => {
          this.styleFiles = files.map(file => {
            return {
              name: file.url,
              data: this.getStyleTemplate(file.data)
            }
          })

        })
    },

    getFontFiles() {
      return Promise.all(this.fontFiles.map(font => {
          return this.getFile(`//unpkg.com/element-ui/lib/theme-chalk/fonts/${font}`, true)
        }))
        .then(fonts => {
          this.fonts = fonts
        })
    },
    getFile(url, isBlob = false) {
      return new Promise((resolve, reject) => {
        const client = new XMLHttpRequest()
        client.responseType = isBlob ? 'blob' : ''
        client.onreadystatechange = () => {
          if (client.readyState !== 4) {
            return
          }
          if (client.status === 200) {
            const urlArr = client.responseURL.split('/')
            resolve({
              data: client.response,
              url: urlArr[urlArr.length - 1]
            })
          } else {
            reject(new Error(client.statusText))
          }
        }
        client.open('GET', url)
        client.send()
      })
    },
    getStyleTemplate(data) {
      const colorMap = {
        '#3a8ee6': 'shade-1',
        '#409eff': 'primary',
        '#53a8ff': 'light-1',
        '#66b1ff': 'light-2',
        '#79bbff': 'light-3',
        '#8cc5ff': 'light-4',
        '#a0cfff': 'light-5',
        '#b3d8ff': 'light-6',
        '#c6e2ff': 'light-7',
        '#d9ecff': 'light-8',
        '#ecf5ff': 'light-9'
      }
      Object.keys(colorMap).forEach(key => {
        const value = colorMap[key]
        data = data.replace(new RegExp(key, 'ig'), value)
      })
      return data
    },
    changeColor() {
      localStorage.setItem('colors', this.colors.primary);
      this.colors = Object.assign({}, this.colors, generateColors(this.colors.primary));
      this.writeNewStyle();
    },
    writeNewStyle() {
      let cssText = this.originalStyle
      Object.keys(this.colors).forEach(key => {
        cssText = cssText.replace(new RegExp('(:|\\s+)' + key, 'g'), '$1' + this.colors[key])
      })

      if (this.originalStylesheetCount === document.styleSheets.length) {
        console.log('ddd');
        const style = document.createElement('style')
        style.innerText = cssText
        document.head.appendChild(style)
      } else {
        console.log('eee')
        document.head.lastChild.innerText = cssText
      }
    },
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

</style>
