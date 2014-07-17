# SyncanoJS

## Overview
---

SyncanoJS is a browser Javascript library that provides communication with Syncano ([www.syncano.com](http://www.syncano.com/)) via WebSockets. SyncanoJS creates a fast, full duplex communication channel to communicate with your Syncano backend instance through a cross-browser Javascript API.

## Dependencies
---

SyncanoJS requires a [SockJS client library](https://github.com/sockjs/sockjs-client)

## Download
---

You can download the latest version from [GitHub](https://github.com/Syncano/syncano-js/tree/master/dist). You can choose the normal version, with some comments (syncano.js) or minified (syncano.min.js). If you prefer to build a distribution version yourself, follow the Build section.

## Build
---

1. Install [NodeJS](http://nodejs.org/)
2. Install [grunt](http://gruntjs.com/)  
	
	```bash
	npm install -g grunt-cli
	```

3. Run in project directory:

	```bash
	npm install
	```

4. To build project (lib & docs) run:
	
	```bash
	grunt
	```
	or to build just documentation:
	
	```bash
	grunt docs
	``` 

## API Reference
---

See docs generated by YUIdoc (inside `docs/` folder after running `grunt docs` command).

## Usage
---

To use SyncanoJS in your web application, include the following scripts in your HTML document:

	<script type="text/javascript" src="sockjs.js"></script>
	<script type="text/javascript" src="syncano.js"></script>
	
SyncanoJS utilizes a singleton pattern. To get an instance of the object use following code:

```javascript
var syncano = SyncanoConnector.getInstance();
```
	
Then, connect to your instance using the API key generated in the Syncano interface:

```javascript
syncano.connect({
	instance: 'your-syncano-instance-name',
	api_key: 'your-api-key'
});
```
	
SyncanoJS is divided into several modules - each of them provides typical CRUD operations for different backend models:

* *syncano.Project* - projects
* *syncano.Collection* - collections
* *syncano.Folder* - folders
* *syncano.Data* - data objects (low level records)
* *syncano.User* - users

For a complete list of available method please refer to the documentation or source code.

Every SyncanoJS method sends a single asynchronous request to the server. Syncano processes that request and sends a response via WebSocket. SyncanoJS makes it easy to react to these events in one of two ways:

1. via callback
2. via notification

### Callbacks
---

Every method provided by the SyncanoJS library takes a callback function as the last parameter. The callback is called when a response from the server is successful. If the server returns error, tha callback is not called. The callback takes the server response as the only parameter. For further details see examples below.

Starting from version 3.1.3beta you can pass as a callback an object with two methods - success and error - defined:

```javascript
{
	success: function(data){...},
	error: function(errorMessage){...}
}
```

The `success` method is called when a response from the server is successful (`result = OK`), the `error` method - when server returns `result = NOK`.

When you register error handler with `error` method, you won't get `syncano:error` notification when something goes wrong.

### Notifications
---

SyncanoJS utilizes a PubSub pattern, so you can register a function that will be called when a particular event will be triggered. There are lots of events - please check the documentation or source code for a complete list of them. To register an event handler function use method

```javascript
syncano.on(eventType, callback)
```
	
to react on every further event of that type or

```javascript
syncano.once(eventType, callback)
```
	
to handle it only once. To stop listening for events use method

```javascript
syncano.off(eventType, callback)
```
	
There are two commonly used eventTypes: `syncano:error` and `all`. The first is called when the server did not process your request. The latter is called on every syncano event (request, response, and other), so use it carefully. 

Every callback takes one parameter except for the 'all' event which takes two parameters: the first is eventType (ie. `syncano:data:new`) and the second is the data passed by the code that triggered the event.

A typical request pattern looks like this:

```javascript
syncano.once('syncano:error', function(result){
	// handle the next method error
	// result = error message sent by server
});
syncano.methodName(params, function(data){
	// handle success
	// data = json data returned by server
});
```

### Working as user without admin priviledges
---

Create new user in _Syncano -> Users_. Set the password.

Generate new User API Key in _Syncano -> Settings -> API Keys_. Remember its ID (numeric) and Key (string).

Call following code as an admin:

```javascript
var s = SyncanoConnector.getInstance();
s.connect({
    instance: INSTANCE,
    api_key: YOUR_ADMIN_AUTH_KEY,
}, function(){
    var permission = YOUR_PERMISSION_NAME;
    s.Collection.authorize(projectId, collectionId, API_KEY_ID, permission, function(){
        console.log(permission + ' granted');
    });
});
```

Connect as an user with login and password:

```javascript
var params = {
    instance: INSTANCE,
    api_key: USER_API_KEY,
    user_name: USER_NAME,
    password: USER_PASSWORD
};
s.User.login(params, function(){
    s.connect({instance: INSTANCE, api_key: USER_API_KEY}, function(){
    	console.log('Connected as ' + params.user_name);
    });
});
```

Now you have access to your Syncano instance with restricted priviledges.


### Examples
---
	
#### Create a new project:

```javascript
syncano.Project.new('Project name', 'Project description', function(data){
	console.log('Created project, received: ', data);
});
```

#### Get all projects

```javascript
syncano.Project.get(function(p){
	console.log('Received ' + p.length + ' project(s).');
	p.forEach(function(m){
		console.log(m);
	});
});
```

#### Delete project with given ID

```javascript
syncano.Project.delete(projectId, function(r){
	console.log('Deleted project.', r);
});
```
	
#### Get a collection with given ID:

```javascript
syncano.Collection.getOne(projectId, collectionId, function(data){
	console.log('Got collection: ', data);
});
```

#### Create new collection

```javascript
syncano.Collection.new(projectId, collectionName, collectionDescription, function(data){
	console.log('Created collection, received: ', data);
});
```

#### Get all collections


```javascript
syncano.Collection.get(projectId, null, null, function(data){
	console.log('Received ' + data.length + ' collections');
	data.forEach(function(c){
		console.log(c);
	});
});
```


#### Get collection by id (or key)

```javascript
syncano.Collection.getOne(projectId, collectionIdOrKey, function(data){
	console.log('Got collection: ', data);
});
```

#### Activate collection

```javascript
syncano.Collection.activate(projectId, collectionId, null, function(){
	console.log('Activated collection');
});
```

#### Deactivate collection

```javascript
syncano.Collection.deactivate(defaultProject, collectionId, function(){
	console.log('Deactivated collection');
});
```
	
#### Create a new data object:

```javascript
var params = {
    title: 'Object title',
    state: 'Moderated',
    additional: {
        start_date: 'yesterday',
        end_date: 'tomorrow'
    }
};
syncano.Data.new(projectId, collectionId, params, function(data){
    console.log('Created new data object with ID = ', data.id);
});
```
	
#### Get all data objects from the folder:

```javascript
syncano.Data.get(projectId, collectionId, {
    include_children: false,
    folders: 'Artists'
}, function(data){
    console.log('Received', data.length, 'objects');
    data.forEach(function(d){
        console.log(d);
    });
});
```

#### Delete selected data objects

```javascript
syncano.Data.delete(projectId, collectionKey, {
	dataIds: [id1, id2, id3]
}, function(data){
	console.log('Deleted');
});
```


## Backbone.js
---

SyncanoJS comes with a Backbone (http://backbonejs.org/) library extensions for Models and Collections.
SyncanoModel and SyncanoCollection overwrite Backbone.sync method and make it easy to integrate Syncano backend into your Backbone application.
Both SyncanoModel and SyncanoCollection override default `initialize` method, but if you need to write some code that executes on init, 
please use `start` method. There's a possibility to pass aditional parameters to collection, for example parent identifiers - in that case you have to prepare `additionalReadParams` method which returns javascript object with required params.


### Model examples
---

```javascript
var TodoModel = SyncanoModel.extend({
	syncanoParams: {
		projectId: PROJECT_ID,
        collectionId: COLLECTION_ID,
        folder: 'FOLDER NAME'
	}
});
```

### Create new model

```javascript
var todo = new TodoModel();
todo.set({
	title: 'Buy some stuff',
	finished: false
});
todo.save();
```

### Load model and destroy it

```javascript
var todo = new TodoModel({id: MODEL_ID});
todo.fetch({
	success: function(){
		console.log('MODEL', todo.toJSON());
		todo.destroy();
	}
});
```

### Collection example

```javascript
var MyCollection = SyncanoCollection.extend({
	syncanoParams: {
		projectId: PROJECT_ID,
        collectionId: COLLECTION_ID,
        folder: 'FOLDER NAME'
	},

	additionalReadParams: function(){
		return {
			state: 'Moderated'
		}
	}
});
```

### Load collection

```javascript
var collection = new MyCollection();
collection.fetch({
	success: function(res){
		console.log('COLLECTION LENGTH', res.length);
	}
});
```