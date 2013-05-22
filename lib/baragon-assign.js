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
var prompt = require('prompt');

var BaragonAssignMethod = 'PUT';
var BaragonAssignPathOffset = "/assignee";

var issuePromptSchema = {
    properties : {
        issueid : {
            required : true
        }
}}

module.exports = function (options) {
    var data = {},
        reststring = null,
        req = null;
    prompt.start();
    if (options.interactive) {
        prompt.start()
        prompt.get(issuePromptSchema, function (err, result) {
        localconfig = common.clone(config.targetHost);
        localconfig.method = BaragonAssignMethod; // set to modules http request method
        localconfig.path = localconfig.path + "/issue/" + result.issueid + "/assignee"; 
        reststring = JSON.stringify({"name":options.userid}, 'utf8');

        if (!options.safemode) {
            console.log('Unsafe Mode');
            req = common.createRequest(localconfig);
            req.write(reststring);
            req.end();
        } else {
            console.log(localconfig);
            console.log(reststring);
        }
        });
    }
/*
    // clone the config template and add local values
    localconfig = common.clone(config.targetHost);
    localconfig.method = BaragonModMethod; // set to modules http request method
    localconfig.path = localconfig.path + BaragonModPathOffset; // set path as per jira REST api
    // add the authentication header
    localconfig.headers["Authorization"] = options.auth;

    reststring = createRestfulData(options);



    if (!options.safemode) {
        console.log('Unsafe Mode');
        req = common.createRequest(localconfig);
        req.write(reststring);
        req.end();
    } else {
        console.log(localconfig);
        console.log(reststring);
    } 
*/
}
