angular.module('app')
.run(runBlock);

runBlock.$inject([]) // i.e. 'authenticator', 'translator'
/*
runBlock(authenticator, translator) {
  authenticator.initialize();
  translator.initialize();
}
*/
function runBlock() {

}
