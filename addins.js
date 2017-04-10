/*
 * Module for retrieving and managing addins (or extensions) in an application.
 */

'use strict';
var path = require("path");
var fs = require("fs");
var util = require("util");

var _addins = null;

const ADDINS_FOLDER_NAME = "app_addins";

module.exports = {};

function _loadAddinsFolders( addinsPath ) {
	return new Promise( function( resolve, reject ) {
		let pathToRead = addinsPath === undefined ? path.join( process.cwd(), ADDINS_FOLDER_NAME ) : addinsPath;

		fs.readdir( pathToRead, function(err,files) {
			if ( err ) reject(err);
			else {
				var addinsDirectories = [];

				files.forEach( (file) => {
					let fullPath = path.join( pathToRead, file );					
					let st = fs.statSync( fullPath );

					if ( st.isDirectory() ) {
						addinsDirectories.push( { addinName : file, addinFullPath: fullPath } );
					}
				})

				resolve( addinsDirectories );
			}
		});
	});	
}

function _loadAddins( pathsToAddins ) {
	return new Promise( function(resolve, reject) {
		let addinsLoaded = [];
		_addins = [];

		pathsToAddins.forEach( (p) => {
			let fullPathToAddin = path.join( p.addinFullPath, p.addinName + ".js" );

			if( fs.existsSync( fullPathToAddin ) ) {
				let addin = require(fullPathToAddin);
				addinsLoaded.push( { addinName: p.addinName, addinModule: addin } )
			} else {
				reject( util.format("Expected adding %s not found", fullPathToAddin) );
			}			
		} );
		
		_addins = addinsLoaded;
		resolve(_addins.length);
	});
}

/*
 * Load addins
 * Params:
 *    addinsPath: optional. If set, absolute path to the folder containing addins to load.
 *                If not set, <application root path>/app_addins will be considered by default.
 * Returns a Promise object; if success, returns the number of addins loaded
 */
module.exports.loadAddins = function( addinsPath ) {
	return _loadAddinsFolders( addinsPath ).then( _loadAddins );
}

/*
 * Returns the number of addins loaded in previous call to loadAddins()
 */
module.exports.getAddins = function() {
	return _addins;
}

/* 
 * Returns the addin module loaded in a previous call to loadAddins()
 * Params: 
 *    name: name of the addin module. 
 * Throws and exception if and addin module with that name is not found.
 */
module.exports.getAddinModuleByName = function( name ) {
	var module = null;
	
	if ( !_addins ) throw new Error("loadAddins() method should be called first");

	_addins.forEach( (addin) => {
		if ( addin.addinName === name ) {
			module = addin.addinModule;
		}
	})

	if ( !module ) {
		throw new Error( util.format( "No addin with name %s found", name ) );	
	} 

	return module;
}

/*
 * Clears the list of modules loaded by loadAddins()
 */
module.exports.clear = function() {
	_addins = null;
}