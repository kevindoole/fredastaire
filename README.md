# mocha-given
Mocha-given adds a `given` method to mocha tests. It has two impacts:
- Your test cases' setup code is significantly more readable
- You only have to write the same setup steps once

_Example_
`given(name, {within, withArgs, ...whateverYouWantToPassToTheDefinition})`

## Setup
0. `npm install mocha-given --save-dev`
1. Make your step definitions file wherever you like.
2. Write some tests that use `given`
3. Run your tests with the appropriate options:
  `mocha ./tests/some-tests.js --ui mocha-given --setupDefinitions ./tests/wherever/step-definitions.js`

## Usage
You need two things: mocha tests that call `given` and some step definitions.

### 1. Tests
Just call `given('with some string')`. The string will be used to identify which step definition to call (more on that later).

There's also `when` and `and`, which are aliases of `given`.

Calls to `given` return the mocha-given module, so you can chain calls together into wonderful poems.

_/your/project/tests/astronauts-test.js_
```JavaScript
const state = {
	spaceThings: [],
};

let res;

describe('Installing interesting space apparatus', function() {
	given('there are two spacethings', {within: state.spaceThings});
	// Calls steps['there are two spacethings']().

	when('i request a space thing', {
		id: state.spaceThings[0].id,
		within: res,
	});
	// "when" is an alias of given. So is "and".

	it('should give me one space thing', function() {
	  expect(res.body.spacething).to.not.be.null;
	  expect(res.body.spacething.id).to.equal(this.spacethings[0].id);
	});
});
```

### 2. Step definitions
Step definitions are the places where you put your setup code for individual tests.

_/your/project/wherever/you/like/your-definitions.js_
```
module.exports = {
  'there are two space things': function() {
    SpaceThings.create({idunno: 'stuff'});
    SpaceThings.create({idunno: 'more stuff'});
  },

  'there is one astronaut': function() {
    return SpaceAstronaut.create();
  },

  'one space thing is requested': function({id, container}) {
    return request.get('/space-things/' + id)
    .then(response => container = response);
  }
};
```
