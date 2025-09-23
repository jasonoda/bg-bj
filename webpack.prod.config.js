const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.base.config')
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");
const WebpackObfuscator = require("webpack-obfuscator");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = merge(commonConfig, {
    plugins: [
        new HtmlWebpackPlugin({
            template: 'test-index.html',
            filename: 'test-index.html',
            inject: true
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'createGameData.js', to: 'createGameData.js' },
                { from: 'validateGameData.js', to: 'validateGameData.js' },
                { from: 'node_modules/crypto-js/crypto-js.js', to: 'node_modules/crypto-js/crypto-js.js' }
            ]
        })
    ],
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
        splitChunks: {
            chunks: 'all',
        },
    },
    // HtmlWebpackPlugin is already configured in base config
    module: {
        rules: [
            {
                test: /\.(js|mjs)$/,
                exclude: [
                    path.join(__dirname, '/node_modules/'),
                ],
                enforce: 'post',
                use: {
                    loader: WebpackObfuscator.loader,
                    options: {
                        reservedStrings: [  ],
                        rotateStringArray: true,
                        compact: true,
                        controlFlowFlattening: false,
                        controlFlowFlatteningThreshold: 0.75,
                        deadCodeInjection: false,
                        deadCodeInjectionThreshold: 0.4,
                        disableConsoleOutput: true,
                        domainLock: [],
                        domainLockRedirectUrl: 'https://burnghost.com',
                        exclude: [path.join(__dirname, '/node_modules/') + '**/**'],
                        identifierNamesGenerator: 'hexadecimal',
                        identifiersPrefix: '',
                        inputFileName: '',
                        log: false,
                        selfDefending: true,
                        renameGlobals: false,
                        reservedNames: [],
                        reservedStrings: [],
                    }
                }
            }
        ]
    }
})
