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

// jira api path to send request
var fetchPath = "/search";
var fetchMethod = "GET";

module.exports = function (options) {
    var data = {},
        reststring = null,
        req = null,

    // clone the config template
    localconfig = common.clone(config.targetHost);
    // complete the path
    localconfig.path = localconfig.path + fetchPath;
    // add the request method
    localconfig.method = fetchMethod;
    // add the authentication header
    localconfig.headers['Authentication'] = options.auth;

    reststring = JSON.stringify(fetchIssueRestfulObject("12312420"));
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
function composeJQL(params) {

}
function fetchIssueRestfulObject(pid, data) {
//'{"jql":"project = QA","startAt":0,"maxResults":2,"fields":["id","key"]}'
    var robj = {};
    robj.jql = "project = CB";
    for (var key in data) {
        robj[key] = data[key]
    }
    return robj;
}
