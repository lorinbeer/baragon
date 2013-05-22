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

var prompt = require('prompt');
var ArgumentParser = require('argparse').ArgumentParser;

var fetch = require('./lib/baragon-fetch.js');
var create = require('./lib/baragon-create.js');
var modify = require('./lib/baragon-mod.js');
var assign = require('./lib/baragon-assign.js');

// argument parser
var parser = new ArgumentParser({
    version: '0.0.1',
    addHelp: true
});

// parse global safemode flag, will apply to any subparser
parser.addArgument(['-s', '--safemode'],{action:'storeTrue',help: "print post fields and data, but no request is sent"});

// subparsers
var subparsers = parser.addSubparsers({
  title:'subcommands',
});

// Fetch mode parser
var baragonFetchParser = subparsers.addParser("fetch",{addHelp:true});
baragonFetchParser.addArgument(['-s', '--safemode'],{action: 'storeTrue',help: "print post fields and data, but no request is sent"});
baragonFetchParser.addArgument(['-a', '--assignee'], {type: 'string', action: 'store', help: "user name, fetch issues assigned to user=assignee"});
baragonFetchParser.addArgument(['-k', '--issueKey'], {type: 'string', action: 'store', help: "retriev issue with the given key eg 'CB-2187'"});
baragonFetchParser.addArgument(['-m', '--maxResults'], {type: 'int', action: 'store', help: "maximum number of issues to fetch"});
baragonFetchParser.setDefaults({'handler':fetch});

// Create mode parser 
var baragonCreateParser = subparsers.addParser("create",{addHelp:true});
baragonCreateParser.addArgument(['-s', '--safemode'],{action: 'storeTrue', help: "print post fields and data, but no request is sent"});
baragonCreateParser.addArgument(['-i', '--interactive'],{action: 'storeTrue', help: "begins an interactive prompt for submitting issues, issue data specified with other flags will be used as defaults"});
baragonCreateParser.addArgument(['--jsonfile'],{type: 'string', action: 'store', help: "file containing a properly formated json string containing the data to create the issue from, specifying issue fields explicitly will overwrite duplicates specified in file"});
baragonCreateParser.addArgument(['--data'],{type: 'string', action: 'store', help: "json data string containing issue data, specifying issue fields explicitly will overwrite duplicates specified here"});
baragonCreateParser.addArgument(['--summary'],{type: 'string', action: 'store', help: "Issue Summary"});
baragonCreateParser.addArgument(['--description'],{type: 'string', action: 'store', help: "Issue Description"});
baragonCreateParser.setDefaults({'handler':create});

// Modify mode parser
var baragonModParser = subparsers.addParser("mod",{addHelp:true});
baragonModParser.addArgument(['-s', '--safemode'],{action: 'storeTrue', help: "print post fields and data, but no request is sent"});
baragonModParser.addArgument(['-i', '--issueid'],{type: 'string', action: 'store', help: "specify the issue to modify by Jira Issue ID"});
baragonModParser.addArgument(['-k', '--issuekey'],{type: 'string', action: 'store', help: "specify the issue to modify by Jira Issue Key"});
baragonModParser.addArgument(['-t', '--transition'],{type: 'string', action: 'store', help: "transition id"});
baragonModParser.addArgument(['-m', '--message'],{type: 'string', action: 'store', help: "comment to leave on issue"});
baragonModParser.setDefaults({'handler':modify});

// Assign mode parser
var baragonAssignParser = subparsers.addParser("assign",{addHelp:true});
baragonAssignParser.addArgument(['-s', '--safemode'],{action:'storeTrue', help: "print post fields and data, but no request is sent"});
baragonAssignParser.addArgument(['-i', '--interactive'],{action: 'storeTrue', help: "interactive mode"});
baragonAssignParser.addArgument(['-u', '--userid'],{type: 'string', action: 'store', help: "jira user id to assign issues to"});
baragonAssignParser.addArgument(['-t', '--issue'],{type: 'string', action: 'store', help: "jira issue id to modify"});
baragonAssignParser.setDefaults({'handler':assign});

// Parse Args
var sessionOptions = parser.parseArgs();

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
    sessionOptions.auth = auth;
    rock (); // main 
});

/**
 * sees everything
 */
function rock() {
    if (sessionOptions.handler) {
        sessionOptions.handler(sessionOptions);
    } else {
        console.log("Error: Tell Baragon what to do!");
        //display help
    }
}
