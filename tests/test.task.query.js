var task = { _id: "585bb820ddd004147c96b501",
  desc: 'test',
  category: 'Nowa funkcjonalność',
  project: 'PSG',
  _creator: '582afb3800c1bc1f203edf39',
  __v: "3",
  history:
   [ { startTime: '2016-12-22T11:27:56.469Z',
       stopTime: "2016-12-22T11:28:02.067Z",
       _id: "585bb8c29996c8191cde7073",
       dt: "5.598" },
     { startTime: "2016-12-22T11:27:52.256Z",
       stopTime: "2016-12-22T11:27:54.337Z",
       _id: "585bb8ba9996c8191cde7072",
       dt: '2.081' },
     { startTime: "2016-12-22T11:25:24.273Z",
       stopTime: "2016-12-22T11:25:32.696Z",
       _id: "585bb82cddd004147c96b502",
       dt: "8.423" } ],
  isCompleted: "false",
  isPerforming: "false",
  duration: "16",
  updated: "2016-12-22T11:28:02.067Z",
  creationDate: "2016-12-22T11:25:20.920Z" }

  function sumByProperty(items, property) {
    if (items == 0) return 0;
    return items.reduce((previous, current) => {
      return current[property] == null ? previous : previous + parseFloat(current[property]);
    }, 0)

  }

console.log(task);

var suma = sumByProperty(task.history, 'dt');
console.log('-------------')
console.log(suma);
console.log('--- SUMA: ' + suma);
