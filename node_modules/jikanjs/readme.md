[![Build Status](https://travis-ci.org/zuritor/jikanjs.svg?branch=master)](https://travis-ci.org/zuritor/jikanjs) [![Coverage Status](https://coveralls.io/repos/github/zuritor/jikanjs/badge.svg?branch=master)](https://coveralls.io/github/zuritor/jikanjs?branch=master) [![Known Vulnerabilities](https://snyk.io/test/github/zuritor/jikanjs/badge.svg?targetFile=package.json)](https://snyk.io/test/github/zuritor/jikanjs?targetFile=package.json)


Jikanjs
=======

Jikanjs is a small Wrapper for the unofficial MAL API [jikan.me](https://github.com/jikan-me/jikan). For more information about the jikan.me, please visit the [jikan.me documentation](https://jikan.moe/docs).

## Installation

`npm install jikanjs --save`

## wrapped jikan Features

* Anime Parsing
* Manga Parsing
* Character Parsing
* People Parsing
* Search
* Seasonal Anime
* Season Archive (v3)
* Season Later (v3)
* Anime Schedule
* Genre (v3)
* Producer (v3)
* Magazine (v3)
* User (v3)
* Top
* Club (v3)
* Club Members (v3)
* Meta

## Additional

* [Raw](https://github.com/zuritor/jikanjs#raw)

## Usage

```javascript
const jikanjs  = require('jikanjs'); // Uses per default the API version 3
```

### Modify API Version
It is possible to change the API version and the API Base URL

```javascript
jikanjs.settings.version = 2; // changes the API version to 2
jikanjs.settings.setBaseURL('apiurl'); // sets the API Base URL
jikanjs.settings.setBaseURL('apiurl', 2); // sets also the api version
```

### API Methods
* All API functions are promised Based
* Information of all possible parameter are located at the Jikan REST-ful API documentation https://jikan.docs.apiary.io/

```javascript
jikanjs.loadAnime(id [, request [, parameter]])
jikanjs.loadManga(id [, request])
jikanjs.loadPerson(id [, request])
jikanjs.loadCharacter(id [, request])
jikanjs.search(type, query [, page [, params]])
jikanjs.loadSeason(year, season)
jikanjs.loadSeasonArchive()
jikanjs.loadSeasonLater()
jikanjs.loadSchedule(day)
jikanjs.loadTop(type [, page [, subtype]])
jikanjs.loadGenre(type, id [, page])
jikanjs.loadProducer(id [, page])
jikanjs.loadMagazine(id [, page])
jikanjs.loadUser(username [, request [, data]])
jikanjs.loadClub(id)
jikanjs.loadClubMembers(id [, page])
jikanjs.loadMeta(type, period [, offset])
jikanjs.loadStatus()
jikanjs.raw(urlParts [, queryParameter])
```
### Examples
To print for example all episodes titles of the anime "No Game No Life" you can do the following:

```javascript
jikanjs.loadAnime(19815, 'episodes').then((response) => {
    response.episodes.forEach(element => {
        console.log(`${element.episode_id}: ${element.title} - ${element.title_romanji} - ${element.title_japanese}`);
    })
}).catch((err) => {
    console.error(err); // in case a error happens
});
```
