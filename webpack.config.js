import { resolve, join } from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';

export const entry = './src/index.js';
export const output = {
    filename: 'bundle.js',
    path: resolve(__dirname, 'build')
};
export const module = {
    rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }
    ]
};
export const plugins = [
    new CopyWebpackPlugin({
        patterns: [
            { from: 'src/script.mjs', to: 'script.mjs' } // Adjust the path as needed
        ]
    })
];
export const devServer = {
    contentBase: join(__dirname, 'build'),
    compress: true,
    port: 9000
};
export const mode = 'development';