const EventEmitter = require("events").EventEmitter;
const https = require("https");
const http = require("http");

/**
 * An EventEmitter to get a Treehouse students profile.
 * @param username
 * @constructor
 */
class Profile extends EventEmitter {
    constructor() {
        super();
    }

    get(username) {
        let _this = this;
        //Connect to the API URL (https://teamtreehouse.com/username.json)
        let request = https.get("https://teamtreehouse.com/" + username + ".json", response => {
            let body = "";

            if (response.statusCode !== 200) {
                request.abort();
                //Status Code Error
                _this.emit(
                    "error",
                    new Error("There was an error getting the profile for " + username + ". (" + http.STATUS_CODES[response.statusCode] + ")"));
            }

            //Read the data
            response.on('data', chunk => {
                body += chunk;
                _this.emit("data", chunk);
            });

            response
                .on('end', () => {
                    if (response.statusCode === 200) {
                        try {
                            //Parse the data
                            let profile = JSON.parse(body);
                            _this.emit("end", profile);
                        } catch (error) {
                            _this.emit("error", error);
                        }
                    }
                })
                .on("error", error => {
                    _this.emit("error", error);
                });
        });
    }
}

module.exports = Profile;