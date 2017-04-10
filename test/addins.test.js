'use strict';

var assert = require('chai').assert;
var addins = require('../addins.js');

describe('addins test', function() {
    it('# loadAddins - check number of folders', function(done) {
    	addins.loadAddins()
    		  .then( function(numberOfAddins) {
    		  	assert.equal( 2, numberOfAddins );    		  	
    		  	done();
    		  })
    		  .catch( function(err) {
    		  	done(err);
    		  });    		
    });

    it('# getAddinModuleByName - check number of modules loaded', function(done) {
    	addins.loadAddins()
    		  .then( function(numberOfAddins) {
    		  	var addina = addins.getAddinModuleByName( "addin_a" );
    		  	var addinb = addins.getAddinModuleByName( "addin_b" );

    		  	done();
    		  })
    		  .catch( function(err) {
    		  	done(err);
    		  });
    });

    it('# getAddinModuleByName - with bad name', function(done) {
    	addins.loadAddins()
    		  .then( function(numberOfAddins) {
    		  	var addina = addins.getAddinModuleByName( "addin_noexist" );
    		  	done();
    		  })
    		  .catch( function(err) {
    		  	done();
    		  });
    });

    it('# getAddinModuleByName - called before loadAddins() call', function() {
    	addins.clear();

    	try {
  			var addina = addins.getAddinModuleByName( "addin_a" );
  			assert.equal(true,false);
  		} catch(err) {
  			// Test passed
  		}
    });

    it('# getAddinModuleByName - call method of addin', function(done) {
    	addins.loadAddins()
    		  .then( function(numberOfAddins) {
    		  	var addina = addins.getAddinModuleByName( "addin_a" );
    		  	
    		  	assert.equal( "Sample addin A", addina.info().name );
    		  	done();
    		  })
    		  .catch( function(err) {
    		  	done(err);
    		  });
    });
});