'use strict';

class BaseProfile {
    constructor(client, handler){
        Object.defineProperty(this, '_client', { value: client });

        Object.defineProperty(this, '_handler', { value: handler });
    }

    get client(){
        return this._client;
    };
};


module.exports = BaseProfile;
