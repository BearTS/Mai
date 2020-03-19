# node-kitsu #
## A simple and easy way to pull info from kitsu.io ##

[![NPM](https://nodei.co/npm/node-kitsu.png)](https://nodei.co/npm/node-kitsu/)

(Note that as of 1.0, node-kitsu now utilizes promises instead of callbacks. If you would like to catch an error in usage, it would look something like `kitsu.searchAnime('example', '0').then(...).catch(/*handle error*/)`.)

Functions:

`searchAnime(query, offset)`
Returns an array of anime objects with anime data if found, null otherwise. Ten results per search, you can adjust the results with `offset`. First object is probably the best fit for the search.
Full anime object can be found [here](http://docs.kitsu17.apiary.io/#reference/media/anime).

```javascript
var kitsu = require('node-kitsu');

kitsu.searchAnime('New Game!', 0).then(results => {
    console.log(results[0])
});
```

`listAnime(offset)`
Returns an array of 10 anime out of all of the anime on the site in order of ID. Offset can be changed to move the starting point. Default is 0.

```javascript
var kitsu = require('node-kitsu');

kitsu.listAnime(0).then(results => {
    console.log(results[0])
});
```

`searchManga(query, offset)`
Returns an array of manga objects with manga data if found, null otherwise. Ten results per search, you can adjust the results with `offset`. First object is probably the best fit for the search.
Full manga object can be found [here](http://docs.kitsu17.apiary.io/#reference/media/manga).

```javascript
var kitsu = require('node-kitsu');

kitsu.searchManga('Monster Musume', 0).then(results => {
    console.log(results[0])
});
```

`listManga(offset)`
Returns an array of 10 manga out of all of the anime on the site in order of ID. Offset can be changed to move the starting point. Default is 0.

```javascript
var kitsu = require('node-kitsu');

kitsu.listManga(0).then(results => {
    console.log(results[0])
});
```

`searchDrama(query, offset)`
Returns an array of drama objects with drama data if found, null otherwise. Ten results per search, you can adjust the results with `offset`.  First object is probably the best fit for the search.
Full drama object can be found [here](http://docs.kitsu17.apiary.io/#reference/media/drama).

(AS OF 3/29/17, THERE ARE NO DRAMAS ON KITSU AS OF YET. THIS WILL RETURN WITH RETURN WITH NO RESULTS UNTIL KITSU STATES OTHERWISE.)

```javascript
var kitsu = require('node-kitsu');

kitsu.searchDrama('Drama').then(results => {
    console.log(results[0])
});
```

`listDrama(offset)`
Returns an array of 10 dramas out of all of the dramas on the site in order of ID. Offset can be changed to move the starting point. Default is 0.

(AS OF 3/29/17, THERE ARE NO DRAMAS ON KITSU AS OF YET. THIS WILL RETURN WITH RETURN WITH NO RESULTS UNTIL KITSU STATES OTHERWISE.)

```javascript
var kitsu = require('node-kitsu');

kitsu.listDrama(0).then(results => {
    console.log(results[0])
});
```

`listUsers(offset)`
Returns an array of 10 users out of all of the users on the site in order of ID. Offset can be changed to move the starting point. Default is 0.

```javascript
var kitsu = require('node-kitsu');

kitsu.listUsers(0).then(results => {
    console.log(results[0])
});
```

`getUser(uid)`
Gets a user's info by username. Returns an array with (most likely) only one object.
Full user object can be found [here](http://docs.kitsu17.apiary.io/#reference/users/library/users).

```javascript
var kitsu = require('node-kitsu');

kitsu.getUser("TheConceptionist").then(results => {
    console.log(results[0])
});
```

`listGenres(offset)`
Returns an array of 10 genres out of all of the genres on the site in order of ID. Offset can be changed to move the starting point. Default is 0.

```javascript
var kitsu = require('node-kitsu');

kitsu.listGenres(0).then(results => {
    console.log(results[0])
});
```

`findCharacter(name, offset)`
Gets a character's info by name. Returns an array with 10 character objects.

```javascript
var kitsu = require('node-kitsu');

kitsu.findCharacter("yagami kou new game", 0).then(results => {
    console.log(results[0])
});
```