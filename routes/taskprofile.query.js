var TaskProfile = require('../models/taskprofile');

module.exports = {
  getProfiles: getProfiles,
  getProfile: getProfile,
  addProfile: addProfile,
  editProfile: editProfile,
  removeProfile: removeProfile
}


function getProfiles() {
  return TaskProfile.find({}).exec();
}

function getProfile(id) {
  return Task.Profile.find( {'_id': id} );
}

function addProfile(profile){
  var profile = new TaskProfile( {
    name: profile.name,
    projects: profile.projects,
    categories: profile.categories
  })

  return profile.save();
}

function editProfile(id, profile) {
  var promise = TaskProfile.find({ '_id': id }).exec();

  promise.then(function(data) {
    var taskprofile = data[0];
    taskprofile.name = profile.name;
    taskprofile.projects = profile.projects;
    taskprofile.categories = profile.categories;

    return taskprofile.save();
  });
}

function removeProfile(id) {

  return TaskProfile.remove({ '_id': id }).exec();
}
