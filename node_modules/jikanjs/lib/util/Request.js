//@ts-check

const Settings = require('./Settings');
const fetch = require('cross-fetch');

class Request {

    /**
     * sends a request with the given list of URL parts and the optional list of query parameter
     * @param {*[]} args           URL Parts
     * @param {{}} [parameter]     Query Parameter
     * @returns {Promise<*>} returns the request response or an error
     */
    async send(args, parameter) {
        var response = await fetch(this.urlBuilder(args, parameter));
        var data = await response.json();

        if (response.status !== 200) return Promise.reject(new Error(data.error));
        return Promise.resolve(data);
    }

    /**
     *
     * @param {*[]} args            URL Parts
     * @param {{}} [parameter]      Query Parameter
     * @returns {string}            URL
     */
    urlBuilder(args, parameter) {
        var url = new URL(Settings.getBaseURL());

        url.pathname += '/' + args.filter(x => x).join('/');
        if (parameter) Object.entries(parameter).forEach(([key, value]) => url.searchParams.append(key, value));

        return url.href;
    }
}

module.exports = Request;
