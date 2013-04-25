# Baragon
JIRA Command Line Interface
Node Module

# Setup

1. npm install - install dependencies

2. config.json
    * targetHost.host eg "issues.apache.org",
    * projectId jira project id, numeric eg 123123
    * projectKey jira project id, string eg "CB"
3. there is no spoon

# Use

## baragon fetch

Baragon can fetch issues!

### fetch options
  -h, --help            Show this help message and exit.

  -s, --safemode        print post fields and data, but no request is sent

  -a ASSIGNEE, --assignee ASSIGNEE

user name, fetch issues assigned to user=assignee

  -k ISSUEKEY, --issueKey ISSUEKEY

retrieve issue with the given key eg 'CB-2187'

  -m MAXRESULTS, --maxResults MAXRESULTS

maximum number of issues to fetch

### Examples

####fetch all issues
    node baragon.js fetch
#### fetch issues by assignee
    node baragon.js fetch -a <user-name> 
#### fetch latest 10 issues
    node baragon.js fetch -m 10

## baragon create
### create options

  -h, --help           

Show this help message and exit.

  -s, --safemode       

print post fields and data, but no request is sent

  --jsonfile JSONFILE  

file containing a properly formated json string containing the data to create the issue from

## baragon modify
### mod options

  -h, --help            

Show this help message and exit.

  -s, --safemode        

print post fields and data, but no request is sent

  -i ISSUEID, --issueid ISSUEID

specify the issue to modify by Jira Issue ID

## baragon options
- -h --help

print help string

- -s --safemode

development mode, supply this option to baragon or baragon subcommands and HTML request and data will be composed but not sent

