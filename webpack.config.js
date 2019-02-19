                // node的核心模块 路径模块
const path = require('path')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let MiniCssExtractPlugin =  require('mini-css-extract-plugin')
console.log(path.resolve(__dirname,'dist'))
let OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
let UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')
// webpack是node写的
module.exports={
    optimizetion:{
        minimizer:[
            new UglifyjsWebpackPlugin({
            }),
            new OptimizeCssAssetsWebpackPlugin({

            })
        ]
    },
    mode:'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname,'dist'),
        filename:'bundle[hash:6].js'
    },
    module: {},
    plugins: [
        new HtmlWebpackPlugin({
            template:'./src/index.html',
            filename:'index.html',
            hash:true,
            minify:{
                removeAttributeQuotes:true,
                collapseWhitespace:true
            }
        }),
        new MiniCssExtractPlugin({
            filename:'main.css'
        })
    ],
    module:{
        rules:[
            {
                test:/\.js$/,
                use:{
                    loader:'babel-loader',
                    options:{
                        presests:['@babel/preset-env'],
                        plugins:[
                            ["@babel/plugin-proposal-decorators", { "legacy": true }],
                            ["@babel/plugin-proposal-class-properties", { "loose" : true }]
                        ]
                    }
                }
            },
            {
                test:/.css$/,
                use:[{
                    loader:'style-loader',
                    options:{
                        insertAt:'top'
                    }
                },'css-loader'],
            },{
                test:/.less$/,
                use:['style-loader','css-loader','less-loader']
            }
        ]
    },
    devServer: {
        contentBase:'./dist',
        port:8080,
        host:'localhost',
        compress:true,
        progress:true,
        proxy:{
            
        }
    }
}
