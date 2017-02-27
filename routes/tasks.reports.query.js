var Task = require('../models/task');

module.exports = {
  getTasksBetweenDate : getTasksBetweenDate

}


function getTasksBetweenDate (from, to, userId, excludeFields, isCompleted = false) {

  var fromDate = new Date(from).toISOString();
  var toDate  = new Date(to).toISOString();

  // fromDate.setMinutes(fromDate.getMinutes() - fromDate.getTimezoneOffset());
  // fromDate = fromDate.toISOString();
  //
  // toDate.setMinutes(toDate.getMinutes() - toDate.getTimezoneOffset());
  // toDate = toDate.toISOString();


  console.log(fromDate);
  console.log(toDate);
  var queryObj = {
    '_creator'  : userId,
    'isPerforming': false,
     'updated'  : {
         '$gte': fromDate,
         '$lte' : toDate
     }
   };

  if (isCompleted === true) {
    console.log('find completed tasks');
    queryObj['isCompleted'] = true;
  }
  return Task.find( queryObj, excludeFields).exec();

}
