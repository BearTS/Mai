# maljs - MyAnimeList Scraper
**maljs** gets anime and manga information from [MyAnimeList.net](http://myanimelist.net) and neatly organizes it into classes.

## Example

```javascript
var mal = require('maljs');

// do a quick search
mal.quickSearch('lelouch').then(function(results) {
    // access and fetch the first character
    results.character[0].fetch().then(function(r) {
        // access and fetch the first anime
        r.animeography[0].fetch().then(function(r) {
            console.log(r);
        })
    });
});
```
outputs:
```
Title {
  mal: MyAnimeList { url: 'https://myanimelist.net' },
  type: 'anime',
  id: '1575',
  sn: 'Code_Geass__Hangyaku_no_Lelouch',
  path: '/anime/1575/Code_Geass__Hangyaku_no_Lelouch',
  fetched: true,
  title: 'Code Geass: Hangyaku no Lelouch',
  score: 8.83,
  ranked: 22,
  popularity: 6,
  members: 93,
  cover: 'https://myanimelist.cdn-dena.com/images/anime/5/50331.jpg',
  description: 'In the year 2010, the Holy Empire of Britannia is establishing itself as a dominant military nation, starting with the conquest of Japan. Renamed to Area 11 after its swift defeat, Japan has seen significant resistance against these tyrants in an attempt to regain independence.\r\n\r\nLelouch Lamperouge, exiled prince of Britannia, unfortunately finds himself caught in a crossfire between the two nations\' armed forces. He is able to escape, however, thanks to the timely appearance of a mysterious girl named C.C., who bestows upon him Geass, the "Power of Kings." Realizing the vast potential of his newfound "power of absolute obedience," Lelouch embarks upon a perilous journey as the masked vigilante known as Zero, leading a merciless onslaught against Britannia in order to get revenge once and for all.\r\n\r\n[Written by MAL Rewrite]',
  pictures:
   [ 'https://myanimelist.cdn-dena.com/images/anime/6/5856l.jpg',
     'https://myanimelist.cdn-dena.com/images/anime/10/18746l.jpg',
     'https://myanimelist.cdn-dena.com/images/anime/6/43639l.jpg',
     'https://myanimelist.cdn-dena.com/images/anime/5/49343l.jpg',
     'https://myanimelist.cdn-dena.com/images/anime/5/50331l.jpg',
     'https://myanimelist.cdn-dena.com/images/anime/13/63109l.jpg',
     'https://myanimelist.cdn-dena.com/images/anime/10/73246l.jpg' ],
  characters:
   [ Character {
       mal: [Object],
       id: '1111',
       sn: 'CC',
       path: '/character/1111/CC',
       fetched: false },
     Character {
       mal: [Object],
       id: '559',
       sn: 'Suzaku_Kururugi',
       path: '/character/559/Suzaku_Kururugi',
       fetched: false },
     Character {
       mal: [Object],
       id: '417',
       sn: 'Lelouch_Lamperouge',
       path: '/character/417/Lelouch_Lamperouge',
       fetched: false },
     ...
   ]
}
```

## MyAnimeList

### `Promise(results)` MyAnimeList.quickSearch(q [, type])
Searches and resolves with the results (unfetched):
```
{
    anime: [ Title, Title, ... ],
    manga: [ Title, Title, ... ],
    character: [ Character, Character, ... ]
}
```

`type` can be 'anime', 'manga', 'character' or 'all' (default)

### `Promise(results)` MyAnimeList.getTopAnime()
Returns the top 50 anime (unfetched):
```
[ Title, Title, ... ]
```

### `Promise(results)` MyAnimeList.getTopManga()
Returns the top 50 manga (unfetched):
```
[ Title, Title, ... ]
```

### `Character|Title` MyAnimeList.getById(type, id)
Returns an object for the resource. Note: the resource is not validated! If it's invalid, `.fetch` will fail.

`type` should be one of `"anime" || "manga" || "character"`

You can, alternatively, use the helper functions:
```js
MyAnimeList.getAnimeFromId(id);
MyAnimeList.getMangaFromId(id);
MyAnimeList.getCharacterFromId(id);
```

## Title
Contains information about a manga or anime. The characters are unfetched.
Once fetched, the object will be populated with the following information:
```javascript
{
    type: 'anime' || 'manga',
    id: '1575',
    sn: 'Code_Geass__Hangyaku_no_Lelouch',
    path: '/anime/1575/Code_Geass__Hangyaku_no_Lelouch',
    fetched: true,
    fetched: true,
    title: 'Code Geass: Hangyaku no Lelouch',
    score: 8.83,
    ranked: 22,
    popularity: 6,
    members: 93,
    cover: 'https://myanimelist.cdn-dena.com/images/anime/5/50331.jpg',
    description: 'In the year 2010, the Holy Empire of Britannia...',
    pictures: [
        'https://myanimelist.cdn-dena.com/images/anime/6/5856l.jpg',
        ...
    ],
    characters: [ Character, Character, ... ]
}
```

### `Promise(self)` Title.fetch()
Fetch all information about this title.

## Character
Contains information about a character.
Once fetched, the object will be populated with the following information:
```javascript
{
    id: '417',
    sn: 'Lelouch_Lamperouge',
    path: '/character/417/Lelouch_Lamperouge',
    fetched: true,
    title: 'Lelouch "Lulu, Lelouch vi Britannia, Black Prince, Zero, King of Elevens" Lamperouge',
    cover: 'https://myanimelist.cdn-dena.com/images/characters/4/277146.jpg'
    description: 'Age: 17 (first season), 18 (second season) ...',
    animeography: [ Title, Title, ... ],
    mangaography: [ Title, Title, ... ],
    pictures: [
        'https://myanimelist.net/images/characters/16/80310.jpg',
        ...
    ]
}
```
### `Promise(self)` Character.fetch()
Fetch all information about this character.
