const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: ['./src/js/index.js', './src/sass/index.scss'],
    output: {
   path: path.resolve(__dirname, 'dist'),
   filename: 'js/bundle.js'
     },
     mode: 'development',
     watch: true,
     watchOptions: {
   ignored: ["node_modules/**"],
     },
     experiments: {
         topLevelAwait: true
     },
     module: {
         rules: [
             {
                 test: /\.js$/,
                 exclude: /node_modules/,
                 loader: "babel-loader"
             },
             {
     test: /\.scss$/,
     use: [
         {
       loader: MiniCssExtractPlugin.loader
         },
         {
       // Interprets CSS
       loader: "css-loader",
       options: {
           importLoaders: 2
       }
         },
         {
       loader: 'sass-loader' // 将 Sass 编译成 CSS
         }
     ]
       }
         ]
     },
     // Use the plugin to specify the resulting filename (and add needed behavior to the compiler)
     plugins: [
         new MiniCssExtractPlugin({
       filename: 'css/index.css'
   }),
	new CopyPlugin({
	    patterns: [
		{
		    from: 'src/assets',
		    to: 'assets' // copies all files to dist/assets
		}
	    ]
	})
    ]
};
