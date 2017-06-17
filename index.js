'use strict';

const path = require('path');
const fs = require('fs');

function FindReplacePlugin(options = {}) {
	this.src = options.src;
	this.dest = options.dest;
	this.rules = options.rules;
};

FindReplacePlugin.prototype.apply = function(compiler) {
	const folder = compiler.options.context;
	const src = path.join(folder, this.src);
	const dest = path.join(folder, this.dest);
	compiler.plugin('done', (statsData) => {
			const stats = statsData.toJson();
			let template = fs.readFileSync(src, 'utf8');
			template = this.rules.reduce(
				(template, rule) => template.replace(
					rule.find, rule.replace.bind(global, stats)
				),
				template
			);
			fs.writeFileSync(dest, template);
	});
};

module.exports = FindReplacePlugin;