# 基础
## webpack 安装 
安装本地的webpack 
```
yarn add webpack webpack-cli -D // -D(dev development 开发环境)
或
npm install webpack webpack-cli 
```

## webpack 可以进行0配置
- 目录结构
  - src
    - index
- 直接运行 
```
npx webpack 
```
- 打包工具->输出后的结果(js模块)
- 打包（直接js的模块化）
- src一般表示源码文件夹

## 手动配置webpack 
- * 默认配置文件的名字 webpack.config.js(常用) 或 webpackfile.js(不常用)
- webpack 是node写出来的 
### * 配置出口入口
- entry : 入口 可以是相对路径
- output : 出口 输出 必须是绝对路径
  - path : 输出的文件路径 必须是绝对路径
  - filename : 输出的文件名字
### * 配置打包环境
- mode 的值 一般是两个值 
  - development 开发环境 
  - production 生产环境(所有的代码都会被压缩)
如果不配置 默认是production生产环境
### * 开发服务器配置 
```
yarn add webpack-dev-server -D

devServer:{
  port:3000,  // 端口号
  progress:true,  // 显示进度条
  open:true,   // 是否自动打开浏览器
  contentBase:'./dist',  // 目录
  compress:true,   // 是否开启gzip压缩
  proxy:{
    // 可以配置跨域
  },
  ···
}
```
## * 脚本命令 package.json 
script:配置脚本
```
"build": "webpack --config webpack.config.js",  // 运行环境
// --config:指定默认文件是哪个
"dev": "webpack-dev-server",   // 开发环境
"start":"npm run dev"
```
这样就可以通过 npm run dev/npm run build 执行相关的命令

## 处理html 
- 目录结构
  - src
    - index.js
    - index.html
- plugins ：插件集合 当有插件的时候需要配置plugins 类型是数组
```
  * yarn add  html-webpack-plugin
```
  - 在src目录下面建立一个index.html文件
  - 当有插件的时候需要配置plugins 类型是数组
  - 每一个插件都是通过new来调用 例：new HtmlWebpackPlugin()
  - 可以运行 npm run dev/npm run build 查看结果
```
* template:'./src/index.html',  // 以谁做为模板
* filename:'index.html',   // 编译后的文件名（真正用到的文件）
  hash:true,  // 加hash值 
  minify:{   // 压缩配置   
    removeAttributeQuotes:true,   // 去除双引号
    collapseWhitespace: true,    // 去除空格
  }
```

## 直接给文件加hash值(了解) 
```
filename:'bundle[hash].js'
// 可以用 : 后面跟数字数字设置hash值的长短 
filename:'bundle[hash:8].js'
```

## 处理样式
- 目录结构
  - src
    - index.html
    - index.js
    - style.css
- index.js 通过引用 require('/index.css') 报错如下 
```
You may need an appropriate loader to handle this file type.
// appropriate:合适的  loader:装载器，载入程序
// 你可能需要一个合适的装载器
```
- 配置module -> 配置rules数组，表示很多规则用正在匹配js、css等 -> rules里面配置不同的loader，每个loader的配置都是一个对象
```
module:{
  rules:[
    {
      test:···,
      use:···
    },{
      test:···,
      use:···
    }
  ]
}
```
- * loader的配置方法：test匹配规则 use使用什么loader
  - use的用法
  1.字符串 只能写一个loader
  ```
  use:"css-loader"
  ```
  2.数组 可以写多个loader 数组里面可以放字符串和对象
    - css-loader 解析require/import语法
    - style-loader 把css插入到header标签中
    ```
    use:["style-loader","css-loader"]
    ```
    - loader的执行顺序是从右到左 从下到上
    ```
    rules:[
      {
        test:'/\.css/',  // 配置到css
        use:[]
      }
    ]
    
    ```
- use 可以直接写loader，也可以写对象，写成对象的时候可以进行配置
```
yarn add css-loader style-loader -D

{
  loader:'style-loader',
  options:{
    insertAt:'top'    // css 放置位置可以决定css的优先级
  }
}
```
- 目录结构
  - src
    - index.html
    - index.js
    - style.css
    - b.less
- 配置less编译(less->css) 因为从右向左，从下到上执行 所以写在下边和右边
```
yarn add less less-loader -D

rules:[
  {
    test:/\.less$/,
    use:[
      'style-loader',
      'css-loader',
      'less-loader'
    ]
  }
]
```
- 编译sass 
```
yarn add node-sass sass-loader
```
- 编译stylus 
```
yarn add stylus stylus-loader
```

##  抽离css
``` 
* yarn add mini-css-extract-plugin -D
```
- MiniCssExtractPlugin 插件自带一个loader
- MiniCssExtractPlugin.loader 会自动把css抽离出来，作为外部引用的方式引入页面
```
new MiniCssExtractPlugin({
  filename:'main.css'  // 抽离出来的css的文件名
})
```
用 MiniCssExtractPlugin.loader 代替 style-loader 可以进行抽离 
- 在loader里面的写法:
```
{
  test:/.css$/,
  MiniCssExtractPlugin.loader,  // 'style-loader' 内联方式
  'css-loader'
}
```

## 使用 postcss-loader(必配),autoprefixer 添加浏览器前缀 
```
* yarn add postcss-loader autoprefixer -D 

{
  test:/\.less$/,
  use:[
    MiniCssExtractPlugin.loader,
    'css-loader',
    'less-loader',
    'postcss-loader'
  ]
}
```
- 放到所有cssloader后面，执行顺序原因
npm run dev的时候会报错:
```
Error: No PostCSS Config found in: /Users/ruanye/Desktop/project/src
没有找到postcss的默认文件
```
- * 需要配置postcss默认文件 在根目录下创建postcss.config.js
postcss.config.js 文件内容：
```
module.exports={
    plugins:[require('autoprefixer')]
}
```

## * 配置优化项
```
yarn add optimize-css-assets-webpack-plugin uglifyjs-webpack-plugin -D 
// optimize:优化  assets:资源

optimization: { // 优化项
  minimizer: [
    new UglifyJsPlugin({
      cache: true, // 缓存 
      parallel: true, // 是否并发打包
      sourceMap: true  // 源码映射
    }),
    new OptimizeCSSAssetsPlugin({})
  ]
},
```
- mode 改成production
- npm run build 打包之后 css是压缩过的

## 处理js es6转化成es5
- * yarn add babel-loader @babel/core @babel/preset-env
  - @babel/core babel 核心模块
  - @babel-preset-env 标准语法转化成低级语法
- presests 预设
- 箭头函数 arrow-functions
- class 和 es6@ 等(装饰器需要安装额外的插件) 并且添加plugins集合
```
yarn add @babel/plugin-proposal-class-properties @babel/plugin-proposal-decorators 

{
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose" : true }]
  ]
}
``` 
- babel 插件中最常用的插件 promise genarater 
  - 需要 @babel/plugin-transform-runtime
  ```
  yarn add @babel/plugin-transform-runtime 
  ```
  - 生产环境也需要runtime 不加-D
  ```
  yarn add @babel/runtime 
  ```
- es7的一些语法需要其他的,例如：inclueds 补丁包
```
yarn @babel/polyfill
require("@babel/polyfill")
```

## 配置需要设置loader的文件路径  
- * include 包含  
```
include:path.resolve(__dirname,'src'), 
```
- * exclude 不包含  
```
exclude:/node_modules/
```
```
{
  test:/\.js$/,
  use:{
    loader:'bable-loader',
    options:{
      ···
    },
    include:path.resolve(__dirname,'src'), 
    exclude:/node_modules/
  }
}
```

## babel 也可以独立进行配置，文件名字.babelrc
- 配置的时候loader直接写成 use:'babel-loader',其他配置写在.babelrc里面
```
{
  presets:['@bable/preset-env'],
  plugins:[
    ···
  ]
}
```
- 如果webpack options对babel-loader进行了配置,不需要.babelrc文件,如果有的就删除

## js语法校验
- yarn add eslint eslint-loader -D
- eslint 官网 eslint.org
- * 添加enforce pre 强制先执行 previous 前置loader
- 另一种配置方法 .eslint.js
```
module.expors:{
  ···
}
```
.eslintignore elsint的忽略项
```
  test:'/.js$/', 
  loader:'eslint-loader', 
  options:{ 
    enforce:'pre' 
  }
```

## 第三方模块的使用
```
yarn add jquery  
yarn add expose-loader -D
```
- expose-loader  // 暴露全局的loader
  1. 内联loader的方式配置
  ```
  import $ from "expose-loader?$!jquery"
  ```
  2. 正常loader配置
  ```
  {
    test:require.resolve('jquery'),
    loader:"expose-loader?$"
  }
  ```
- 在每个模块中注入$对象 不需要引入可以直接使用$ 这里window.$是undefined  
- 在plugins配置,ProvidePlugin webpack 自带插件
- 自带插件都需要引入webpcak模块
```
let webpack = require('webpack')
...
new webpack.ProvidePlugin({
  $:"jquery"
})
```

## 配置忽略打包项
```
externals:{
  jquery:"jQuery"
}
```

## 在webpack中引入图片的几种方式
- 在js中创建图片来引入
```
import logo from './logo.png';
let img = new image ;
img.src = logo
document.body.appengChild(img)
```
- 在css 引入 background(url)
- ```<img src=''/>```

## 图片处理 
```
yarn add file-loader html-withimg-loader url-loader -D
```
- file-loader 
```
{
  test:/\.(png,jpg,gif)$/,
  user:'file-loader'
}
```
- * 在html 引入图片 打包会找不到文件 需要使用 html-withimg-loader
url-loader 
html-withimg-loader
```
{
  test:/\.html$/,
  user:'html-withimg-loader'
}
```
- * 在图片非常小的情况下不希望走http请求，一般情况下不会直接使用file-loader 通常使用 url-loader
- 在图片小于多少k的时候可以做一个限制，用base64来转化,base64大小会比原来文件大3分之一  
```
{
  test:/\.(png,jpg,gif)$/,
  user:{
    loder:'url-loader',
    options:{
      limit:1000  // 表示多少字节
    }
  }
}
```

## * 打包文件分类 
1. 图片loader的options 里面添加
```
options:{
  limit:1000
  outputPath:'/img/',
}
```
2. css 添加在css插件里面
``` 
  new MiniCssExtractPlugin({
    filename:'css/main.css'
  })
```
3. js添加到filename前面
```
filename:'js/main[hash].js',
```
4. 添加域名 publicPath的用法
```
output: {
  filename: 'bundle.js', 
  path: path.resolve(__dirname, 'build'),
  publicPath:'http://www.baidu.cn'
}
```
- 如果只需要图片添加域名
```
options:{
  limit:1,
  outputPath:'/img/',
    publicPath:'http://www.baidu.cn'
}
```

## 打包多页应用 
- 入口需要配置成对象
```
entry:{
  home:'./src/index.js',
  b:'./src/b.js'
},
```
- 出口需要多个出口，改变filename的写法
- 保证html页面引入自己对应的js
```
output:{
  filename:'[name].js',
  path:path.resolve(__dirname,'dist')
}
```
- chunks:代码块 每一个代码块对应自己需要的js文件
- 多个页面需要多个HtmlWebpackPlugin
```
plugins:[
  new HtmlWebpackPlugin({
    template:'./src/index.html',
    filename:'index.html',
    chunks:['home','b']   
  }),
  new HtmlWebpackPlugin({
    template:'./src/index.html',
    filename:'b.html',
    chunks:['b']
  })
]
```

## * 配置 soure-map 源码映射
作用：用来调试源码 
```
devtools:'source-map'
```
- 测试 npm run dev
- source-map 会单独生成一个sourcemap文件 可以帮我们调试源代码 会显示当前报错的列和行
- eval-source-map 不会产生单独的文件 但是会显示报错的行和列
- cheap-module-source-map 不会产生列 但是会产生一个单独的文件 
- cheap-module-eval-source-map 不会产生文件也不会产生列 会直接集成在文件里 

##实时编译
（很少用）
watch:true 
- 监控的选项
```
watchOptions:{
	poll:1000  每秒问我多少次(有没有更新)
	aggreatmentTimeout:500     防抖(一直输入时不会实时编译) 一直输入代码
	ignored:/node_modules/
}
```

## * webpcak 常用插件
- * CleanWebpackPlugin  清除缓存插件,可以写字符串 也可以写成数组
```
yarn add clean-webpack-plugin

new CleanWebpackPlugin('./dist'),
new CleanWebpackPlugin(['./dist','./img'])
```
- * CopyWebpackPlugin  拷贝插件
```
yarn add copy-webpack-plugin

new CopyWebpackPlugin([ //
  {from:'img',to:'./img'}    从···拷贝到···
]),
```
- BannerPlugin  版权声明插件 webpack自带插件(所有自带插件都要引入webpack) 所有人需要写
```
yarn add banner-plugin

let webpack = require('webpack')
new webpack.BannerPlugin('made 2019 by sxq')
```

## webpack 跨域
1. * 代理的方式  重写的方式 把请求代理到express服务器上 
```
devServer:{
  ···
  proxy:{ 
    '/api':{
      target:'http://localhost:3000', // 等于访问当前服务器下面 '/api'
      pathRewrite:{'/api':''}  // 重写路径，访问 /api/user 时等于访问 localhost:3000/user
    }   // 配置了一个代理
  }
}
```
2. 我们前端只想单纯来模拟数据 直接使用webpack提供模拟(mock)数据
- webpack 提供一个方法 before
- 参数是app，app就是 let app = express()
```
before(app){  // webpack提供的方法 钩子
  app.get('/user',(req,res)=>{
    res.json({name:'leilei'})
  })
}
```
3. 可以直接在node的服务端启动webpack，端口是服务端端口，不再需要npm run dev来启动webpack
```
yarn add webpack-dev-middleware -D
```
server.js修改如下 
```
let webpack = require('webpack');
let middle = require('webpack-dev-middleware');
let config = require('./webpack.config.js');
let compiler = webpack(config);
app.use(middle(compiler));
```

## resolve用法
- modules：可以直接指定查找的目录层级，不再往上级目录寻找
- * extensions 拓展名 作用：在import引用时可以省略文件后缀，它会自己查找
- * alias:别名  
```
bootstrap:"bootstrap/dist/css/bootstrap.css"
名字：后面是对应的路径
```
- 在第三方包的package.json里面，会先查找main字段(main:主入口),然后再查找其他字段
mainFields：可以配置先从哪个入口开始
mainFiles：入口文件的名字，通常都是index.js
```
resolve:{
    modules:[path.resolve('node_modules')],
    extensions:['.js','.css','.json','.vue'],
    mainFields:['style','main']
    mainFiles:[], // 入口文件的名字 index.js
    alias:{ 
       bootstrap:'bootstrap/dist/css/bootstrap.css'
    }
 }
```

## 区分环境
webpack.config.js改成 webpack.base.js
新建文件 webpack.prod.js 和 webpack.dev.js
- 配置开发环境的写法
  - 合并文件
  ```
  yarn add webpack-merge
  ```
  smart 是最简化版 也可以直接写 let merge = require('webpack-merge')
```
webpack.dev.js 

let {smart} = require('webpack-merge'); 
let base = require('./webpack.base.js');
合并base文件

module.exports = smart(base,{
   mode: 'development',
   devServer:{

   },
   devtool:'source-map'
})
```
- 配置生产环境的写法 
```
let {smart} = require('webpack-merge');
let base = require('./webpack.base.js');

module.exports = smart(base,{
   mode: 'production',
   optimization:{
     minimizer:[

     ]
   },
   plugins:[
     
   ]
})
```

## webpack 优化
1. noparse 不去解析第三方包
```
module: {
  noParse: /jquery/, // 不去解析jquery中的依赖库 
  ...
}
```
2. IgnorePlugin webpack内置插件 以moment库为例
- index.js内容
```
import moment from 'moment'
设置语言

手动引入需要的语言 
因为不再打包local文件 我们需要手动引入需要的语言包
import 'moment/locale/zh-cn'

moment.locale('zh-cn')
let r = moment().endOf('day').fromNow();   
console.log(r);   
```
- 插件写法 不打包当前moment目录下的locale文件夹
```
new webpack.IgnorePlugin(/\.\/locale/,/moment/)
```























