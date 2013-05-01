/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var fs = require('fs');
var https = require('https');

module.exports.createRequest = function (options) {
    var req = https.request(options, function(res) {
        res.setEncoding('utf8');
        console.log("Status Code: " + res.statusCode);
        console.log("Response Header: " + JSON.stringify(res.headers));
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
        });
    });

    req.on('error', function(e) {
        console.log('fuckup: ' + e.message);
    });
    return req;
}

/**
 * quick and dirty object clone
 */
module.exports.clone = function (obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 *
 */
module.exports.copyByKey = function (source, dest) {
    for (var key in source) {
        dest[key] = source[key];
    }
}

/**
 * expects valid file path, with file containing nothing but a valid json string
 */
function readJsonData(fileuri) {
    var jsondata;
    try {
        var data = fs.readFileSync(fileuri, 'utf8', 'r');
        return JSON.parse(data);
    } catch (e) {
        console.log(e);
    }
}

