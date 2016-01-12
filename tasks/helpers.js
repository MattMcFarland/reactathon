const _ = require('lodash');

exports.getNPMPackageIds = () => {
  // read package.json and get dependencies' package ids
  var packageManifest = {};
  try {
    packageManifest = require('../package.json');
  } catch (e) {
    // does not have a package.json manifest
  }
  return _.keys(packageManifest.dependencies) || [];

}
