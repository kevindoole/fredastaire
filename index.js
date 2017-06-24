var Mocha = require('mocha');
var argv = require( 'minimist' )( process.argv );
var fs = require('fs');
var colors = require( 'colors/safe' );

/**
 * This UI adds a setup method which enables sharing setup definitions in a relatively light way.
 */
module.exports = Mocha.interfaces['mocha-given'] = function(suite) {
  suite.on('pre-require', function(context, file, mocha) {
    var common = require('mocha/lib/interfaces/common')([suite], context);

    context.run = mocha.options.delay && common.runWithSuite(suite);

    /**
     * Enables easily sharing setup steps.
     */
    context.given = function(title) {
      var setupDefinitionsAvailable = argv.setupDefinitions && fs.exists(argv.setupDefinitions);
      if (!setupDefinitionsAvailable) {
        warn('Skipping setup -- your setup definitions file (' + argv.setupDefinitions + ') does not exist.');

        return;
      }

      var setupDefinitions = require(argv.setupDefinitions);
      if (!setupDefinitions[title]) {
        warn('Skipping unimplemented setup definition: ' + argv.setupDefinitions);

        return;
      }

      setupDefinitions[title]();
    };
  });
};

function warn(msg) {
  console.warn( colors.yellow( '\n' + msg + '\n' ) );
}
