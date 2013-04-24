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
//var common = require('baragon-common');
/**
 *
 */
module.exports = function (options) {
    var data = {},
        reststring = null,
        req = null;
    
    // create RESTful object from data and presets
    reststring = JSON.stringify(createIssueRestfulObject('12312420', data),'utf8');

    // 
    if (!options.safemode) {
        console.log('Unsafe Mode');
        req = common.createRequest(requestOptions);
        req.write(reststring);
        req.end();
    } else {
        console.log(config);
        console.log(reststring);
    }
}

/**
 * create restful object representing a new jira issue
 */
function createIssueRestfulObject(pid, data) {
    var robj = {};
    robj.fields = {};
    robj.fields.project = {'id':pid};
    robj.fields.issuetype = {'name' : "Bug"};
    for (var key in data) {
        robj.fields[key] = data[key]
    }
    return robj;
}
