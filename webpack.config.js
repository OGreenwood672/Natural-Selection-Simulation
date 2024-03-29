const path = require('path');

module.exports = {
    mode: "development",
    entry: './src/index.ts',
    module: {
        rules: [
        {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        publicPath: "public",
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public'),
    },
    devServer: {
        publicPath: "/",
        contentBase: "./public",
        hot: true
    }
};