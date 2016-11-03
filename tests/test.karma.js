var assert = require('assert');

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
