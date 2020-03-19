'use strict';

const cheerio = require('cheerio');
const striptags = require('striptags');
const async = require('async');
const Title = require('./Title');

class Character {
	constructor(info, mal) {
		if (typeof (info) == 'string') {
			var k = info.match(/character\/(\d+)\/(\w+)/);
			if (k) {
				info = {
					id: k[1],
					sn: k[2]
				}
			}
		}

		if (!info || typeof (info) != 'object') {
			throw new Error('The info parameter is required to be an object');
		}

		if (!info.id) {
			throw new Error('Missing or invalid info fields');
		}

		this.mal = mal;

		this.id = info.id;
		this.sn = info.sn;
		this.path = `/character/${this.id}/${this.sn}`;
		this.fetched = false;
		this.type = 'character';
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
				self.cover = $('.borderClass').eq(0).find('img').eq(0).attr('src');
				self.description = striptags(
					$('.borderClass').eq(0).next().html()
					.split('<div class="normal_header">Voice Actors</div>')[0]
					.split('</small></span></div>')[1]
				);
				self.animeography = [];
				self.mangaography = [];

				$("div.normal_header:contains('Animeography')").next().find('tr')
					.each(function () {
						$(this).find('td').first().find('a').each(function () {
							self.animeography.push(new Title($(this).attr('href'), self.mal));
						});
					});
				$("div.normal_header:contains('Mangaography')").next().find('tr')
					.each(function () {
						$(this).find('td').first().find('a').each(function () {
							self.mangaography.push(new Title($(this).attr('href'), self.mal));
						});
					});

				async.parallel([
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

	fetchPics(callback) {
		var self = this;
		self.mal.get$(self.path + '/pictures', {}).catch(callback).then(function ($) {
			var pics = [];

			$('.picSurround a.js-picture-gallery').each(function () {
				pics.push(self.mal.url + $(this).attr('href'));
			})

			self.pictures = pics;
			callback(null);
		});
	}

	isFetched() {
		return this.fetched;
	}
}

module.exports = Character;