/* eslint-env node */
/* eslint-disable import/no-nodejs-modules */
/* eslint-disable import/no-commonjs */

const { join } = require("path");

module.exports = {
    entry: "./docsrc/index.js",
    devtool: "cheap-module-eval-source-map",
    output: {
        path: join(__dirname, "docs"),
        filename: "docs-bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/, /\.demo.js$/],
                use: {
                    loader: "babel-loader",
                }
            },
            {
                test: /\.svg$/,
                exclude: /node_modules/,
                use: {
                    loader: "file-loader",
                }
            }
        ]
    },
    devServer: {
        contentBase: join(__dirname, "public"),
        hot: true
    }
};
