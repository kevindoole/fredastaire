var fs = require('fs');
var path = require('path');
var Mocha = require('mocha');
var argv = require( 'minimist' )( process.argv );
var colors = require( 'colors/safe' );

/**
 * This UI adds a setup method which enables sharing setup definitions in a relatively light way.
 */
module.exports = Mocha.interfaces['mocha-given'] = function(suite) {
  suite.on('pre-require', function(context, file, mocha) {
    var common = require('mocha/lib/interfaces/common')([suite], context);

    context.run = mocha.options.delay && common.runWithSuite(suite);

    var setupDefinitionsArgumentProvided = !!argv.setupDefinitions;

    if (!setupDefinitionsArgumentProvided) {
      warn('You must provide your step definitions file location using the --setupDefinitions option.')

      throw new Error('mocha-given: Called `given` without a step definitions file');
    }

    var fullPathToStepDefinitions = path.join(process.env.PWD, argv.setupDefinitions)
    var stepDefinitionsFileExists = fs.existsSync(argv.setupDefinitions);
    var stepDefinitions = require(fullPathToStepDefinitions);

    /**
     * Enables easily sharing setup steps.
     */
    context.given = function(title, givenOptions) {
      if (!givenOptions) {
        givenOptions = {};
      }

      if (!stepDefinitionsFileExists) {
        warn('mocha-given: Aborting');
        info('The step definitions filename you provided (' + argv.setupDefinitions + ') does not exist.')

        return;
      }

      if (!stepDefinitions[title]) {
        warn('mocha-given: Skipping unimplemented step definition.');
        info('Add the method "' + title + '" to ' + argv.setupDefinitions + '.');

        return;
      }

      var stepOptions = Object.assign({}, givenOptions);

      // Map within to container, because it reads better on the definition side.
      if (givenOptions.within) {
        stepOptions.container = givenOptions.within;
      }

      // Map withArgs to args, because it reads better on the definition side.
      if (givenOptions.withArgs) {
        if (!Array.isArray(givenOptions.withArgs)) {
          givenOptions.withArgs = [givenOptions.withArgs];
        }
        stepOptions.args = givenOptions.withArgs;
      }

      stepDefinitions[title](stepOptions);

      return context;
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
