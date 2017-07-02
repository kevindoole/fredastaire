var steps = {};

module.exports = {
  addSteps(newSteps) {
    steps = Object.assign(steps, newSteps);
  },
  getSteps() {
    return steps;
  },
};
