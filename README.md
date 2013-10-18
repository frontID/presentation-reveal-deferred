# reveal-presentation-template

This repository is a presentation template.

## Requirements

A web server.

## Usage

Clone this repo into a folder in your local webserver. Navigate to:

    http://<server>/reveal-presentation-template/
    
The presentation is the default theme for reveal.js, with default transitions.




## INSTRUCTIONS
Open c9.io

Go to Terminal in c9.io
in top level, type "npm install"

multiplex/index.js 
click "run"

go to the url at "Your code is running at '...'"
add "token" at the end of the url and get the payoad
ex: "https:///token"
ex: {"secret":"1382030348780333184","socketId":"fe326e9666759334"}

enter this information into local index.html under multiplex: {secret, id, url} (as string literals... no "http" in url

make sure multiplex.id and multiplex.url matches in both versions of the index.html (c9.io and local version)

index.html
do all dev with plugin/multiplex/client
then add "master"
change plugin/multiplex/client to plugin/multiplex/master after doing all dev


make sure url does NOT have httpS