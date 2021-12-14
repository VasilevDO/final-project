const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
	entry: ['@babel/polyfill', './src/index.js'],
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].[fullhash].js',
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src/index.html'),
			favicon: path.resolve(__dirname, 'src/assets/favicon.ico'),
		}),
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin(
			{
				patterns: [
					{
						from: path.resolve(__dirname, 'src/assets/favicon.ico'),
						to: path.resolve(__dirname, 'dist'),
					},
				],
			}),
	],
	resolve: {
		modules: [__dirname, 'src', 'node_modules'],
		extensions: ['*', '.js', '.jsx', '.tsx', '.ts'],
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', ['@babel/preset-react', {
							runtime: 'automatic',
						}]],
					},
				},
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.png|svg|jpg|gif$/,
				use: ['file-loader'],
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					'style-loader', 'css-loader', 'sass-loader',
				],
			},
		],
	},
	performance: {
		maxEntrypointSize: 512000,
		maxAssetSize: 512000,
	},
	devServer: {
		historyApiFallback: true,
	},
};
