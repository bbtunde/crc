# CRC - Credit bureau api

CRC is a Node.js application built using [Restify](http://restify.com/) framework.


## Requirements

To setup crc you will need
- [Node > v8.9.1 (recommended latest)](https://nodejs.org/)
- [npm (recommended latest)](https://www.npmjs.com/)
- [Git](https://git-scm.com/)

### Node
It will run the application as a server

### npm
The Javascript package manager

### Git
To checkout the code from the repository

## Setup
Make sure you have both Node.js  and npm installed in your computer by checking its versions in your system
~~~~
$ <program> -v
~~~~

Clone CRC repository.

~~~~
$ cd /var/www/
$ git clone https://github.com/JumiaMDS/paga.git
~~~~

Install CRC package dependencies

~~~~
$ npm install
~~~~



You should be ready to run your application
~~~~
$ npm run start
~~~~

Server should start and a message should be displayed to the console:
~~~~
$ CRC REST server listening at http://localhost:3334
~~~~



## Generate api docs

~~~~
$ npm run docs
~~~~

## Read API docs (only available after generated)

Open file <project root folder>/docs/apidoc/generated/index.html in the browser

## Debug on Visual Studio Code

It's easy to debug with Visual Studio Code both for unit tests and app run.
Add a file named "launch.json" in .vscode hidden folder, at the root of your project.
Paste the following content:

~~~ json

{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Debug Mocha tests",
            "type": "node",
            "request": "launch",
            "program": "${workspaceRoot}/node_modules/mocha/bin/_mocha",
            "stopOnEntry": false,
            "args": ["-t", "10000", "test/**/*.spec.js"],
            "cwd": "${workspaceRoot}",
            "preLaunchTask": null,
            "runtimeArgs": [
                "--nolazy"
            ],
            "env": {
                "NODE_ENV": "test"
            },
            "console": "internalConsole",
            "outFiles": [
                "${workspaceRoot}"
            ]
        },
        {
            "name": "Debug Program",
            "type": "node",
            "request": "launch",
            "program": "${workspaceRoot}/app.js"
        }
    ]
}

~~~

Now, if you want to run the application in debug mode (Ctr+Shift+D), choose one of the two available configurations ("Debug Mocha tests" or "Debug Program") and play "Start Debugging".
App will stop at your breakpoints.




