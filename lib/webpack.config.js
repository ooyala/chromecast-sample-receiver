const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
require('dotenv').load();

const config = require('./config.json');

module.exports = {
    entry: {
        'cast' : './src/app/cast.js',
        'cast.min' : './src/app/cast.js',
    },
    devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname, ''),
        host: process.env.SERVER_IP,
        port: process.env.SERVER_PORT
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new webpack.ProvidePlugin({
            'window.logger': 'loglevel'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                LOG_LEVEL: JSON.stringify(config.logLevel.toUpperCase())
            }
        }),
        new UglifyJSPlugin({
            include: /\.min\.js$/,
            sourceMap: true
        })
    ],
    output: {
        path: __dirname + '/dist',
        filename: '[name].js',
        library: 'OOCast',
        libraryTarget: 'umd'
    }
};
