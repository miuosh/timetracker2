var Task = require('../models/task');

module.exports = {
  getCompletedTasksBetweenDate : getCompletedTasksBetweenDate

}


function getCompletedTasksBetweenDate (from, to, userId) {

  var fromDate = new Date(from).toISOString();
  var toDate  = new Date(to).toISOString();

  console.log(fromDate);
  console.log(toDate);

  return Task.find( {
    'isCompleted' : true,
    '_creator'  : userId,
     'updated'  : {
         '$gte': fromDate,
         '$lt' : toDate
     }
   }).exec();

}
