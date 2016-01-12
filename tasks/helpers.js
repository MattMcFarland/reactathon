const _ = require('lodash');

exports.getNPMPackageIds = () => {
  // read json and get dependencies' package ids
  var packageManifest = {};
  try {
    packageManifest = require('../client/client-manifest.json');
  } catch (e) {
    // does not have a client-manifest.json file.
  }
  return _.keys(packageManifest.dependencies) || [];

};
