#usage

`grunt docs` - build documentation in docs/ folder

`grunt test` - runs test suite (qunit, but will be changed to mocha)

`grunt` - builds libraries (normal + min), tests and docs

#examples

Get syncano instance

	var s = SyncanoConnector.getInstance();

Register listener for all events:
	
	s.on('all', function(type, data){
		console.log(type, data);
	});

Connect to instance

	s.connect({
		instance: 'your-instance',
		api_key: 'your-api-key'
	});

Create new project

	s.Project.new('Test', 'description', function(data){
		console.log('Created project, received: ', data);
	});

Get all projects

	s.Project.get(function(p){
		console.log('Received ' + p.length + ' project(s).');
		p.forEach(function(m){
			console.log(m);
		});
	});

Delete project with id 1000

	s.Project.delete(1000, function(r){
		console.log('Deleted project.', r);
	});


Create new collection

	s.Collection.new(projectId, collectionName, collectionDescription, function(data){
		console.log('Created collection, received: ', data);
	});

Get all collections

	s.Collection.get(projectId, null, null, function(data){
		console.log('Received ' + data.length + ' collections');
		data.forEach(function(c){
			console.log(c);
		});
	});

Get collection by id (or key

	s.Collection.getOne(projectId, collectionIdOrKey, function(data){
		console.log('Got collection: ', data);
	});
)

Activate collection

	s.Collection.activate(projectId, collectionId, null, function(){
		console.log('Activated collection');
	});

Deactivate collection

	s.Collection.deactivate(defaultProject, collectionId, function(){
		console.log('Deactivated collection');
	});

Add new data object

	var params = {
		dataKey: 'my_object',
		title: 'Object title',
		state: 'Pending',
		additional: {
			start_date: 'yesterday',
			end_date: 'tomorrow'
		}
	};
	s.Data.new(projectId, collectionKey, params, function(data){
		console.log('Created new data object: ', data);
	});

Get data objects

	s.Data.get(projectId, collectionKey, {
		include_children: false,
		depth: 2,
		limit: 3
	}, function(data){
		console.log('Received', data.length, 'objects');
		data.forEach(function(d){
			console.log(d);
		});
	});