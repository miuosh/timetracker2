var Task = require('../models/task');

module.exports = {
  getCompletedTasksBetweenDate : getCompletedTasksBetweenDate

}


function getCompletedTasksBetweenDate (from, to, userId, excludeFields) {

  var fromDate = new Date(from).toISOString();
  var toDate  = new Date(to).toISOString();

  // fromDate.setMinutes(fromDate.getMinutes() - fromDate.getTimezoneOffset());
  // fromDate = fromDate.toISOString();
  //
  // toDate.setMinutes(toDate.getMinutes() - toDate.getTimezoneOffset());
  // toDate = toDate.toISOString();


  console.log(fromDate);
  console.log(toDate);

  return Task.find( {
    '_creator'  : userId,
    'isPerforming': false,
     'updated'  : {
         '$gte': fromDate,
         '$lte' : toDate
     }
   }, excludeFields).exec();

}
