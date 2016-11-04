var assert = require('assert');

/*
  Simple test to check karma is running properly.
*/
describe('First test', function() {
  var counter;

  beforeEach(function() {
      counter = 0;
  });
  it('Inrement value', function() {
    counter++;
    expect(counter).toEqual(1);
  })
})
