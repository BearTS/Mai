'use strict';

const request = require('request');
const async = require('async');
var Character = null;

class Title {
	constructor(info, mal) {
		if (typeof (info) == 'string') {
			var k = info.match(/(manga|anime)\/(\d+)\/(\w+)/);
			if (k) {
				info = {
					type: k[1],
					id: k[2],
					sn: k[3]
				}
			}
		}

		if (!info || typeof (info) != 'object') {
			throw new Error('The info parameter is required to be an object');
		}

		if (!info.type || !info.id || (info.type != 'anime' && info.type != 'manga')) {
			throw new Error('Missing or invalid info fields');
		}

		this.mal = mal;

		this.type = info.type;
		this.id = info.id;
		this.sn = info.sn;
		this.path = `/${this.type}/${this.id}/${this.sn}`;
		this.fetched = false;
	}

	fetch() {
		var self = this;
		return new Promise(function (resolve, reject) {
			if (self.isFetched()) {
				setTimeout(function () {
					resolve(this);
				}, 0);
				return;
			}

			self.mal.get$(self.path, {}).catch(reject).then(function ($) {
				self.title = $('h1').text().trim();
				self.score = parseFloat($('.fl-l.score').text());
				self.ranked = parseInt($('.numbers.ranked strong').text().substring(1));
				self.popularity = parseInt($('.numbers.popularity strong').text().substring(1));
				self.members = parseInt($('.numbers.members strong').text().substring(1));
				self.cover = $('.ac').eq(0).attr('src');
				self.description = $('span[itemprop=description]').text();

				async.parallel([
					function (callback) {
						self.fetchCharacters(callback)
					},
					function (callback) {
						self.fetchPics(callback);
					}
				], function (err) {
					if (err) {
						reject(err);
					} else {
						self.fetched = true;
						resolve(self);
					}
				})
			});
		});
	}

	fetchCharacters(callback) {
		var self = this;
		// console.log(self.path + '/characters');
		self.mal.get$(self.path + '/characters', {}).catch((err) => {
			callback(null);
		}).then(function ($) {
			//var elem = $('h2:contains("Characters")').next();
			var list = $('.borderClass.bgColor2[valign="top"][align="center"]');

			var characters = [];
			for (var i = 0; i < list.length; i++) {
				let elem = list.eq(i);
				let href = elem.find('a').eq(0).attr('href');
				var url = href.match(/\/character\/(\d+)\/(\w+)/);
				if (!url) {
					continue;
				}
				// console.log(href);
				characters.push(new Character({
					id: url[1],
					sn: url[2]
				}, self.mal));
			}

			self.characters = characters;
			callback(null);
		});
	}

	fetchPics(callback) {
		var self = this;
		self.mal.get$(self.path + '/pics', {}).catch((err) => {
			// console.log(err);
			callback(null);
		}).then(function ($) {
			var pics = [];

			$('.picSurround').each(function () {
				pics.push($(this).find('a').eq(0).attr('href'));
			})

			self.pictures = pics;
			callback(null);
		});
	}

	isFetched() {
		return this.fetched;
	}
}

module.exports = Title;
Character = require('./Character');