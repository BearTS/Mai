const assert                        = require('chai').assert;
const jikanjs                       = require('../lib/jikan');
const pkg                           = require('../package');

// to not overload the API
beforeEach(function (done) {
    this.timeout(10000);

    setTimeout(function(){
        done();
    }, 3000);
});

describe(`${pkg.name}/API/v2`, function() {

    this.timeout(10000);
    beforeEach(done => {
        jikanjs.settings.version = 2;
        done();
    });

    describe('#General', function() {

        it('API version', function() {
            assert.equal(jikanjs.settings.version, 2, 'the api version should be 2');
        });

        it('API base url', function() {
            assert.equal(jikanjs.settings.getBaseURL().href, 'https://api.jikan.moe/v2', 'the Base url should be https://api.jikan.moe/v2');
        });
    });

    describe('#Anime', function() {

        it('loaded anime', async function() {
            const response = await jikanjs.loadAnime(1);

            assert.equal(response.mal_id, 1, 'wrong id, should be 1');
            assert.equal(response.title, 'Cowboy Bebop', 'wrong title should be Cowboy Bebop');
        });

        it('episode request extension test', async function() {
            const response = await jikanjs.loadAnime(21, 'episodes', 2);

            assert.equal(response.mal_id, 21, 'wrong id, should be 21');
            assert.equal(response.title, 'One Piece', 'wrong title should be One Piece');
            assert.isNotEmpty(response.episode, 'is not empty');
            assert.equal(response.episode.length, 100, 'less or more than 100 episodes, should be 100');
            assert.isAbove(response.episode_last_page, 7, 'not more than 7 pages, should be more');
        });
    });

    describe('#Manga', function() {
        it('loaded manga',  async function() {
            const response = await jikanjs.loadManga(2);

            assert.equal(response.mal_id, 2, 'wrong id, should be 2');
            assert.equal(response.title, 'Berserk', 'wrong title should be Berserk');
        })
    })

    describe('#Person', function() {
        it('loaded person', async function() {
            const response = await jikanjs.loadPerson(8);

            assert.equal(response.mal_id, 8, 'wrong id, should be 8');
            assert.equal(response.name, 'Rie Kugimiya', 'wrong name should be Rie Kugimiya');
        })
    })

    describe('#Character', function() {
        it('loaded character', async function() {
            const response = await jikanjs.loadCharacter(43280);

            assert.equal(response.mal_id, 43280, 'wrong id, should be 43280');
            assert.equal(response.name, 'Inori Yuzuriha', 'wrong name should be Inori Yuzuriha');
        })
    })

    describe('#Search', function() {
        it('search Anime', async function() {
            const response = await jikanjs.search('anime', 'One Piece');

            assert.isNotEmpty(response, 'response should not be empty');
        })

        it('search Anime with less than 3 letters', async function() {
            var query = 'On';

            try {
                await jikanjs.search('anime', query);

            } catch (error) {
                assert.equal(error.message, `The given query must be of minimum 3 letters! Given query '${query}' has only ${query.length} letters.`);
            }
        })

        it('advance search (search the current airing series One Piece)', async function() {
            const response = await jikanjs.search('anime', 'One Piece', 1, {type: 'tv', status: 'airing'});

            assert.isDefined(response.result, 'result should be defined');
            assert.isNotEmpty(response, 'response should not be empty');
        })
    })

    describe('#Season', function() {
        it('load winter season of 2012', async function() {
            const response = await jikanjs.loadSeason(2012, 'winter');

            assert.isDefined(response.season, 'season should be defined');
            assert.equal(response.season_year, `2012`, 'Season Year should be 2012');
            assert.equal(response.season_name, `Winter`, 'Season name should be Winter');
            assert.isNotEmpty(response, 'response should not be empty');
            assert.isAbove(response.season.length, 1, 'season should have minimum of one series');
        })

        it('fetch all upcoming anime [Season Later] (Usable at API Version 3+)', async function() {
            try {
                await await jikanjs.loadSeasonLater();

            } catch (error) {
                assert.equal(error.message, `Usable at API version 3+`);
            }
        })

        it('fetch all registered years with their seasons [Season Archive] (Usable at API Version 3+)', async function() {
            try {
                await await jikanjs.loadSeasonLater();

            } catch (error) {
                assert.equal(error.message, `Usable at API version 3+`);
            }
        })
    })

    describe('#Schedule', function() {
        it('load the current schedule', async function() {
            const response = await jikanjs.loadSchedule();

            assert.isNotEmpty(response, 'response should not be empty');
        })

        it('load schedule of monday', async function() {
            const response = await jikanjs.loadSchedule('monday');

            assert.isDefined(response.monday, 'monday should be defined');
            assert.isNotEmpty(response, 'response should not be empty');
        })
    })

    describe('#Genre', function() {
        it('check if Error is displayed (Usable at API Version 3+)', async function() {
            try {
                await jikanjs.loadGenre('anime', 1);

            } catch (error) {
                assert.equal(error.message, `Usable at API version 3+`);
            }
        })
    })

    describe('#Producer', function() {
        it('check if Error is displayed (Usable at API Version 3+)', async function() {
            try {
                await jikanjs.loadProducer(1);

            } catch (error) {
                assert.equal(error.message, `Usable at API version 3+`);
            }
        })
    })

    describe('#Magazine', function() {
        it('check if Error is displayed (Usable at API Version 3+)', async function() {
            try {
                await jikanjs.loadMagazine(1);

            } catch (error) {
                assert.equal(error.message, `Usable at API version 3+`);
            }
        })
    })

    describe('#User', function() {
        it('check if Error is displayed (Usable at API Version 3+)', async function() {
            try {
                await await jikanjs.loadUser('zuritor');

            } catch (error) {
                assert.equal(error.message, `Usable at API version 3+`);
            }
        })
    })

    describe('#Top', function() {
        it('load anime top', async function() {
            const response = await jikanjs.loadTop('anime');

            assert.isDefined(response.top, 'top should be defined');
            assert.isNotEmpty(response, 'response should not be empty');
        })

        it('load anime top page 2', async function() {
            const response = await jikanjs.loadTop('anime', 2);

            assert.isDefined(response.top, 'top should be defined');
            assert.isNotEmpty(response, 'response should not be empty');
            assert.equal(response.top[0].rank, 51, 'wrong rank');
        })

        it('load anime top page 1 and only for the subtype tv', async function() {
            const response = await jikanjs.loadTop('anime', 1, 'tv');

            assert.isDefined(response.top, 'top should be defined');
            assert.isNotEmpty(response, 'response should not be empty');
            assert.equal(response.top[1].rank, 2, 'wrong rank');
            assert.equal(response.top[1].type, 'TV', 'type should by tv');
        })
    })

    describe('#Club', function() {
        it('fetch information of the club with the id 1 (Usable at API Version 3+)', async function() {
            try {
                await await jikanjs.loadClub(1);

            } catch (error) {
                assert.equal(error.message, `Usable at API version 3+`);
            }
        })

        it('fetch Member information of the club with the id 1 (Usable at API Version 3+)', async function() {
            try {
                await await jikanjs.loadClubMembers(1, 1);

            } catch (error) {
                assert.equal(error.message, `Usable at API version 3+`);
            }
        })
    })

    describe('#Meta', function() {
        it('load meta data of type anime in the periode weekly', async function() {
            const response = await jikanjs.loadMeta('anime', 'weekly');

            assert.isNotEmpty(response, 'response should not be empty');
        })
    })

    describe('#Status', function() {
        it('load status', async function() {
            const response = await jikanjs.loadStatus();

            assert.isNotEmpty(response, 'response should not be empty');
            assert.isDefined(response.cached_requests, 'cached_requests should be defined');
        })
    })

    describe('#Raw', function() {
        it('send a simple request', async function() {
            const response = await jikanjs.raw(['anime', 1]);

            assert.isNotEmpty(response, 'response should not be empty');
            assert.equal(response.mal_id, 1, 'wrong id, should be 1');
            assert.equal(response.title, 'Cowboy Bebop', 'wrong title should be Cowboy Bebop');
        })

        it('urlParts isn\'t an array', async function() {
            var urlParts = {a: 'anime', b: 1};
            try {
                await await jikanjs.raw(urlParts);

            } catch (error) {
                assert.equal(error.message, `The given parameter should be an array like [anime, 1] but given was ${urlParts}`);
            }
        })
    })

    describe('#Error Handling', function() {

        it('400 - Invalid extended request', async function() {
            try {
                await jikanjs.loadAnime(21, 'titles');

            } catch (error) {
                assert.equal(error.message, `Invalid or incomplete endpoint`);
            }
        })

        it('404 - No ID/Path Given', async function() {
            try {
                await jikanjs.loadAnime(0);

            } catch (error) {
                assert.equal(error.message, 'Invalid or incomplete endpoint');
            }
        })

        it('404 - File does not exist', async function() {
            try {
                await jikanjs.loadAnime(2);

            } catch (error) {
                assert.equal(error.message, '404 on https://myanimelist.net/anime/2/');
            }
        })
    })
});

describe(`${pkg.name}/API/v3`, function() {

    this.timeout(10000);

    beforeEach(done => {
        jikanjs.settings.version = 3;
        done();
    });

    describe('#General', function() {

        it('API version', function() {
            assert.equal(jikanjs.settings.version, 3, 'the api version should be 3');
        });

        it('API base url', function() {
            assert.equal(jikanjs.settings.getBaseURL().href, 'https://api.jikan.moe/v3', 'the Base url should be https://api.jikan.moe/v3');
        });
    });

    describe('#Anime', function() {

        it('loaded anime', async function() {
            const response = await jikanjs.loadAnime(1);

            assert.equal(response.mal_id, 1, 'wrong id, should be 1');
            assert.equal(response.title, 'Cowboy Bebop', 'wrong title should be Cowboy Bebop');
        })

        it('episode request extension test', async function() {
            const response = await jikanjs.loadAnime(21, 'episodes', 2);

            assert.isNotEmpty(response.episodes, 'is not empty');
            assert.equal(response.episodes.length, 100, 'less or more than 100 episodes, should be 100');
            assert.isAbove(response.episodes_last_page, 7, 'not more than 7 pages, should be more');
        })
    })

    describe('#Manga', function() {
        it('loaded manga',  async function() {
            const response = await jikanjs.loadManga(2);

            assert.equal(response.mal_id, 2, 'wrong id, should be 2');
            assert.equal(response.title, 'Berserk', 'wrong title should be Berserk');
        })
    })

    describe('#Person', function() {
        it('loaded person', async function() {
            const response = await jikanjs.loadPerson(8);

            assert.equal(response.mal_id, 8, 'wrong id, should be 8');
            assert.equal(response.name, 'Rie Kugimiya', 'wrong name should be Rie Kugimiya');
        })
    })

    describe('#Character', function() {
        it('loaded character', async function() {
            const response = await jikanjs.loadCharacter(43280);

            assert.equal(response.mal_id, 43280, 'wrong id, should be 43280');
            assert.equal(response.name, 'Inori Yuzuriha', 'wrong name should be Inori Yuzuriha');
        })
    })

    describe('#Search', function() {
        it('search Anime', async function() {
            const response = await jikanjs.search('anime', 'One Piece');

            assert.isNotEmpty(response, 'response should not be empty');
        })

        it('search Anime with less than 3 letters', async function() {
            var query = 'On';

            try {
                await jikanjs.search('anime', query);

            } catch (error) {
                assert.equal(error.message, `The given query must be of minimum 3 letters! Given query '${query}' has only ${query.length} letters.`);
            }
        })

        it('advance search (search the current airing series One Piece)', async function() {
            const response = await jikanjs.search('anime', 'One Piece', 1, {type: 'tv', status: 'airing'});

            assert.isDefined(response.results, 'result should be defined');
            assert.isNotEmpty(response, 'response should not be empty');
        })

        it('advance search (search for 10 One Piece Movies)', async function() {
            const response = await jikanjs.search('anime', 'One Piece', 1, {type: 'movie'}, 10);

            assert.isDefined(response.results, 'result should be defined');
            assert.equal(response.results.length, 10, '10 Elements should be returned');
            assert.isNotEmpty(response, 'response should not be empty');
        })
    })

    describe('#Season', function() {
        it('load winter season of 2012', async function() {
            const response = await jikanjs.loadSeason(2012, 'winter');

            assert.isDefined(response.anime, 'season should be defined');
            assert.equal(response.season_year, `2012`, 'Season Year should be 2012');
            assert.equal(response.season_name, `Winter`, 'Season name should be Winter');
            assert.isNotEmpty(response, 'response should not be empty');
            assert.isAbove(response.anime.length, 1, 'season should have minimum of one series');
        })

        it('load all upcoming anime [Season Later]', async function() {
            const response = await jikanjs.loadSeasonLater();

            assert.isNotEmpty(response, 'response should not be empty');
            assert.isDefined(response.anime, 'season should be defined');
            assert.equal(response.season_name, `Later`, 'Season type should be Later');
        })

        it('fetch all registered years with their seasons [Season Archive]', async function() {
            const response = await jikanjs.loadSeasonArchive();

            assert.isNotEmpty(response, 'response should not be empty');
            assert.isDefined(response.archive, 'season archive should be defined');
        })
    })

    describe('#Schedule', function() {
        it('load the current schedule', async function() {
            const response = await jikanjs.loadSchedule();

            assert.isNotEmpty(response, 'response should not be empty');
        })

        it('load schedule of monday', async function() {
            const response = await jikanjs.loadSchedule('monday');

            assert.isDefined(response.monday, 'monday should be defined');
            assert.isNotEmpty(response, 'response should not be empty');
        })
    })

    describe('#Genre', function() {
        it('load Anime of the genre Action Anime', async function() {
            const response = await jikanjs.loadGenre('anime', 1);

            assert.isNotEmpty(response, 'response should not be empty');
            assert.equal(response.mal_url.mal_id, 1, 'returned genre should be 1');
            assert.isDefined(response.anime, 'anime should be defined');
        })
    })

    describe('#Producer', function() {
        it('load Producer information of Studio Pierrot', async function() {
            const response = await jikanjs.loadProducer(1);

            assert.isNotEmpty(response, 'response should not be empty');
            assert.equal(response.meta.mal_id, 1, 'returned producer id should be 1');
            assert.isDefined(response.anime, 'anime should be defined');
        })
    })

    describe('#Magazine', function() {
        it('load information of the Magazine Big Comic Original', async function() {
            const response = await jikanjs.loadMagazine(1);

            assert.isNotEmpty(response, 'response should not be empty');
            assert.equal(response.meta.mal_id, 1, 'returned magazine id should be 1');
            assert.isDefined(response.manga, 'manga should be defined');
        })
    })

    describe('#User', function() {
        it('load Userinformation of zuritor', async function() {
            const response = await jikanjs.loadUser('zuritor');

            assert.isNotEmpty(response, 'response should not be empty');
            assert.equal(response.username, 'zuritor', 'returned username should be zuritor');
        })

        it('load Userinformation of zuritor (Anime History)', async function() {
            const response = await jikanjs.loadUser('zuritor', 'history', 'anime');

            assert.isNotEmpty(response, 'response should not be empty');
            assert.isDefined(response.history, 'history should be defined');
        })
    })

    describe('#Top', function() {
        it('load anime top', async function() {
            const response = await jikanjs.loadTop('anime');

            assert.isDefined(response.top, 'top should be defined');
            assert.isNotEmpty(response, 'response should not be empty');
        })

        it('load anime top page 2', async function() {
            const response = await jikanjs.loadTop('anime', 2);

            assert.isDefined(response.top, 'top should be defined');
            assert.isNotEmpty(response, 'response should not be empty');
            assert.equal(response.top[0].rank, 51, 'wrong rank');
        })

        it('load anime top page 1 and only for the subtype tv', async function() {
            const response = await jikanjs.loadTop('anime', 1, 'tv');

            assert.isDefined(response.top, 'top should be defined');
            assert.isNotEmpty(response, 'response should not be empty');
            assert.equal(response.top[1].rank, 2, 'wrong rank');
            assert.equal(response.top[1].type, 'TV', 'type should by tv');
        })
    })

    describe('#Club', function() {
        it('load information of the Club with the id 1', async function() {
            const response = await jikanjs.loadClub(1);

            assert.isNotEmpty(response, 'response should not be empty');
            assert.equal(response.mal_id, 1, 'returned club id should be 1');
        })

        it('load Member information of the Club with the id 1', async function() {
            const response = await jikanjs.loadClubMembers(1);

            assert.isNotEmpty(response, 'response should not be empty');
            assert.isDefined(response.members, 'members should be defined');
        })
    })

    describe('#Meta', function() {
        it('load meta data of type anime in the periode weekly', async function() {
            const response = await jikanjs.loadMeta('anime', 'weekly');

            assert.isNotEmpty(response, 'response should not be empty');
        })
    })

    describe('#Status', function() {
        it('load status', async function() {
            const response = await jikanjs.loadStatus();

            assert.isNotEmpty(response, 'response should not be empty');
            assert.isDefined(response.cached_requests, 'cached_requests should be defined');
        })
    })

    describe('#Raw', function() {
        it('send a simple request', async function() {
            const response = await jikanjs.raw(['anime', 1]);

            assert.isNotEmpty(response, 'response should not be empty');
            assert.equal(response.mal_id, 1, 'wrong id, should be 1');
            assert.equal(response.title, 'Cowboy Bebop', 'wrong title should be Cowboy Bebop');
        })

        it('urlParts isn\'t an array', async function() {
            var urlParts = {a: 'anime', b: 1};
            try {
                await await jikanjs.raw(urlParts);

            } catch (error) {
                assert.equal(error.message, `The given parameter should be an array like [anime, 1] but given was ${urlParts}`);
            }
        })
    })

    describe('#Error Handling', function() {

        it('400 - Invalid extended request', async function() {
            try {
                await jikanjs.loadAnime(21, 'titles');

            } catch (error) {
                assert.equal(error.message, `Invalid or incomplete endpoint`);
            }
        })

        it('404 - No ID/Path Given', async function() {
            try {
                await jikanjs.loadAnime(0);

            } catch (error) {
                assert.equal(error.message, 'Invalid or incomplete endpoint');
            }
        })

        it('404 - File does not exist', async function() {
            try {
                await jikanjs.loadAnime(2);

            } catch (error) {
                assert.equal(error.message, '404 on https://myanimelist.net/anime/2/');
            }
        })
    })
});
