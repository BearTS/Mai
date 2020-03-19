const { http, https, URL, btoa, fetch } = require('./requires.node')
const constants = require('./constants')
const util = require('./util')

const defaultUrl = Object.freeze(new URL('https://danbooru.donmai.us/'))

module.exports = class {
  /**
   * Create a new Danbooru API wrapper
   *
   * Optionally specify an alternate url or login details:
   * - `login:api_key`
   * - `http://safebooru.donmai.us`
   * - `https://login:api_key@sonohara.donmai.us`
   *
   * @param {string} [conn] Connection customization string
   */
  constructor(conn = false) {
    this.auth(conn)
  }

  /**
   * Look up current username while optionally changing connection details
   *
   * Note that changing urls does not log out. To log out, pass a falsy value
   * and ensure that this function returns undefined.
   *
   * @param {string | *} conn Connection string, like in constructor
   * @returns {string} Current username
   */
  auth(conn) {
    const store = storage(this)

    if (typeof conn !== 'undefined') {
      let username, password
      if (conn && /^https?:\/\//.test(conn)) {
        const url = new URL(conn)
        ;({ username, password } = url)
        Object.assign(url, {
          username: '',
          password: '',
          hash: '',
          search: '',
          pathname: (url.pathname || '').replace(/\/*$/, '/')
        })

        if (url.href !== store.url.href) {
          if (url.protocol === 'http:') store.module = http
          else store.module = https

          if (url.href !== defaultUrl.href) store.url = url
          else store.url = defaultUrl
        }
      } else {
        const match = /^(.*?):(.*)$/.exec(conn)
        if (match) [, username, password] = match
      }

      if (username && password) {
        // store.authorization = `Basic ${btoa(`${username}:${password}`)}`
        store.authParams = { login: username, api_key: password }
        store.username = username
      } else if (!conn) {
        // delete store.authorization
        delete store.authParams
        delete store.username
      }
    }

    return store.username
  }

  /**
   * Get base url, or resolve a path
   *
   * @param {URL | string} [path] Path to resolve
   * @returns {URL} Base url or resolved absolute url
   */
  url(path = '') {
    return new URL(path.toString().replace(/^\/*/, ''), storage(this).url)
  }

  /**
   * Perform a web request
   *
   * May use 'request' or 'fetch', indicated by the first element in array
   *
   * @param {Object} [options] Request options
   * @param {string} [options.method] HTTP request method
   * @param {string} [options.path] Path to be appended to base path
   * @param {Object} [options.headers] Request headers
   * @param {*} [options.body] Request body
   * @returns {Array} Function used, followed by return value
   */
  request(options = {}) {
    const { module } = storage(this)

    const { method, path, body } = options
    const url = this.url(path)

    let { headers = {} } = options

    if (module) {
      const request = module.request({
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port,
        method,
        path: url.pathname + url.search,
        headers
      })

      if (body) request.end(body)
      else request.end()

      return ['request', request]
    } else {
      return ['fetch', fetch(url.href, { method, headers, body })]
    }
  }

  /**
   * Perform a request and receive an object
   *
   * Only works with `application/json` data, and automatically appends `.json`
   * to paths.
   *
   * Rejects on connection errors and resolves data object or parsing error.
   * Returned objects have extra symbol key values:
   * * `Danbooru.status` Status code from server
   * * `Danbooru.data` Original string data
   * * `Danbooru.headers` Response headers
   *
   * @param {string} path Path to be appended to base path
   * @param {Object} [options] Request options
   * @param {string} [options.method] HTTP request method
   * @param {Object} [options.headers] Request headers
   * @param {Object | Array} [options.query] Data to be added to path
   * @param {Object | Array} [options.body] Data to be sent as request body
   * @returns {Promise} Resolves to a json object or a parsing error
   */
  json(path, options = {}) {
    return new Promise((resolve, reject) => {
      const { method } = options
      let { query, body } = options
      let { headers = {} } = options
      const { authParams } = storage(this)

      if (authParams) {
        if (query) {
          query = { ...authParams, ...query }
        } else if (!method || method === 'GET') {
          query = authParams
        } else if (body) {
          body = { ...authParams, ...body }
        } else {
          body = authParams
        }
      }

      const reqBody = body && JSON.stringify(body)
      if (reqBody) {
        headers = {
          ...headers,
          'content-type': 'application/json'
        }
      }

      const reqOptions = {
        method,
        headers,
        path: `${path}.json${util.queryString(query)}`,
        body: reqBody
      }

      const [reqType, reqValue] = this.request(reqOptions)

      switch (reqType) {
        case 'request':
          reqValue.on('error', reject).on('response', response => {
            let data = ''
            const { statusCode: status, headers } = response

            response
              .setEncoding('utf8')
              .on('data', chunk => (data += chunk))
              .on('end', () => resolve({ data, status, headers }))
          })

          break
        case 'fetch':
          reqValue
            .then(response => {
              const { status, headers } = response
              return response.text().then(data => ({ data, status, headers }))
            })
            .then(resolve, reject)

          break
      }
    }).then(response => {
      let data
      try {
        data = JSON.parse(response.data)
      } catch (error) {
        data = error
      }

      Object.assign(data, {
        [constants.status]: response.status,
        [constants.data]: response.data,
        [constants.headers]: response.headers
      })

      return data
    })
  }

  /**
   * Perform a json GET request
   *
   * @param {string} path Resource path
   * @param {Object | Array} [query] Query string data
   * @returns {Promise} Resolves to server response data
   */
  get(path, query) {
    return this.json(path, { query })
  }

  /**
   * Perform a json POST request
   *
   * @param {string} path Resource path
   * @param {Object | Array} [body] Request body data
   * @returns {Promise} Resolves to server response data
   */
  post(path, body) {
    return this.json(path, { method: 'POST', body })
  }

  /**
   * Perform a json PUT request
   *
   * @param {string} path Resource path
   * @param {Object | Array} [body] Request body data
   * @returns {Promise} Resolves to server response data
   */
  put(path, body) {
    return this.json(path, { method: 'PUT', body })
  }

  /**
   * Perform a json DELETE request
   *
   * @param {string} path Resource path
   * @param {Object | Array} [body] Request body data
   * @returns {Promise} Resolves to server response data
   */
  delete(path, body) {
    return this.json(path, { method: 'DELETE', body })
  }
}

function storage(key) {
  const map = storage.map || (storage.map = new WeakMap())
  if (map.has(key)) return map.get(key)

  const value = { url: defaultUrl, module: https }
  map.set(key, value)
  return value
}
