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

var querystring = require('querystring');
var https = require('https');
var prompt = require('prompt');
var fs = require('fs');
var ArgumentParser = require('argparse').ArgumentParser;

//var ApacheJiraFetch = require('./apachejirafetch.js');

var parser = new ArgumentParser({
    version: '0.0.1',
    addHelp: true
});

parser.addArgument(['-s', '--safemode'],{action:'storeTrue',help: "print post fields and data, but no request is sent"});

var subparsers = parser.addSubparsers({
  title:'subcommands',
});

// Fetch mode parser
var baragonFetchParser = subparsers.addParser("fetch",{addHelp:true});
baragonFetchParser.addArgument(['-s', '--safemode'],{action: 'storeTrue',help: "print post fields and data, but no request is sent"});
baragonFetchParser.addArgument(['-i', '--issueid'], {type: 'string', action: 'store', help: "specify the issue to fetch by Jira Issue ID, required",required: true});

// Create mode parser 
var baragonCreateParser = subparsers.addParser("create",{addHelp:true});
baragonCreateParser.addArgument(['-s', '--safemode'],{action: 'storeTrue', help: "print post fields and data, but no request is sent"});
baragonCreateParser.addArgument(['--jsonfile'],{type: 'string', action: 'store', help: "file containing a properly formated json string containing the data to create the issue from"});

// Modify mode parser
var baragonModParser = subparsers.addParser("mod",{addHelp:true});
baragonModParser.addArgument(['-s', '--safemode'],{action: 'storeTrue', help: "print post fields and data, but no request is sent"});
baragonModParser.addArgument(['-i', '--issueid'],{type: 'string', action: 'store', help: "specify the issue to modify by Jira Issue ID, required",required: true});

var sessionOptions = parser.parseArgs();
console.log(sessionOptions);
// targeting Apache Cordova
var PresetPostFields = {
    'pid' : '12312420',
    'issuetype' : 2,
    'security' : -1
};

var HtmlRequestDefaultOptions = {
    'host' : "issues.apache.org", 
    'path' : "/jira/rest/api/latest/issue",
    'method' : -1, // stub, autofails, needs to be updated by the specific request handler (fetch, mod, create)
    'X-Atlassian-Token': 'no-check', 
    'headers': {
        // needs authentication header added before send
        'Content-Type' : "application/json"
    }
}

var JiraRestTemplate = {
    "fields" : {
        "project" : {
            "id" : -1 //target 
        },
        "issuetype" : {
            "name" : "Bug"
        }
    }
}

//  get apache jira password and username 
var AuthPromptSchema = {
    properties : {
        name : {
            required : true
        },
        password : {
            required : true,
            hidden : true
        }
    }
}

// get jira authentication
prompt.start();
prompt.get(AuthPromptSchema, function (err, result) {
    // to be sent over https
    var auth = 'Basic ' + new Buffer(result.name + ':' + result.password).toString('base64');
    HtmlRequestDefaultOptions.headers.Authorization = auth;
    rock (HtmlRequestDefaultOptions); // main 
});

/**
 * sees everything
 */
function rock(requestOptions) {
    // read issue fields out of data file 
    data = readJsonData(sessionOptions.jsonfile);
    // create RESTful object from data and presets
    var reststring = JSON.stringify(createIssueRestfulObject('12312420', data),'utf8');

    if (!sessionOptions.safemode) {
        console.log('Unsafe Mode');
        req = createRequest(requestOptions);
        req.write(reststring);
        req.end();
    } else {
        console.log(requestOptions);
        console.log(reststring);
    }
}

/**
 *  
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

/**
 * creates issue query string from presets and dynamic data 
 */
function createIssueQueryString(data) { 
    for (var key in PresetPostFields) {
        data[key] = PresetPostFields[key];
    }
    return querystring.stringify(data);
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

/**
 * creates a request and sets error callback
 */
function createRequest(options) {
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
    return req
}
