var Task = require('../models/task');

module.exports = {
  getTasksBetweenDate : getTasksBetweenDate

}
function getTasksBetweenDate (startDate, endDate, completed = true) {
  
  var promise = Task.find( {completed: true ,
     updated: {
       '$gte': ISODate(startDate),
       '$lt': ISODate(endDate)
     } }).exec();

     return promise;
}
