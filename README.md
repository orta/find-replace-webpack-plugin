# find-replace-webpack-plugin
This plugin makes it easy to find and replace strings in your files. It exposes the full stats object from the webpack build in the replace function so you can easily add your new chunkhashes for example.

## Usage example

```
var webpack = require('webpack');
var path = require('path');
var _ = require('lodash');
var FindReplacePlugin = require('find-replace-webpack-plugin');

module.exports = {
	entry: {
		app: './web/assets/src/js/app.js'
	},

	output: {
		filename: '[name].[chunkhash].js',
		path: path.resolve(__dirname, 'web/assets/js')
	},

	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: function(module) {
				// this assumes your vendor imports exist in the node_modules directory
				return module.context && module.context.indexOf('node_modules') !== -1;
			}
		}),
		new FindReplacePlugin({
			src: 'templates/_layouts/site.html',
			dest: 'templates/_layouts/site.html',
			rules: [
				{
					find: /([^"\/\.]+)(\.?([^"\/\.]*))\.(js|css)/g,
					replace(stats, match, name, dothash, hash, ext) {
						var lookup = _.zipObject(
							_.map(stats.chunks, 'names'),
							_.map(stats.chunks, 'files')
						);
						return lookup[name] || `${name}${dothash}.${ext}`;
					}
				}
			]
		})
	]
}
```