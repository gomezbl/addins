'use strict';

var assert = require('chai').assert;
var path = require('path');
var addins = require('../addins.js');
var goodAddinsPath = path.join( __dirname, "app_addins" );

describe('addins test', function() {
    it('# loadAddins - check number of folders', (done) => {
    	addins.loadAddins(goodAddinsPath)
    		  .then( function(numberOfAddins) {
    		  	assert.equal( 3, numberOfAddins );    		  	
    		  	done();
    		  })
    		  .catch( function(err) {
    		  	done(err);
    		  });    		
    });

    it('# getAddinModuleByName - check number of modules loaded', (done) => {
    	addins.loadAddins(goodAddinsPath)
    		  .then( function(numberOfAddins) {
    		  	var addina = addins.getAddinModuleByName( "addin_a" );
    		  	var addinb = addins.getAddinModuleByName( "addin_b" );

    		  	done();
    		  })
    		  .catch( function(err) {
    		  	done(err);
    		  });
    });

    it('# getAddinModuleByName - with bad name', (done) => {
    	addins.loadAddins(goodAddinsPath)
    		  .then( function(numberOfAddins) {
    		  	var addina = addins.getAddinModuleByName( "addin_noexist" );
    		  	done( new Error("Test a failed") );
    		  })
    		  .catch( function(err) {
    		  	done();
    		  });
    });

    it('# getAddinModuleByName - called before loadAddins() call', () => {
    	addins.clear();

    	try {
  			var addina = addins.getAddinModuleByName( "addin_a" );
  			assert.equal(true,false);
  		} catch(err) {
  			// Test passed
  		}
    });

    it('# getAddinModuleByName - call method of addin', (done) => {
    	addins.loadAddins(goodAddinsPath)
    		  .then( function(numberOfAddins) {
    		  	var addina = addins.getAddinModuleByName( "addin_a" );
    		  	
    		  	assert.equal( "Sample addin A", addina.info().name );
    		  	done();
    		  })
    		  .catch( function(err) {
    		  	done(err);
    		  });
    });

    it('# loadAddins - module and folder mismatch', (done) => {
    	addins.loadAddins( path.join( __dirname, "app_addins_bad" ) )
    		  .then( function(numberOfAddins) {
    		  	assert.equal( 2, numberOfAddins );    		  	
    		  	done();
    		  })
    		  .catch( function(err) {
    		  	done();
    		  });    		
    });

    it('# loadAddins - addins folder not exists', (done) => {
    	addins.loadAddins()
    		  .then( function(numberOfAddins) {
    		  	done( new Error("Test failed") );
    		  })
    		  .catch( function(err) {
    		  	done();
    		  });    		
    });

    it("# check adding properties", (done) => {
        addins.loadAddins(goodAddinsPath)
              .then( (numberOfAddins) => {
                var addinsInstances = addins.getAddins();
                assert.isArray( addinsInstances );

                addinsInstances.map( (addin) => {
                    assert.isString( addin.addinName );
                    assert.isObject( addin.addinModule );
                    assert.isString( addin.pathToAddin );
                    assert.isString( addin.readme );
                });

                done();
              })
              .catch( (err) => { done(err); } );
    });

    it("# check readme content", (done) => {
        addins.loadAddins(goodAddinsPath)
              .then( (numberOfAddins) => {
                var addinC = addins.getAddinModuleInfoByName( "addin_c");

                assert.equal( addinC.readme, "## Readme mark down file" );
                done();
              })
              .catch( (err) => { done(err); } );
    });

    it("# load addin info", (done) => {
        addins.loadAddins(goodAddinsPath)
              .then( (numberOfAddins) => {
                var addinC = addins.getAddinModuleInfoByName( "addin_c");
                assert.isString( addinC.addinName );
                assert.isObject( addinC.addinModule );
                assert.isString( addinC.pathToAddin );
                assert.isString( addinC.readme );

                done();
              })
              .catch( (err) => { done(err); } );

    });

    it("# load addin info with bad addin name", (done) => {
        addins.loadAddins(goodAddinsPath)
              .then( (numberOfAddins) => {
                var addinC = addins.getAddinModuleInfoByName( "addin_noexist");
                done( new Error("Test a failed") );              
              })
              .catch( (err) => { done(); } );

    });
});