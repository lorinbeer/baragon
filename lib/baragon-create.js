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

var https = require('https');

var config = require('../config');
var project = require('../projects/apache.config');
var common = require('./baragon-common');

var BaragonCreateMethod = "POST";
var BaragonCreatePathOffset = "/issue/";
/**
 *
 */
module.exports = function (options) {
    var data = {},
        reststring = null,
        req = null;

    // clone the config template and add local values
    localconfig = common.clone(config.targetHost);
    localconfig.method = BaragonCreateMethod; // set to modules http request method
    localconfig.path = targetHost.path + BaragonCreatePathOffset; // set path as per jira REST api
    // add the authentication header
    localconfig.headers['Authentication'] = options.auth; 
    
    reststring = JSON.stringify(createIssueRestfulObject({}),'utf8');

    // 
    if (!options.safemode) {
        console.log('Unsafe Mode');
        req = common.createRequest(targetHost);
        req.write(reststring);
        req.end();
    } else {
        console.log(targetHost);
        console.log(reststring);
    }
}

/**
 * 
 */
function composeData(options) {

}


/**
 * create restful object representing a new jira issue
 */
function createIssueRestfulObject(data) {
    var robj = {};
    robj.fields = {};
    robj.fields.project = {'key' : project.projectKey};

    // copy in default values
    for (var key in project.defaults) {
        robj.fields[key] = project.defaults[key];
    }

    // copy in supplied values
    for (var key in data) {
        robj.fields[key] = data[key]
    }
    console.log(robj);
    return robj;
}
