
const path = require('path');
const webpack = require('webpack');
const MediaQueryPlugin = require('media-query-plugin');
module.exports = {
    devtool: false,
    plugins: [
        new webpack.SourceMapDevToolPlugin({}),
        new MediaQueryPlugin({
            include: [
                'App'
            ],
            queries: {
                'print, screen and (min-width: 75em)': 'desktop'
            }
        })
    ],
    entry: './client/src/index.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    'file-loader',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            bypassOnDebug: true, // webpack@1.x
                            disable: true, // webpack@2.x and newer
                        },
                    }
                ]
            }, {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader', MediaQueryPlugin.loader],
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            "@babel/preset-react"
                        ]
                    }
                }
            }
        ]
    }
};