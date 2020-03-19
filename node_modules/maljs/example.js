const mal = require('./index');

mal.getTopAnime().then(function(list) {
    list[1].fetch().then(function(e) {
        e.characters[0].fetch().then(function(c) {
            console.log(c);
        })
    }).catch(function(err) {
        console.error(err);
    });
}).catch(function(err) {
    console.error(err);
})

mal.quickSearch('lelouch').then(function(results) {
    results.character[0].fetch().then(function(r) {
        r.animeography[0].fetch().then(function(r) {
            console.log(r);
        })
    });
});

mal.getById('anime', 21).fetch().then(function(e) {
    console.log(e);
});


mal.getCharacterById(1111).fetch().then(function(e) {
    console.log(e);
});