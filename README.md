# Fredastaire
Fredastaire adds step methods to mocha tests that have two impacts:
- Your test cases' setup code is significantly more readable
- You only have to write the same setup steps once

_Example_
`given(name, {container, args, ...whateverYouWantToPassToTheDefinition})`
- You can also use `when` and `and`

## Setup
0. `npm install fredastaire --save-dev` or `yarn add fredastaire -D`
1. Define your steps wherever you like. (example below)
2. Write some tests that use `given`. (example below)
3. Run your tests with the fredastaire ui, requiring your steps file:
  `mocha ./tests/some-tests.js --ui fredastaire --require <your steps file>`

## Usage
You need two things: mocha tests that call `given` and some step definitions.

### 1. Tests
Just call `given('with some string')`. The string will be used to identify which step definition to call (more on that later).

There's also `when` and `and`, which are aliases of `given`.

TODO: Add given, when, and to the test output.

_/your/project/tests/astronauts-test.js_
```JavaScript
const state = {
	spaceThings: [],
	astronauts: [],
};

let res;

describe('Interesting space apparatus example', function() {
	given('there are two spacethings', {container: state.spaceThings});

	and('there is one astronaut', {container: state.astronauts, args: {}});

	when('i request a space thing that has an astronaut', {
		id: state.spaceThings[0].id,
		container: res,
	});

	it('should give me one space thing', function() {
	  expect(res.body.spacething).to.not.be.null;
	  expect(res.body.spacething.id).to.equal(state.spacethings[0].id);
	});

	it('should have an astronaut with the space thing', function() {
		expect(res.body.spacething.astronaut).to.not.be.null;
		expect(res.body.spacething.astronaut.id).to.equal(state.astronauts[0].id);
	});
});
```

### 2. Step definitions
Step definitions are the places where you put your setup code for individual tests.

_/your/project/wherever/you/like/your-definitions.js_
```
const addSteps = require('fredastaire/steps');
const request = require('whatever/you/like/for/requesting/stuff');

addSteps({
  'there are two space things': function({container, args}) {
    container = [SpaceThings.create(args), SpaceThings.create(args)];
  },

  'there is one astronaut': function({container, args}) {
    container = SpaceAstronaut.create(args.astronaut);
  },

  'i request a space thing that has an astronaut': function({id, container}) {
    return request.get('/space-things/' + id)
    .then(response => container = response);
  }
});
```
