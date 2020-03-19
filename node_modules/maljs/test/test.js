'use strict';
const assert = require('assert');
const mal = require('../index.js');

describe('MyAnimeList', function () {
    describe('#quickSearch()', function () {
        it('should get search results', function (done) {
			mal.quickSearch('lelouch').then(function(results) {
				if(results.character.length == 0) {
					done('Search returned 0 results');
				} else {
					done();
				}
			}).catch(done);
        });
    });

	describe('#getTopAnime()', function() {
		it('should get the list of top anime', function(done) {
			mal.getTopAnime().then(function(list) {
				if(list.length == 0) {
					done('Search returned 0 results');
				} else {
					done();
				}
			}).catch(done);
		});
	});

	describe('#getById()', function() {
		it('should return "One Piece" by id', function(done) {
			this.timeout(10000);
			mal.getById('anime', 21).fetch().then(function(e) {
				if(e.title == 'One Piece') {
					done();
				} else {
					done('Got ' + e.title + ' instead');
				}
			}).catch(done);
		});

		it('should return "C.C." by id', function(done) {
			this.timeout(10000);
			mal.getCharacterById(1111).fetch().then(function(e) {
				if(e.title.indexOf('C.C.') == 0) {
					done();
				} else {
					done('Got ' + e.title + ' instead');
				}
			}).catch(done);
		});
	})
});