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
var prompt = require('prompt'); 

var config = require('../config');
var project = require('../projects/apache.config');
var common = require('./baragon-common');

var BaragonCreateMethod = "POST";
var BaragonCreatePathOffset = "/issue/";

var BaragonCreateOptions = ["summary","description"];

/**
 *
 */
module.exports = function (options) {
    var data = {},
        reststring = null,
        req = null,
        localconfig = null;


    if (options.interactive) { 
        while(true) {

        }
    }
    // clone the config template and add local values
    localconfig = common.clone(config.targetHost);
    localconfig.method = BaragonCreateMethod; // set to modules http request method
    localconfig.path = localconfig.path + BaragonCreatePathOffset; // set path as per jira REST api
    // add the authentication header
    localconfig.headers["Authorization"] = options.auth; 

    // pull issue data out of options
    data = composeData(options);
 
    reststring = JSON.stringify(createIssueRestfulObject(data),'utf8');

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

/**
 * attempt to read data from input sources
 * sources are
 *  json string supplied on command line
 *  json data file
 *  cli options
 */
function composeData(options) {
    var data = {};

    // check for json data file
    if (options.jsonfile) {
        try {
            common.copyByKey(require(options.jsonfile),data);
        } catch (e) {
            console.log("Error: there was a problem parsing json data file: "+options.jsonfile);
            console.log("Error Message: "+e.message);
        }
    }

    // check for json data supplied as a string
    if (options.data) {
        try {
            common.copyByKey(JSON.parse(options.data), data);
        } catch (e) {
            console.log("Error: there was a problem parsing the data string: "+options.data);
            console.log("Error Message: "+e.message);
        }
    }
    // lastly, check for individually specified fields from the command line options
    for (var i = 0; i < BaragonCreateOptions.length; i=i+1) {
        if (options[BaragonCreateOptions[i]]) {
            data[BaragonCreateOptions[i]] = options[BaragonCreateOptions[i]];
        }
    }
    return data;
}


/**
 * create restful object representing a new jira issue
 */
function createIssueRestfulObject(data) {
    var robj = {};
    robj.fields = {};
    robj.fields.project = {'key' : project.projectKey };

    // copy in default values
    common.copyByKey(project.defaults, robj.fields);
    // copy in supplied values
    common.copyByKey(data, robj.fields);

    return robj;
}
