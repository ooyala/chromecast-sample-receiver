const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = require("./config.json")

var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
    template: __dirname + '/src/index.html',
    filename: __dirname + '/dist/index.html',
    inject: 'body',
    hash: true,
    playerId: config.playerBrandingId,
    logo: config.images.logo
});

module.exports = {
    entry : './src/app/cast.js',
    output : {
        path: __dirname + '/dist',
        filename: 'cast.js'
    },
    plugins: [
        HTMLWebpackPluginConfig,
        new CleanWebpackPlugin(['dist']),
        new webpack.ProvidePlugin({
            'window.logger': 'loglevel'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'LOG_LEVEL': JSON.stringify(config.logLevel.toUpperCase())
            }
        }),
        new UglifyJSPlugin({
            sourceMap: true
        }),
        new CopyWebpackPlugin([
            { from: './assets', to: 'images' }
        ], 
        { ignore: ['.DS_Store']}
    ),
    ],
    devtool : 'source-map',
    module : {
        rules : [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use : {
                    loader : 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    }
}