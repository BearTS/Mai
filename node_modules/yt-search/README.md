[![npm](https://img.shields.io/npm/v/yt-search.svg?maxAge=3600)](https://www.npmjs.com/package/yt-search)
[![npm](https://img.shields.io/npm/dm/yt-search.svg?maxAge=3600)](https://www.npmjs.com/package/yt-search)
[![npm](https://img.shields.io/npm/l/yt-search.svg?maxAge=3600)](https://www.npmjs.com/package/yt-search)

#  yt-search
simple youtube search API and CLI

![](https://thumbs.gfycat.com/ContentShockingCuttlefish-size_restricted.gif)

## Installation
```bash
npm install yt-search # local module usage
```

## Easy to use
```bash
const yts = require( 'yt-search' )

yts( 'superman theme', function ( err, r ) {
  if ( err ) throw err

  cosnt videos = r.videos
  videos.forEach( function ( v ) {
    const views = String( v.views ).padStart( 10, ' ' )
    console.log( `${ views } | ${ v.title } (${ v.timestamp }) | ${ v.author.name }` )
  } )
} )

// promises also supported
// const r = await yts( 'superman theme' )
```

###### output
```javascript
36195691 | Superman Theme (4:13) | Super Man
 6618027 | Superman • Main Theme • John Williams (4:26) | HD Film Tributes
 6521591 | Superman - Main Theme (BBC Proms) (4:46) | m fowkes
```

> API/Docs/Samples at bottom of README!

## About
Simple function to get youtube search results.

## Why
Not sure..

## How
Using HTTP requests and parsing the results with [cheerio](https://github.com/cheeriojs/cheerio).

CLI interactive mode with [node-fzf](https://github.com/talmobi/node-fzf)

## Options
```bash
const opts = {
  query: 'superman theme',
  // search: 'superman theme', // same as opts.query

  pageStart: 1, // first page result
  pageEnd: 3, // until page 3

  // get metadata for a single video by id
  // if set, will ignore all other options
  // videoId: 'e9vrfEoc8_g',

  // get metadata a single playlist by id
  // if set, will ignore all other options
  // listId: 'PL7k0JFoxwvTbKL8kjGI_CaV31QxCGf1vJ',
}

yts( opts, function ( err, r ) {
  // if opts is a string then yt-search
  // will create this default options object
  if ( typeof opts === 'string' ) {
    opts = {
      query: opts,
      pageStart: 1,
      pageEnd: 3
    }
  }

  // ...
} )
```

## Test
```
npm test
```

## API

###### Search ( video result )
```js
const yts = require( 'yt-search' )

yts( 'superman theme', function ( err, r ) {
  const videos = r.videos
  const playlists = r.playlists || r.lists
  const channels = r.channels || r.accounts

  console.log( videos[ 0 ] )
} )
```

###### Output ( video, search result )
```js
{ type: 'video',

  title: 'Superman Theme',
  description: 'The theme song from Superman: The Movie.',

  url: 'https://youtube.com/watch?v=e9vrfEoc8_g',

  videoId: 'e9vrfEoc8_g',

  seconds: 253,
  timestamp: '4:13',

  duration:
   { toString: [Function: toString],
     seconds: 253,
     timestamp: '4:13' },

  views: 36195691,

  thumbnail: 'https://i.ytimg.com/vi/e9vrfEoc8_g/default.jpg',
  image: 'https://i.ytimg.com/vi/e9vrfEoc8_g/hqdefault.jpg',

  ago: '10 years ago',

  author:
   { name: 'Super Man',
     id: 'Redmario2569',
     url: '/user/Redmario2569',
     userId: 'Redmario2569',
     userName: 'Super Man',
     userUrl: '/user/Redmario2569',
     channelId: '',
     channelUrl: '',
     channelName: '' } }
```

###### Search ( playlist result )
```js
const yts = require( 'yt-search' )

yts( 'superman theme playlist', function ( err, r ) {
  const videos = r.videos
  const playlists = r.playlists || r.lists
  const channels = r.channels || r.accounts

  console.log( playlists[ 0 ] )
} )
```

###### Output ( playlist, search result )
```js
{ type: 'list',

  title: 'Superman Theme Songs',
  url:
   'https://youtube.com/playlist?list=PLYhKAl2FoGzC0IQkgfVtM991w3E8ro1yG',

  listId: 'PLYhKAl2FoGzC0IQkgfVtM991w3E8ro1yG',

  videoCountLabel: '21 videos',
  videoCount: 21,

  thumbnail: 'https://i.ytimg.com/vi/yCCq_6ankAI/default.jpg',
  image: 'https://i.ytimg.com/vi/yCCq_6ankAI/hqdefault.jpg',

  author:
   { name: 'AJ Lelievre',
     id: 'UCNtE3kchpzZNnC2ZIGSBR9A',
     url: 'https://youtube.com/channel/UCNtE3kchpzZNnC2ZIGSBR9A',
     userId: '',
     userUrl: '',
     userName: '',
     channelId: 'UCNtE3kchpzZNnC2ZIGSBR9A',
     channelUrl: 'https://youtube.com/channel/UCNtE3kchpzZNnC2ZIGSBR9A',
     channelName: 'AJ Lelievre' } }
```

###### Search ( channel result )
```js
const yts = require( 'yt-search' )

yts( 'superman theme playlist', function ( err, r ) {
  const videos = r.videos
  const playlists = r.playlists || r.lists
  const channels = r.channels || r.accounts

  console.log( channels[ 0 ] )
} )
```

###### Output ( channel, search result )
```js
{ type: 'channel',

  title: 'PewDiePie',
  description: 'I make videos.',

  url: 'https://youtube.com/user/PewDiePie',

  videoCountLabel: '4,067 videos',
  videoCount: 4067,

  thumbnail:
   'https://yt3.ggpht.com/a/AGF-l79FVckie4j9WT-4cEW6iu3gPd4GivQf_XNSWg=s176-c-k-c0x00ffffff-no-rj-mo',

  name: 'PewDiePie',
  id: 'PewDiePie' }
```

###### Video metadata by id
```js
const yts = require( 'yt-search' )

const opts = { videoId: 'e9vrfEoc8_g' }

yts( opts, function ( err, video ) {
  console.log( video )
} )
```

###### Output ( video metadata )
```js
{ title: 'Superman Theme',
  description: 'The theme song from Superman: The Movie',
  url: 'https://www.youtube.com/watch?v=e9vrfEoc8_g',
  videoId: 'e9vrfEoc8_g',
  seconds: 253,
  timestamp: '4:13',
  duration:
   { toString: [Function: toString],
     seconds: 253,
     timestamp: '4:13' },
  views: 36200427,
  genre: 'music',
  uploadDate: '2009-07-27',
  ago: '10 years ago',
  thumbnail: 'https://i.ytimg.com/vi/e9vrfEoc8_g/default.jpg',
  image: 'https://i.ytimg.com/vi/e9vrfEoc8_g/hqdefault.jpg',
  author:
   { name: 'Super Man',
     id: 'Redmario2569',
     url: 'https://youtube.com/user/Redmario2569',
     userId: 'Redmario2569',
     userName: 'Super Man',
     userUrl: 'https://youtube.com/user/Redmario2569',
     channelId: 'UCARqIOgzDc-UUAREIitbBwA',
     channelName: 'Super Man',
     channelUrl: 'https://youtube.com/channel/UCARqIOgzDc-UUAREIitbBwA' } }
```

###### Playlist metadata by id
```js
const yts = require( 'yt-search' )

const opts = { listId: 'PL7k0JFoxwvTbKL8kjGI_CaV31QxCGf1vJ' }

yts( opts, function ( err, video ) {
  console.log( video )
} )
```

###### Output ( playlist metadata )
```js
{ title: 'Superman Themes',
  listId: 'PL7k0JFoxwvTbKL8kjGI_CaV31QxCGf1vJ',
  url:
   'https://www.youtube.com/playlist?hl=en&list=PL7k0JFoxwvTbKL8kjGI_CaV31QxCGf1vJ',
  videoCount: 10,
  views: 336,
  lastUpdate: '2018-5-24',
  thumbnail: 'https://i.ytimg.com/vi/IQtKjU_pOuw/hqdefault.jpg',
  items:
   [ { title: 'The Max Fleischer Cartoon (From "Superman")',
       videoId: 'IQtKjU_pOuw',
       listId: 'PL7k0JFoxwvTbKL8kjGI_CaV31QxCGf1vJ',
       url:
        'https://youtube.com/watch?v=IQtKjU_pOuw&list=PL7k0JFoxwvTbKL8kjGI_CaV31QxCGf1vJ',
       thumbnailUrl: 'https://i.ytimg.com/vi/IQtKjU_pOuw/default.jpg',
       thumbnailUrlHQ: 'https://i.ytimg.com/vi/IQtKjU_pOuw/hqdefault.jpg',
       owner: 'Sammy Timberg - Topic',
       author: [Object] },
     { title: '[Deleted video]',
       videoId: 'g1PjuAq-ua0',
       listId: 'PL7k0JFoxwvTbKL8kjGI_CaV31QxCGf1vJ',
       url:
        'https://youtube.com/watch?v=g1PjuAq-ua0&list=PL7k0JFoxwvTbKL8kjGI_CaV31QxCGf1vJ',
       thumbnailUrl: 'https://i.ytimg.com/vi/g1PjuAq-ua0/default.jpg',
       thumbnailUrlHQ: 'https://i.ytimg.com/vi/g1PjuAq-ua0/hqdefault.jpg',
       owner: undefined,
       author: {} },
     { title: 'Superman Theme',
       videoId: 'e9vrfEoc8_g',
       listId: 'PL7k0JFoxwvTbKL8kjGI_CaV31QxCGf1vJ',
       url:
        'https://youtube.com/watch?v=e9vrfEoc8_g&list=PL7k0JFoxwvTbKL8kjGI_CaV31QxCGf1vJ',
       thumbnailUrl: 'https://i.ytimg.com/vi/e9vrfEoc8_g/default.jpg',
       thumbnailUrlHQ: 'https://i.ytimg.com/vi/e9vrfEoc8_g/hqdefault.jpg',
       owner: 'Super Man',
       author: [Object] },
     { title: '[Private video]',
       videoId: 'Br_8B1exfm8',
       listId: 'PL7k0JFoxwvTbKL8kjGI_CaV31QxCGf1vJ',
       url:
        'https://youtube.com/watch?v=Br_8B1exfm8&list=PL7k0JFoxwvTbKL8kjGI_CaV31QxCGf1vJ',
       thumbnailUrl: 'https://i.ytimg.com/vi/Br_8B1exfm8/default.jpg',
       thumbnailUrlHQ: 'https://i.ytimg.com/vi/Br_8B1exfm8/hqdefault.jpg',
       owner: undefined,
       author: {} },
     { title: 'Superman The Animated Series Full Theme',
       videoId: 'FHpOVBEXCxM',
       listId: 'PL7k0JFoxwvTbKL8kjGI_CaV31QxCGf1vJ',
       url:
        'https://youtube.com/watch?v=FHpOVBEXCxM&list=PL7k0JFoxwvTbKL8kjGI_CaV31QxCGf1vJ',
       thumbnailUrl: 'https://i.ytimg.com/vi/FHpOVBEXCxM/default.jpg',
       thumbnailUrlHQ: 'https://i.ytimg.com/vi/FHpOVBEXCxM/hqdefault.jpg',
       owner: 'Meta Man',
       author: [Object] },
     { title: 'Smallville theme song',
       videoId: 'uzlyGxDx8Ck',
       listId: 'PL7k0JFoxwvTbKL8kjGI_CaV31QxCGf1vJ',
       url:
        'https://youtube.com/watch?v=uzlyGxDx8Ck&list=PL7k0JFoxwvTbKL8kjGI_CaV31QxCGf1vJ',
       thumbnailUrl: 'https://i.ytimg.com/vi/uzlyGxDx8Ck/default.jpg',
       thumbnailUrlHQ: 'https://i.ytimg.com/vi/uzlyGxDx8Ck/hqdefault.jpg',
       owner: 'WilliamOst26',
       author: [Object] },
     { title: 'Reprise / Fly Away',
       videoId: 'szCj7nsC_Zw',
       listId: 'PL7k0JFoxwvTbKL8kjGI_CaV31QxCGf1vJ',
       url:
        'https://youtube.com/watch?v=szCj7nsC_Zw&list=PL7k0JFoxwvTbKL8kjGI_CaV31QxCGf1vJ',
       thumbnailUrl: 'https://i.ytimg.com/vi/szCj7nsC_Zw/default.jpg',
       thumbnailUrlHQ: 'https://i.ytimg.com/vi/szCj7nsC_Zw/hqdefault.jpg',
       owner: 'John Ottman - Topic',
       author: [Object] },
     { title: 'Superman Doomsday Soundtrack- Main Title',
       videoId: '2HrFrAspWF8',
       listId: 'PL7k0JFoxwvTbKL8kjGI_CaV31QxCGf1vJ',
       url:
        'https://youtube.com/watch?v=2HrFrAspWF8&list=PL7k0JFoxwvTbKL8kjGI_CaV31QxCGf1vJ',
       thumbnailUrl: 'https://i.ytimg.com/vi/2HrFrAspWF8/default.jpg',
       thumbnailUrlHQ: 'https://i.ytimg.com/vi/2HrFrAspWF8/hqdefault.jpg',
       owner: 'oved5555',
       author: [Object] },
     { title: 'Hans Zimmer - Man of Steel Theme',
       videoId: 'EngKxF3Cqh4',
       listId: 'PL7k0JFoxwvTbKL8kjGI_CaV31QxCGf1vJ',
       url:
        'https://youtube.com/watch?v=EngKxF3Cqh4&list=PL7k0JFoxwvTbKL8kjGI_CaV31QxCGf1vJ',
       thumbnailUrl: 'https://i.ytimg.com/vi/EngKxF3Cqh4/default.jpg',
       thumbnailUrlHQ: 'https://i.ytimg.com/vi/EngKxF3Cqh4/hqdefault.jpg',
       owner: 'Camw1n',
       author: [Object] },
     { title: 'Supergirl CW Soundtrack - Superman Theme Extended',
       videoId: 'ACeO5Yf1r9w',
       listId: 'PL7k0JFoxwvTbKL8kjGI_CaV31QxCGf1vJ',
       url:
        'https://youtube.com/watch?v=ACeO5Yf1r9w&list=PL7k0JFoxwvTbKL8kjGI_CaV31QxCGf1vJ',
       thumbnailUrl: 'https://i.ytimg.com/vi/ACeO5Yf1r9w/default.jpg',
       thumbnailUrlHQ: 'https://i.ytimg.com/vi/ACeO5Yf1r9w/hqdefault.jpg',
       owner: 'Flash Music',
       author: [Object] } ],
  author:
   { name: 'Cave Spider10',
     id: 'UCdwR7fIE2xyXlNRc7fb9tJg',
     url: 'https://youtube.com/channel/UCdwR7fIE2xyXlNRc7fb9tJg',
     channelId: 'UCdwR7fIE2xyXlNRc7fb9tJg',
     channelUrl: 'https://youtube.com/channel/UCdwR7fIE2xyXlNRc7fb9tJg',
     channelUrlText: 'Cave Spider10',
     userId: '',
     userUrl: '',
     userUrlText: '' } }
```

