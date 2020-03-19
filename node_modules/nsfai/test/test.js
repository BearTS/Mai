// dataParser & testMIMEType test script for use with Mocha

var expect = require("chai").expect;

var dataParser = require("../lib/dataparser");
var testMIMEType = require("../lib/mimetype");

describe("dataParser", function() {
    it("should process a Base64 Data URL", function() {
        var testBase64 = "aGVsbG8hIHRoYW5rcyBmb3IgcHV0dGluZyBpbiBlZmZvcnQgdG8gZGVjb2RpbmcgdGhpcywgYnV0IHlvdSdyZSB3YXN0aW5nIHRpbWUuLi4gZ290dGEgYmUgcHJvZHVjdGl2ZSEgOikgOykgKGFsc28gSSBrbm93IHRoaXMgaXMgbm90IGEgcmVhbCBpbWFnZSwgSSBkaWRuJ3QgbWVhbiBpdCB0byBiZSBvbmUuKQ==";
        var dataURL = `data:image/png;base64,${testBase64}`;

        var testFunct = function() { return dataParser(dataURL); };
        expect(testFunct).to.not.throw(Error);

        var testResult = testFunct();
        expect(testResult).to.be.an("Object").and.to.haveOwnProperty("base64", testBase64);
    });

    it("should filter non-supported Base64 Data URLs", function() {
        var testBase64 = "aGVsbG8hIHRoYW5rcyBmb3IgcHV0dGluZyBpbiBlZmZvcnQgdG8gZGVjb2RpbmcgdGhpcywgYnV0IHlvdSdyZSB3YXN0aW5nIHRpbWUuLi4gZ290dGEgYmUgcHJvZHVjdGl2ZSEgOikgOykgKGFsc28gSSBrbm93IHRoaXMgaXMgbm90IGEgcmVhbCBpbWFnZSwgSSBkaWRuJ3QgbWVhbiBpdCB0byBiZSBvbmUuKQ==";
        var dataURL = `data:text/html;base64,${testBase64}`;

        var testFunct = function() { return dataParser(dataURL); };
        expect(testFunct).to.throw(TypeError);
    });

    it("should detect video Base64 Data URLs", function() {
        var testBase64 = "aGVsbG8hIHRoYW5rcyBmb3IgcHV0dGluZyBpbiBlZmZvcnQgdG8gZGVjb2RpbmcgdGhpcywgYnV0IHlvdSdyZSB3YXN0aW5nIHRpbWUuLi4gZ290dGEgYmUgcHJvZHVjdGl2ZSEgOikgOykgKGFsc28gSSBrbm93IHRoaXMgaXMgbm90IGEgcmVhbCBpbWFnZSwgSSBkaWRuJ3QgbWVhbiBpdCB0byBiZSBvbmUuKQ==";
        var dataURL = `data:video/mp4;base64,${testBase64}`;

        var testFunct = function() { return dataParser(dataURL); };
        expect(testFunct).to.not.throw(Error);

        var testResult = testFunct();
        expect(testResult).to.be.an("Object").and.to.haveOwnProperty("video", true);

        testBase64 = "aGVsbG8hIHRoYW5rcyBmb3IgcHV0dGluZyBpbiBlZmZvcnQgdG8gZGVjb2RpbmcgdGhpcywgYnV0IHlvdSdyZSB3YXN0aW5nIHRpbWUuLi4gZ290dGEgYmUgcHJvZHVjdGl2ZSEgOikgOykgKGFsc28gSSBrbm93IHRoaXMgaXMgbm90IGEgcmVhbCBpbWFnZSwgSSBkaWRuJ3QgbWVhbiBpdCB0byBiZSBvbmUuKQ==";
        dataURL = `data:image/png;base64,${testBase64}`;

        testFunct = function() { return dataParser(dataURL); };
        expect(testFunct).to.not.throw(Error);

        testResult = testFunct();
        expect(testResult).to.be.an("Object").and.to.haveOwnProperty("video", false);
    });

    it("should process Base64", function() {
        var testBase64 = "aGVsbG8hIHRoYW5rcyBmb3IgcHV0dGluZyBpbiBlZmZvcnQgdG8gZGVjb2RpbmcgdGhpcywgYnV0IHlvdSdyZSB3YXN0aW5nIHRpbWUuLi4gZ290dGEgYmUgcHJvZHVjdGl2ZSEgOikgOykgKGFsc28gSSBrbm93IHRoaXMgaXMgbm90IGEgcmVhbCBpbWFnZSwgSSBkaWRuJ3QgbWVhbiBpdCB0byBiZSBvbmUuKQ==";

        var testFunct = function() { return dataParser(testBase64); };
        expect(testFunct).to.not.throw(Error);

        var testResult = testFunct();
        expect(testResult).to.be.an("Object").and.to.haveOwnProperty("base64", testBase64);
    });

    it("should process URLs", function() {
        var testURL = "https://example.com/logo.png";

        var testFunct = function() { return dataParser(testURL); };
        expect(testFunct).to.not.throw(Error);

        var testResult = testFunct();
        expect(testResult).to.equal(testURL);
    });

    it("shouldn\'t accept nonsensical data", function() {
        var testData = "'+!'+!'+!'+!'?:'+?'!+'!+'??gdfgdfgdsfGDFgdsgdsf7576sw5fs";

        var testFunct = function() { return dataParser(testData); };
        expect(testFunct).to.throw(TypeError);
    });
});

describe("testMIMEType", function() {
    it("should filter disallowed MIME types", function() {
        expect(testMIMEType("text/html")).to.equal(false);
    });
    it("should pass allowed MIME types", function() {
        expect(testMIMEType("image/png")).to.equal(true);
        expect(testMIMEType("image/jpeg")).to.equal(true);
        expect(testMIMEType("image/tiff")).to.equal(true);
        expect(testMIMEType("image/webp")).to.equal(true);
        expect(testMIMEType("image/gif")).to.equal(true);
        expect(testMIMEType("video/mp4")).to.equal(true);
        expect(testMIMEType("video/x-matroska")).to.equal(true);
        expect(testMIMEType("video/x-msvideo")).to.equal(true);
        expect(testMIMEType("video/quicktime")).to.equal(true);
    });
});
