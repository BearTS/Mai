const booru = require('../booru')

module.exports = class extends booru {
  /**
   * `posts#index` or `posts#show`
   *
   * Get a list of posts or a single post
   *
   * @param {Object | *} [paramsOrId] Listing params or show id
   * @returns {Promise} Resolves to a data array or object
   */
  posts(paramsOrId = {}) {
    if (new Object(paramsOrId) === paramsOrId)
      return this.get('/posts', paramsOrId)
    return this.get(`/posts/${paramsOrId}`)
  }

  /**
   * `posts#update`
   *
   * Update a post's data
   *
   * @param {*} id Post id
   * @param {Object} post Post params
   * @returns {Promise} Resolves to server response
   */
  posts_update(id, post) {
    return this.put(`/posts/${id}`, { post })
  }

  /**
   * `posts#revert`
   *
   * Revert a post to a previous version
   *
   * @param {*} id Post id
   * @param {*} version_id Version id
   * @returns {Promise} Resolves to server response
   */
  posts_revert(id, version_id) {
    return this.put(`/posts/${id}/revert`, { version_id })
  }

  /**
   * `posts#copy_notes`
   *
   * @param {*} id Post id
   * @param {*} other_post_id Other post id
   * @returns {Promise} Resolves to server response
   */
  posts_copyNotes(id, other_post_id) {
    return this.put(`/posts/${id}/copy_notes`, { other_post_id })
  }

  /**
   * `posts#mark_as_translated`
   *
   * @param {*} id Post id
   * @param {Object} post Translation information
   * @returns {Promise} Resolves to server response
   */
  posts_markAsTranslated(id, post) {
    return this.put(`/posts/${id}/mark_as_translated`, { post })
  }
}
