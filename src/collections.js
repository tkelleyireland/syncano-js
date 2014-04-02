/**
 * Methods for handling collections - creating, reading, updating, deleting 
 */
var Collection = {};


/**
 *  Create new collection within specified project
 *  
 *  @method Collection.new
 *  @param {number} projectId Project id that collection will be created for
 *  @param {string} name New collections name
 *  @param {object} [optionalParams] Optional parameters:
 *  @param {string} [optionalParams.key] New collections key
 *  @param {string} [optionalParams.description] New collection's description
 *  @param {function} [callback] Function to be called when successful response comes
 */
Collection.new = function(projectId, name, optionalParams, callback){
	this.__super__.__checkProjectId(projectId);
	
	var method = 'collection.new';
	
	if(!isset(name)){
		throw new Error(method + ': name must be set');
	}

	var params = {
		name: name,
		project_id: projectId
	};
	if(isset(optionalParams)){
		if(isset(optionalParams.description)){
			params.description = optionalParams.description;
		}
		if(isset(optionalParams.key)){
			params.key = optionalParams.key;
		}
	}
	this.__super__.__sendWithCallback(method, params, 'collection', callback);
};


/**
 *  Get collections from specified project
 *
 *  @method Collection.get
 *  @param {number} projectId Project id
 *  @param {object} [optionalParams] Optional parameters:
 *  @param {string} [optionalParams.status] Status of events to list. Accepted values: active, inactive, all. Default value: all
 *  @param {string / Array} [optionalParams.withTags] If specified, will only list events that has specified tag(s) defined. Note: tags are case sensitive
 *  @param {function} [callback] Function to be called when successful response comes
 */
Collection.get = function(projectId, optionalParams, callback){
	this.__super__.__checkProjectId(projectId);
	var method = 'collection.get';
	var params = {
		project_id: projectId
	};
	
	if(isset(optionalParams)){
		if(isset(optionalParams.status)){
			if(inArray(optionalParams.status.toLowerCase(), ['all', 'active', 'inactive'])){
				params.status = optionalParams.status;
			} else {
				throw new Error(method + ': status must be one of the values: "active", "inactive", "all"');
			}
		}
		
		if(isset(optionalParams.withTags)){
			params.with_tags = optionalParams.withTags;
		}
	}
	this.__super__.__sendWithCallback(method, params, 'collection', callback);
};


/**
 * Get one collection from specified project.
 * collection_id/collection_key parameter means that one can use either one of them - collection_id or collection_key 
 *
 * @method Collection.getOne
 * @param {number} projectId Project id
 * @param {string / Number} collection Either collection id (number) or key (string)
 * @param {function} [callback] Function to be called when successful response comes
 */
Collection.getOne = function(projectId, collection, callback){
	this.__super__.__checkProjectId(projectId);
	
	var method = 'collection.get_one';
	var params = {
		project_id: projectId
	};
	params = this.__super__.__addCollectionIdentifier(params, collection);
	this.__super__.__sendWithCallback(method, params, 'collection', callback);
};


/**
 * Activates specified collection 
 * 
 * @method Collection.activate
 * @param {number} projectId Project id
 * @param {number} collectionId Collection id defining collection to be activated
 * @param {boolean} force If set to True, will force the activation by deactivating all other collections that may share it's data_key.
 * @param {function} [callback] Function to be called when successful response comes
 */
Collection.activate = function(projectId, collectionId, force, callback){
	this.__super__.__checkProjectId(projectId);
	
	var method = 'collection.activate';

	if(!isNumber(collectionId)){
		throw new Error(method + ': collectionId must be a number');
	}

	var params = {
		project_id: projectId,
		collection_id: collectionId
	};
	
	if(isset(force)){
		params.force = force;
	}
	this.__super__.__sendWithCallback(method, params, null, callback);
};


/**
 * Deactivates specified collection
 * collection_id/collection_key parameter means that one can use either one of them - collection_id or collection_key 
 *
 * @method Collection.deactivate
 * @param {number} projectId Project id
 * @param {string / Number} collection Either collection id (number) or key (string)
 * @param {function} [callback] Function to be called when successful response comes
 */
Collection.deactivate = function(projectId, collection, callback){
	this.__super__.__checkProjectId(projectId);

	var method = 'collection.deactivate';
	var params = {
		project_id: projectId
	};
	params = this.__super__.__addCollectionIdentifier(params, collection);
	this.__super__.__sendWithCallback(method, params, null, callback);
};


/**
 * Update existing collections name and/or description
 * 
 * @method Collection.update
 * @param {number} projectId Project id
 * @param {string / Number} collection Either collection id (number) or key (string)
 *  @param {object} [optionalParams] Optional parameters:
 * @param {string} [optionalParams.name] New collection name
 * @param {string} [optionalParams.description] New collection description
 * @param {function} [callback] Function to be called when successful response comes 
 */
Collection.update = function(projectId, collection, optionalParams, callback){
	this.__super__.__checkProjectId(projectId);
	var method = 'collection.update';
	var params = {
		project_id: projectId
	};
	params = this.__super__.__addCollectionIdentifier(params, collection);
	
	if(isset(optionalParams)){
		if(isset(optionalParams.name)){
			params.name = optionalParams.name;
		}
		if(isset(optionalParams.description)){
			params.description = optionalParams.description;
		}
	}
	this.__super__.__sendWithCallback(method, params, 'collection', callback);
};


/**
 *  Add a tag to specific event.
 *  Note: tags are case sensitive. Non-ascii characters are not allowed.
 * 
 *  @method Collection.addTag
 *  @param {number} projectId Project id
 *  @param {string / Number} collection Either collection id (number) or key (string)
 *  @param {string / Array} tags Tag(s) to be added. Either string (one tag) or array (multiple tags)
 *  @param {object} [optionalParams] Optional parameters:
 *  @param {float} [optionalParams.weight] Tags weight. Default value = 1
 *  @param {boolean} [optionalParams.removeOther] If true, will remove all other tags of specified collection. Default value: False
 *  @param {function} [callback] Function to be called when successful response comes 
 */
Collection.addTag = function(projectId, collection, tags, optionalParams, callback){
	if(typeof arguments[3] === 'function'){
		callback = arguments[3];
		optionalParams = undefined;
	}

	this.__super__.__checkProjectId(projectId);
	var method = 'collection.add_tag';
	var params = {
		project_id: projectId
	};
	params = this.__super__.__addCollectionIdentifier(params, collection);
	
	if(typeof tags !== 'string' && !(typeof tags === 'object' && typeof tags.length !== 'undefined')){
		throw new Error(method + ': tags must be passed');
	}
	
	/**
	 *  currently only ascii chars are supported
	 */
	var testTagString;
	if(typeof tags === 'string'){
		testTagString = tags;
	} else {
		testTagString = tags.join(',');
	}
	if(!/^[\000-\177]*$/.test(testTagString)){
		throw new Error(method + ': non ascii characters found in tag name');
	}
	
	params.tags = tags;
	
	if(isset(optionalParams)){
		if(isset(optionalParams.weight)){
			params.weight = optionalParams.weight;
		}
		if(isset(optionalParams.removeOther)){
			params.remove_other = !!optionalParams.removeOther;
		}
	}
	
	this.__super__.__sendWithCallback(method, params, null, callback);
};


/**
 * Delete a tag or tags from specified collection.
 * Note: tags are case sensitive 
 *
 * @method Collection.deleteTag
 * @param {number} projectId Project id
 * @param {string / Number} collection Either collection id (number) or key (string)
 * @param {string / Array} tags Tag(s) to be added. Either string (one tag) or array (multiple tags)
 * @param {function} [callback] Function to be called when successful response comes 
 */
Collection.deleteTag = function(projectId, collection, tags, callback){
	this.__super__.__checkProjectId(projectId);
	var method = 'collection.delete_tag';
	var params = {
		project_id: projectId
	};
	params = this.__super__.__addCollectionIdentifier(params, collection);
	
	if(typeof tags !== 'string' && !(typeof tags === 'object' && typeof tags.length !== 'undefined')){
		throw new Error(method + ': tags must be passed');
	}
	
	/**
	 *  currently only ascii chars are supported
	 */
	var testTagString;
	if(typeof tags === 'string'){
		testTagString = tags;
	} else {
		testTagString = tags.join(',');
	}
	if(!/^[\000-\177]*$/.test(testTagString)){
		throw new Error(method + ': non ascii characters found in tag name');
	}
	
	params.tags = tags;
	this.__super__.__sendWithCallback(method, params, null, callback);
};


/**
 * Permanently delete specified collection and all associated data.
 * 
 * @method Collection.delete
 * @param {number} projectId Project id
 * @param {string / Number} collection Either collection id (number) or key (string)
 * @param {function} [callback] Function to be called when successful response comes 
 */
Collection.delete = function(projectId, collection, callback){
	this.__super__.__checkProjectId(projectId);
	var method = 'collection.delete';
	var params = {
		project_id: projectId
	};
	params = this.__super__.__addCollectionIdentifier(params, collection);
	this.__super__.__sendWithCallback(method, params, null, callback);
};
