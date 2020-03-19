'use strict';

const request = require('request');
const cheerio = require('cheerio');
const async = require('async');
const Title = require('./Title');
const Character = require('./Character');

const url = "https://myanimelist.net";

class MyAnimeList {
	constructor() {
		this.url = url;
	}

	// resolves with the raw contents of a page
	getPage(path, qs) {
		return new Promise(function (resolve, reject) {
			request.get({
				url: url + path,
				qs: qs
			}, function (err, res, body) {
				if (err) {
					console.error(err);
					return reject(err);
				}

				if (res.statusCode != 200) {
					console.error(res.statusCode);
					return reject(new Error(`Failed to GET ${path} - StatusCode: ${res.statusCode}`));
				}

				resolve(body);
			});
		});
	}

	// resolves with a cheerio object for that page
	get$(path, qs) {
		var self = this;
		return new Promise(function (resolve, reject) {
			self.getPage(path, qs).catch(reject).then(function (body) {
				try {
					var $ = cheerio.load(body);
					resolve($);
				} catch (e) {
					reject(e);
				}
			});
		});
	}

	// parses a top{type} page and resolves with a list of Titles
	parseTop(type) {
		var self = this;
		return new Promise(function (resolve, reject) {
			var prom;
			switch (type) {
				case 'anime':
					prom = self.getPage('/topanime.php');
					break;
				case 'manga':
					prom = self.getPage('/topmanga.php');
					break;
				default:
					return reject(new Error(`${type} is not a valid type`));
			}

			prom.catch(reject).then(function (body) {
				try {
					var $ = cheerio.load(body);
					var list = [];
					$('.ranking-list').each(function () {
						var elem = $(this);
						var url = elem.find('a.hoverinfo_trigger').eq(0).attr('href').match(/net\/(\w+)\/(\d+)\/(\w+)/);
						list.push(new Title({
							type: url[1],
							id: url[2],
							sn: url[3]
						}, self));
					});
					resolve(list);
				} catch (e) {
					reject(e);
				}
			});
		});
	}

	getAnimeById(id) {
		return this.getById('anime', id);
	}

	getMangaById(id) {
		return this.getById('manga', id);
	}

	getCharacterById(id) {
		return this.getById('character', id);
	}

	/**
	 * @param type String the type (anime, manga, character)
	 * @param id String the id
	 */
	getById(type, id) {
		if(type == 'character') {
			return new Character({
				id: id
			}, this);
		} else if(type == 'manga' || type == 'anime') {
			return new Title({
				type: type,
				id: id
			}, this);
		} else {
			throw new Error('Invalid type: ' + type);
		}
	}

	getTopAnime() {
		return this.parseTop('anime');
	}

	getTopManga() {
		return this.parseTop('manga');
	}

	// type = 'all' || 'anime' || 'manga' || 'character'
	// q = string
	quickSearch(q, type) {
		type = type || 'all';
		var self = this;
		return new Promise(function (resolve, reject) {
			self.getPage('/search/prefix.json', {
				type: type,
				keyword: q
			}).catch(reject).then(function (body) {
				var results = {
					anime: [],
					manga: [],
					character: []
				}
				try {
					var data = JSON.parse(body);

					if (data.errors && data.errors.length) {
						return reject(data.errors[0]);
					}

					data.categories.forEach(v => {
						if (v.type != 'anime' && v.type != 'manga' && v.type != 'character') {
							return;
						}

						v.items.forEach(item => {
							var r = null;
							if (v.type == 'character') {
								r = new Character(item.url, self);
							} else {
								r = new Title(item.url, self);
							}

							results[v.type].push(r);
						});
					});

					resolve(results);
				} catch (e) {
					reject(e);
				}
			});
		});
	}
}

module.exports = MyAnimeList;