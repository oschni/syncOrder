const path                      = require('path');
const webpack                   = require('webpack');
const ContextReplacementPlugin  = require("webpack/lib/ContextReplacementPlugin");
const VueLoaderPlugin           = require('vue-loader/lib/plugin');

module.exports = {
    context: path.resolve(__dirname, 'src', 'js'),
    mode: 'development',
    node: {
        fs: 'empty',
        net: 'empty'
    },
    resolve: {
        modules: [
            'node_modules'
        ],
        alias: {
            'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
        }
    },
    entry: {
        'login': './login/index.js',
        'home': './home/index.js'
    },
    output: {
        path: path.join(__dirname, 'public', 'dist', 'bundles'),
        publicPath: 'dist/',
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.join(__dirname, 'src', 'js'),
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                //loader: 'style-loader!css-loader'
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            NProgress: 'nprogress',
            accounting: 'accounting'
        }),
        //new BundleAnalyzerPlugin(),
        new ContextReplacementPlugin(/moment[\/\\]locale$/, /de|en/),
        new VueLoaderPlugin()
    ]
};