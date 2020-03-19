const booru = require('../booru')

module.exports = class extends booru {
  /**
   * `favorites#index`
   *
   * List favorites
   *
   * @param {Object} params Listing params
   * @returns {Promise} Resolves to server response
   */
  favorites(params = {}) {
    return this.get('favorites', params)
  }

  /**
   * `favorites#create`
   *
   * Add a post as a favorite
   *
   * @param {*} post_id Post id to favorite
   * @returns {Promise} Resolves to server response
   */
  favorites_create(post_id) {
    return this.post('favorites', { post_id })
  }

  /**
   * `favorites#destroy`
   *
   * Remove a post from favorites
   *
   * @param {*} id Post id to delete favorite
   * @returns {Promise} Resolves to server response
   */
  favorites_destroy(id) {
    return this.delete(`favorites/${id}`)
  }
}
