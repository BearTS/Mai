var { URL } = require("url");
var testMIMEType = require("./mimetype");

/**
 * Checks if data is a URL.
 * @param {string} data The data to test
 * @returns {boolean} Whether data is a URL or not.
 */
function testURL(data) {
    try {
        var myURLObject = new URL(data);
        return true;
    } catch (e) {
        if (e.code !== "ERR_INVALID_URL") { // The error is not related to an invalid URL
            throw e;
        }
        return false;
    }
}

/**
 * Checks if data is Base64.
 * @param {string} data The data to test
 * @returns {boolean} Whether data is Base64 or not.
 */
function testBase64(data) {
    if (data.match(/^[A-Za-z0-9+\/=]+$/)) {
        return true;
    } else {
        return false;
    }
}

/**
 * Checks if data is a Data URL.
 * @param {string} data The data to test
 * @returns {boolean} Whether data is a Data URL or not.
 */
function testDataURL(data) {
    var regex = /^data:(.+)\/(.+);base64,(.*)$/;
    var matches = data.match(regex);
    if (matches) {
        if (testMIMEType(`${matches[1]}/${matches[2]}`)) {
            return true;
        } else {
            throw new TypeError("Invalid data type.");
        }
    } else {
        return false;
    }
}

/**
 * Extracts Base64 from a Data URL.
 * @param {string} data The Data URL to extract Base64 from
 * @returns {string} The Base64 data.
 */
function dataURLToBase64(data) {
    var regex = /^data:(.+)\/(.+);base64,(.*)$/;
    var matches = data.match(regex);
    if (matches) {
        return matches[3];
    }
}

/**
 * Extracts MIME Type from a Data URL.
 * @param {string} data The Data URL to extract MIME Type from
 * @returns {string} The MIME type.
 */
function dataURLToMIMEType(data) {
    var regex = /^data:(.+\/.+);base64,.*$/;
    var matches = data.match(regex);
    if (matches) {
        return matches[1];
    }
}

/**
 * Parse your data into a Clarifai-friendly object or string.
 * @param {string} _data Your URL/Data URL/Base64 string
 * @returns {(string|Object)} Clarifai-friendly string/object
 */
function dataParser(_data) {
    var data = _data.trim();
    var isBase64String = false;
    var isURL = false;
    var isDataURL = false;

    // Base64 string test
    isBase64String = testBase64(data);

    // URL test
    isURL = testURL(data);

    // Data URL test
    isDataURL = testDataURL(data);

    if (isDataURL) {
        return {
            base64: dataURLToBase64(data),
            video: dataURLToMIMEType(data).trim().split("/")[0] === "video" || dataURLToMIMEType(data).trim() === "image/gif"
        };
    } else if (isURL) {
        return data;
    } else if (isBase64String) {
        return {
            base64: data
        };
    } else {
        throw new TypeError("Couldn't recognize data type.");
    }
}

module.exports = dataParser;
