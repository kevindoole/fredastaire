var fs = require('fs');
var path = require('path');
var Mocha = require('mocha');
var argv = require( 'minimist' )( process.argv );
var colors = require( 'colors/safe' );

/**
 * This UI adds a setup method which enables sharing setup definitions in a relatively light way.
 */
module.exports = Mocha.interfaces['fredastaire'] = function(suite) {
  suite.on('pre-require', function(context, file, mocha) {
    var common = require('mocha/lib/interfaces/common')([suite], context);
    var stepDefinitions = require('./steps').getSteps();

    context.run = mocha.options.delay && common.runWithSuite(suite);

    /**
     * Enables easily sharing setup steps.
     */
    context.given = function(title, givenOptions) {
      if (!givenOptions) {
        givenOptions = {};
      }

      if (!stepDefinitions[title]) {
        warn('fredastaire: Skipping unimplemented step definition.');
        info('Add the method "' + title + '" using `addSteps()` before your tests run.');

        return;
      }

      var stepOptions = Object.assign({}, givenOptions);

      return stepDefinitions[title](stepOptions);
    };


    context.when = context.given;
    context.and = context.given;
  });
};

function warn(msg) {
  console.warn( colors.yellow.bold( '\n' + msg ) );
}

function info(msg) {
  console.info( colors.gray.italic( msg ) );
}
