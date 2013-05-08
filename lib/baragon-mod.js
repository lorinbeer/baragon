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

var config = require('../config');
var common = require('./baragon-common');

var BaragonModMethod = 'POST';
//var BaragonModPathOffset = "/issue/CB-2792/transitions?expand=transitions.fields";
var BaragonModPathOffset = "/issue/CB-2792/transitions";


module.exports = function (options) {
    var data = {},
        reststring = null,
        req = null;

    // clone the config template and add local values
    localconfig = common.clone(config.targetHost);
    localconfig.method = BaragonModMethod; // set to modules http request method
    localconfig.path = localconfig.path + BaragonModPathOffset; // set path as per jira REST api
    // add the authentication header
    localconfig.headers["Authorization"] = options.auth;

    reststring = createRestfulData(options);
    //
    if (!options.safemode) {
        console.log('Unsafe Mode');
        req = common.createRequest(localconfig);
        req.write(reststring);
        req.end();
    } else {
        console.log(localconfig);
        console.log(reststring);
    }
}

function createRestfulData(options) {
    var restdata = {};
    if (options.message) {
        restdata.update = {"comment": { "add": { "body" : "" } } };
        restdata.update.comment.add.body = options.message.toString();
    }
    restdata.transition = {"id" : options.transition};
    return JSON.stringify(restdata, 'utf8');
}
