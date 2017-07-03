# Fredastaire
Fredastaire adds step methods to mocha tests that have two impacts:
- Your test cases' setup code is significantly more readable
- You only have to write the same setup steps once

## Table of contents
- [Setup](#setup)
- [Usage](#usage)
  - [Tests](#1-tests)
  - [Step definitions](#2-step-definitions)
- [Full API](#full-api)

---

## Setup
0. `npm install fredastaire --save-dev` or `yarn add fredastaire -D`
1. Define your steps wherever you like. (example below)
2. Write some tests that use `given`. (example below)
3. Run your tests with the fredastaire ui, requiring your steps file:
  `mocha ./tests/some-tests.js --ui fredastaire --require <your steps file>`

## Usage

### 1. Tests
Just call `given('with some string')`. The string will be used to identify which step definition to call (more on that later).

There's also `when` and `and`, which are aliases of `given`.

TODO: Add given, when, and to the test output.

```js
// /your/project/tests/astronauts-test.js

const state = {
	spaceThings: [],
	astronauts: [],
};

let res;

describe('Interesting space apparatus example', function() {
	given('there are two spacethings', {container: state.spaceThings});

	and('there is one astronaut', {container: state.astronauts});

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

```js
// /your/project/wherever/you/like/your-definitions.js

const addSteps = require('fredastaire/steps');
const request = require('whatever/you/like/for/requesting/stuff');

addSteps({
  'there are two space things': function({container, spaceThing1={}, spaceThing2={}}) {
    container = [SpaceThings.create(spaceThing1), SpaceThings.create(spaceThing2)];
  },

  'there is one astronaut': function({container, astronaut={}}) {
    container = SpaceAstronaut.create(astronaut);
  },

  'i request a space thing that has an astronaut': function({id, container}) {
    return request.get('/space-things/' + id)
    .then(response => container = response);
  }
});
```

## Full API

### Methods

---

#### `given`, `and`, `when`

```js
given('there is something', {named: 'whatever'});
```

Calls a defined step inside a `before`. `given`, `and` and `when` are all the
same function, so use them in whatever order you like. Return a promise to
handle async behavior.

##### Arguments

###### {string} `name` -- The name used to identify the step.
So if you define a step named "this is a step", then you would run the step
using `given('this is a step')`.

###### {object} `data` -- Whatever you need to pass to the step.
Pass whatever your step needs to can create something specific.

---

#### `addSteps`

```js
addSteps({
  'there is something': function(data) {
		global.thing = {...data};
  }
});
```

Registers steps which are triggered with `given`.

##### Arguments
###### {object} `steps` -- The name and function to be triggered by `given`.
The objects you pass to `addSteps` are all merged together, so when you call `given(name)`, it calls `steps[name]()`. *So if you pass the same key twice to `addSteps`, the first step will be replaced by the second.

---

#### `getSteps()`

Gets all the steps you've defined
