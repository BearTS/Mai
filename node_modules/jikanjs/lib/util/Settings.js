
class Settings {

    constructor(baseURL = 'https://api.jikan.moe', version = 3) {
        this.setBaseURL(baseURL, version);
    }

    /**
     * Delivers the full API Base URL
     * @returns {URL}
     */
    getBaseURL() {
        return this.baseURL;
    }

    /**
     * can be used to replace the current API Base URL by a complete new one
     * @param {string} baseURL
     * @param {number} [version]
     */
    setBaseURL(baseURL, version) {
        if(version) this.v = version;
        this.baseURL = new URL(`/v${this.v}`, baseURL);
    }

    /**
     * can be used to change the API version
     * @param {number} version
     */
    set version(version) {
        this.v = version;
        this.baseURL.pathname = `/v${version}`;
    }

    /**
     * delivers the currently used API version
     * @returns {number}
     */
    get version() {
        return this.v;
    }
}

module.exports = new Settings();
