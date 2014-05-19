/*global describe, before, it, beforeEach */
'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;

describe('Angular generator template mechanism', function () {
  var angular;
  var appName = 'upperCaseBug';

  beforeEach(function (done) {
    var deps = [
      '../../../src',
      '../../../common',
      '../../../controller',
      '../../../main', [
        helpers.createDummyGenerator(),
        'karma:app'
      ]
    ];
    helpers.testDirectory(path.join(__dirname, 'tmp', appName), function (err) {
      if (err) {
        done(err);
      }

      angular = helpers.createGenerator('angular:app', deps, [appName], {
        'skip-welcome-message': true,
        'skip-install': true,
        'skip-message': true
      });

      helpers.mockPrompt(angular, {
        compass: true,
        bootstrap: true,
        compassBootstrap: true,
        modules: []
      });

      done();
    });
  });

  it('should generate the same appName in every file', function (done) {
    angular.run({}, function () {
      helpers.assertFile([
        'src/scripts/src.js',
        'src/scripts/controllers/main.js',
        'src/index.html',
        'test/spec/controllers/main.js'
      ]);

      helpers.assertFileContent(
        'src/scripts/src.js',
        new RegExp('module\\(\'' + appName + 'App\'')
      );
      helpers.assertFileContent(
        'src/scripts/controllers/main.js',
        new RegExp('module\\(\'' + appName + 'App\'')
      );
      helpers.assertFileContent(
        'test/spec/controllers/main.js',
        new RegExp('module\\(\'' + appName + 'App\'')
      );

      helpers.assertFileContent(
        'src/index.html',
        new RegExp('ng-src=\"' + appName + 'App\"')
      );
      done();
    });
  });
});
