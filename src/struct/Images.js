const { join } = require('path');
const images   = require(join(__dirname, '../', 'assets/json/images.json'));
const mai      = require(join(__dirname, '../', 'assets/json/mai.json'   ));

module.exports = class ImageGenerator{
  constructor(){
    /**
		 * Array of action images imported from assets/json/images.json
		 * @type {action[]}
     * @private
     */
    this.__action = images;


    for (const action of Object.keys(this.__action)){
      this[action] = () => this._action(action);
    };

    /**
		 * Array of mai images imported from assets/json/mai.json
		 * @type {mai[]}
     * @private
     */
    this._mai = mai;

    /**
		 * The base url of these images
		 * @type {string}
     */
    this.base_url = 'https://i.imgur.com/'

    /**
		 * The ext name of these images
		 * @type {string}
     */
    this.ext = '.gif'
  };

  /**
  * Return an image url based on the provided action type
  * @param {type} imagetype The type of image to get a url from.
  * @returns {URL} An image url
  */
  _action(type){
    const index = Math.floor(Math.random() * this.__action[type].length);
    const code = this.__action[type][index] || null;
    return this.base_url + code + this.ext;
  };

  /**
  * Grab a `mai` image
  * @returns {URL} An image url
  */
  mai(r = {}){
    const type = r.nsfw && typeof r.nsfw === 'boolean' ? 'nsfw' : 'safe';
    const index = Math.floor(Math.random() * this._mai[type].length);

    return this._mai[type][index];
  };
};
