//@ts-check
const Request               = require('./util/Request');
const Settings              = require('./util/Settings');

/**
 * Response Types:
 *
 * 200: OK
 * 400: Bad Request             -> invalid endpoint
 * 404: Not Found               -> id doesn't exist
 * 405: Method Not Allowed      -> wrong request method
 * 429: Too Many Requests       -> request limit is hit.
 *
 * Source: https://jikan.docs.apiary.io/
 */

class JikanAPI {

    /**
     *
     */
    constructor() {
        this.settings = Settings;
        this.request = new Request();
    }

    /**
     *
     * @param {number} id               Anime ID
     * @param {string} [request]       e.g. characters_staff, episodes, news, pictures, videos, stats, forum, moreinfo, reviews, recommendations, userupdates
     * @param {number} [parameter]     can be used to select a specific page for a anime which has more than 100 episodes
     */
    loadAnime(id, request, parameter) {
        return this.request.send(['anime', id, request, parameter]);
    }


    /**
     *
     * @param {number} id               Manga ID
     * @param {string} [request]       e.g. characters, news, pictures, stats, forum, moreinfo, reviews, recommendations, userupdates
     */
    loadManga(id, request) {
        return this.request.send(['manga', id, request]);
    }

    /**
     *
     * @param {number} id               Person ID
     * @param {string} [request]       e.g. pictures
     */
    loadPerson(id, request) {
        return this.request.send(['person', id, request]);
    }

    /**
     *
     * @param {number} id               Character ID
     * @param {string} [request]       e.g. pictures
     */
    loadCharacter(id, request) {
        return this.request.send(['character', id, request]);
    }

    // TODO add limit as a search Filter
    // TODO rebuild to /search/manga?q=Grand%20Blue&page=1
    /**
     * the query needs to be minimum of 3 letters to be processes by MyAnimeList
     * @param {string} type             only [anime, manga, person, character] allowed - version 1.7.1
     * @param {string} query            Search Query
     * @param {number} [page]
     * @param {{}} [params]             needs to be a key value (Parameter / Argument) pair like: {type: 'tv', status: 'airing'}
     */
    search(type, query, page = null, params = {}, limit = null) {
        if(query.length < 3) return Promise.reject(new Error(`The given query must be of minimum 3 letters! Given query '${query}' has only ${query.length} letters.`));

        params.q = query;
        if(page) params.page = page;
        if(limit) params.limit = limit;
        return this.request.send(['search', type], params);
    }

    /**
     *
     * @param {number} year             year
     * @param {string} season           available types [summer, spring, fall, winter]
     */
    loadSeason(year, season) {
        return this.request.send(['season', year, season]);
    }

    /**
     *
     */
    loadSeasonArchive() {
        return this.request.send(['season', 'archive']);
    }

    /**
     *
     */
    loadSeasonLater() {
        if(this.settings.version < 3) return Promise.reject(new Error('Usable at API version 3+'));
        return this.request.send(['season', 'later']);
    }

    /**
     *
     * @param {string} [day]            available type [monday, tuesday, wednesday, thursday, friday, saturday, sunday, other (v3), unknown (v3)]
     */
    loadSchedule(day) {
        return this.request.send(['schedule', day]);
    }

    /**
     *
     * @param {string} type             available type [anime, manga, people (v3), characters (v3)]
     * @param {number} [page]           page number (50 items are on one Page)
     * @param {string} [subtype]  	    [Anime] airing, upcoming, tv, movie, ova, special [Manga] manga, novels, oneshots, doujin, manhwa, manhua [both] bypopularity, favorite
     */
    loadTop(type, page, subtype) {
        return this.request.send(['top', type, page, subtype]);
    }

    /**
     *
     * @param {string} type             available type [anime, manga]
     * @param {number} id               genre ID
     * @param {number} [page]           page number
     */
    loadGenre(type, id, page) {
        if(this.settings.version < 3) return Promise.reject(new Error('Usable at API version 3+'));
        return this.request.send(['genre', type, id, page]);
    }

    /**
     *
     * @param {number} id               producer ID
     * @param {number} [page]           page number
     */
    loadProducer(id, page) {
        if(this.settings.version < 3) return Promise.reject(new Error('Usable at API version 3+'));
        return this.request.send(['producer', id, page]);
    }

    /**
     *
     * @param {number} id               magazine ID
     * @param {number} [page]           page number
     */
    loadMagazine(id, page) {
        if(this.settings.version < 3) return Promise.reject(new Error('Usable at API version 3+'));
        return this.request.send(['magazine', id, page]);
    }

    /**
     *
     * @param {string} username         username
     * @param {string} [request]          [profile, history, friends, animelist, mangalist]
     * @param {string} [data]             addition data see API docs
     */
    loadUser(username, request, data) {
        if(this.settings.version < 3) return Promise.reject(new Error('Usable at API version 3+'));
        return this.request.send(['user', username, request, data]);
    }

    /**
     *
     * @param {number} id                 Club ID
     */
    loadClub(id) {
        if(this.settings.version < 3) return Promise.reject(new Error('Usable at API version 3+'));
        return this.request.send(['club', id]);
    }

    /**
     *
     * @param {number} id               Club ID
     * @param {number} [page]           page number. If this will be left empty, the default is 1
     */
    loadClubMembers(id, page) {
        if(this.settings.version < 3) return Promise.reject(new Error('Usable at API version 3+'));
        return this.request.send(['club', id, 'members', page]);
    }

    /**
     * Related to the Jikan REST Instance. --> see the official Jikan documentation
     * [to get status information use the function loadStatus]
     *
     * @param {string} type             e.g. anime, manga, characters, people, search, top, schedule, season
     * @param {string} period           e.g. today, weekly monthly
     * @param {number} [offset]         1000 request are shown for use the offset
     */
    loadMeta(type, period, offset) {
        return this.request.send(['meta', 'requests', type, period, offset]);
    }

    /**
     * is for loading the status of the Jikan REST Instance  --> see the official Jikan documentation
     */
    loadStatus() {
        return this.request.send(['meta', 'status']);
    }

    /**
     * can be used for stuff not yet covered with the current Jikanjs wrapper version
     * @param {Array} urlParts          e.g. [anime, 1] to load the anime with the id of 1
     * @param {Object} [queryParameter] query Parameter. Needs to be a key value pair like {type: 'tv', status: 'airing'}
     */
    raw(urlParts, queryParameter) {
        if(!Array.isArray(urlParts)) return Promise.reject(new Error(`The given parameter should be an array like [anime, 1] but given was ${urlParts}`));
        return this.request.send(urlParts, queryParameter);
    }
}

module.exports = new JikanAPI();
