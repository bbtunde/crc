# Paga - the adapter to Paga

Paga is a Node.js application built using [Restify](http://restify.com/) framework.
The application purpose is to serve as an adapter between the distributor - Paga - and our core services provided by Dozer.

## Requirements

To setup Paga you will need
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

Clone Paga repository.

~~~~
$ cd /var/www/
$ git clone https://github.com/JumiaMDS/paga.git
~~~~

Install Paga package dependencies

~~~~
$ npm install
~~~~

Install globally Unit Tests performer [mocha] (https://github.com/mochajs/mocha) and Code Coverage plugin [istambul] (https://github.com/gotwarlost/istanbul)

~~~~
$ sudo npm install mocha istambul -g
~~~~

Configure parameters by copying dist.config.json and adjust its parameters to your local machine:

~~~~
$ cp ./config/dist.config.json ./config/config.json
~~~~

You should be ready to run your application
~~~~
$ npm run start
~~~~

Server should start and a message should be displayed to the console:
~~~~
$ Paga REST server listening at http://localhost:3334
~~~~

## Test Paga

To test Paga, both a Postman collection and environment are available in the postman folder:
~~~

postman/Paga Environment.postman_environment.json
postman/Paga.postman_collection.json

~~~
## Running UnitTests with code coverage

~~~~
$ npm run test
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


## Adding a new service to the adapter


Providing a new service can be done in one or two easy steps depending on the service complexity:

### 1. Add a new basic service with static configurations

Create a service JSON file for the service inside the services folder
~~~
config/services/
~~~

The service declaration has to follow the Jumia One Service Type Representation e.g.

~~~ json
{
    "service.name.foo": {
        "orderSummaryHandler": "fooOrderSummaryHandler",
        "purchaseHandler": "fooPurchaseHandler",
        "definition": {
            "network": "MY-NETWORK"
        },
        "steps": [
            {
                "fields": [
                    {
                        "key": "field_bar",
                        "title": "What is the value of BAR?",
                        "label": "BAR",
                        "template": "text",
                        "validators": [
                        {
                            "type": "required",
                            "options": [],
                            "message": "BAR is required"
                        }
                        ],
                        "options": []
                    }
                ]
            }
        ]
    }
}
~~~
(!) To know more about [Jumia One Service Type](https://staging-one.jumia.com/docs/dozer)

### 2. Add a new basic service with dynamic configurations

In some cases you may need to add in the service type definition some data coming from an external source (e.g. dynamic options in a multi choice form element)

To achieve this in the service type definition add a request handler, this special method will be called when the service is requested.

~~~ json
{
    "service.name.foo": {
        "orderSummaryHandler": "fooOrderSummaryHandler",
        "purchaseHandler": "fooPurchaseHandler",
        "definition": {
            "network": "MY-NETWORK"
        },
        "steps": [
            {
                "fields": [
                    
                ],
                "requestHandler": "barRequestHandler",
            }
        ]
    }
}
~~~ 

To implement the `barRequestHandler` create a new Javascript file inside the handlers folder

~~~
handlers/
~~~

The handler Javascript file has to return a collection of methods. You can choose to implement all the logic in one or more methods.
(e.g.)

~~~ javascript
module.exports = {

    barRequestHandler: function(formElement, serviceKey, body) {
        return new Promise(function(resolve, reject) {
            resolve(this.barRequestHandlerResponse(formElement, serviceKey, body));
        });
    },

    barRequestHandlerResponse: function(formElement, serviceKey, body){
        return new Promise(function(resolve, reject) {
            resolve(formElement);
        });
    }
}
~~~

### 3. Add the order summary handler

The order summary is the full purchase description, it should contain every property of the price like
discounts or fees. It can also inform the user is some discount code can be used.
The adapter must provide an endpoint to send the order summary prior to the purchase being made. 
The handler that will handle this request is the method set in config key as "orderSummaryHandler"

~~~ json
{
    "service.name.foo": {
        "orderSummaryHandler": "fooOrderSummaryHandler",
        "purchaseHandler": "fooPurchaseHandler",
        "definition": {
            "network": "MY-NETWORK"
        },
        "steps": [
            {
                "fields": [
                    
                ],
                "requestHandler": "barRequestHandler",
            }
        ]
    }
}
~~~ 

To implement the `fooOrderSummaryHandler` create a new Javascript file inside the handlers folder

~~~
handlers/
~~~

The handler Javascript file has to return a Promise where the resolve method should return an Array with /representations/PaymentDetail instances.
(e.g.)

~~~ javascript
module.exports = {

    fooOrderSummaryHandler: function(serviceKey, body) {
        return new Promise(function(resolve, reject) {
            let paymentDetails = {
                "payment_details" : [
                    new PaymentDetail('total_price', 100, [{"currency": "NGN"}])
                ]
            };
            return resolve(paymentDetails);
        });
    }
}
~~~

### 4. Add the purchase handler

The purchase or service delivery is the process to create the service to the external provider
The adapter must provide an endpoint to request the purchase. 
The handler that will handle this request is the method set in config key **purchaseHandler**

To assist in the purchase action some more configurations can be added in the config key **definition**

This **definition** configuration object is free and the user can set any pair of key value as he sees fit 
to made them available in the purchase handler

~~~ json
{
    "service.name.foo": {
        "orderSummaryHandler": "fooOrderSummaryHandler",
        "purchaseHandler": "fooPurchaseHandler",
        "definition": {
            "network": "MY-NETWORK"
        },
        "steps": [
            {
                "fields": [
                    
                ],
                "requestHandler": "barRequestHandler",
            }
        ]
    }
}
~~~ 

To implement the `fooPurchaseHandler` create a new Javascript file inside the handlers folder

~~~
handlers/
~~~

The handler Javascript file has to return a Promise.
(e.g.)

~~~ javascript
module.exports = {

    fooPurchaseHandler: function(serviceKey, body) {
        return new Promise(function(resolve, reject) {
            //Call the external service and resolve with the response
            return resolve({
                status: xhr.response.status,
                balance: xhr.response.balance
            });
        });
    }
}
~~~


### 5. Error Codes

The following table provides Jumia One Core errors list.

|Code| Description|Error Side|
|UNKNOWN_ERROR|Unexpected error occurred|Adapter|
|NOT_FOUND|Requested resource not available or non-existent|Adapter|
|INVALID_PURCHASE_HANDLER|Adapter's request handler missing in source code|Adapter|
|INVALID_AUTHENTICATION|Submitted credentials are wrong or missing|Adapter|
|INVALID_SERVICE_KEY|Requested service key doesn't exist in adapter|Adapter|
|INVALID_BODY|Submitted request has an invalid body format or content|Adapter|
|DISTRIBUTOR_UNAVAILABLE|The distributor endpoint is not responding|Distributor|
|SERVICE_TEMPORARILY_UNAVAILABLE|Jumia One Core keeps trying to use the resource while receiving this code.|Distributor|
|INVALID_REQUEST|The submitted request has invalid information|Adapter, Distributor|
|PREVALIDATION_FAILED|Request has invalid information on distributor side validation|Distributor|
|SUCCESS|Transaction/Request success|Adapter|


And that's it! Now, every time a client requests https://your.services/api/v1/formtype/service.name.foo endpoint, the adapter will know how to deal with it based on request payload.

Requests and response handlers should follow
[Jumia One Core protocol](https://confluence.jumia.com/display/AFRMDS/Jumia+One+Core+Protocol).


