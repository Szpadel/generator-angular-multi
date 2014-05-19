/*global describe, before, it, beforeEach */
'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;
var _ = require('underscore.string');

describe('Angular generator', function () {
  var angular;
  var expected = [
    'src/.htaccess',
    'src/404.html',
    'src/favicon.ico',
    'src/robots.txt',
    'src/styles/main.scss',
    'src/views/main.html',
    'src/index.html',
    '.bowerrc',
    '.editorconfig',
    '.gitignore',
    '.jshintrc',
    'Gruntfile.js',
    'package.json',
    'bower.json'
  ];
  var mockPrompts = {
    compass: true,
    bootstrap: true,
    compassBootstrap: true,
    modules: []
  };
  var genOptions = {
    'skip-install': true,
    'skip-welcome-message': true,
    'skip-message': true
  };

  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'tmp'), function (err) {
      if (err) {
        done(err);
      }
      angular = helpers.createGenerator(
        'angular:app',
        [
          '../../src',
          '../../common',
          '../../controller',
          '../../main', [
            helpers.createDummyGenerator(),
            'karma:app'
          ]
        ],
        false,
        genOptions
      );
      helpers.mockPrompt(angular, mockPrompts);

      done();
    });
  });

  describe('App files', function () {
    it('should generate dotfiles', function (done) {
      angular.run({}, function () {
        helpers.assertFile(expected);
        done();
      });
    });

    it('creates expected JS files', function (done) {
      angular.run({}, function() {
        helpers.assertFile([].concat(expected, [
          'src/scripts/src.js',
          'src/scripts/controllers/main.js',
          'test/spec/controllers/main.js'
        ]));
        done();
      });
    });

    it('creates CoffeeScript files', function (done) {
      angular.env.options.coffee = true;
      angular.run([], function () {
        helpers.assertFile([].concat(expected, [
          'src/scripts/src.coffee',
          'src/scripts/controllers/main.coffee',
          'test/spec/controllers/main.coffee'
        ]));
        done();
      });
    });
  });

  describe('Service Subgenerators', function () {
    var generatorTest = function (generatorType, specType, targetDirectory, scriptNameFn, specNameFn, suffix, done) {
      var name = 'foo';
      var deps = [path.join('../..', generatorType)];
      var genTester = helpers.createGenerator('angular:' + generatorType, deps, [name], genOptions);

      angular.run([], function () {
        genTester.run([], function () {
          helpers.assertFileContent([
            [
              path.join('src/scripts', targetDirectory, name + '.js'),
              new RegExp(
                generatorType + '\\(\'' + scriptNameFn(name) + suffix + '\'',
                'g'
              )
            ],
            [
              path.join('test/spec', targetDirectory, name + '.js'),
              new RegExp(
                'describe\\(\'' + _.classify(specType) + ': ' + specNameFn(name) + suffix + '\'',
                'g'
              )
            ]
          ]);
          done();
        });
      });
    };

    it('should generate a new controller', function (done) {
      generatorTest('controller', 'controller', 'controllers', _.classify, _.classify, 'Ctrl', done);
    });

    it('should generate a new directive', function (done) {
      generatorTest('directive', 'directive', 'directives', _.camelize, _.camelize, '', done);
    });

    it('should generate a new filter', function (done) {
      generatorTest('filter', 'filter', 'filters', _.camelize, _.camelize, '', done);
    });

    ['constant', 'factory', 'provider', 'value'].forEach(function(t) {
      it('should generate a new ' + t, function (done) {
        generatorTest(t, 'service', 'services', _.camelize, _.camelize, '', done)
      });
    });

    it('should generate a new service', function (done) {
      generatorTest('service', 'service', 'services', _.capitalize, _.capitalize, '', done)
    });
  });

  describe('View', function () {
    it('should generate a new view', function (done) {
      var angularView;
      var deps = ['../../view'];
      angularView = helpers.createGenerator('angular:view', deps, ['foo'], genOptions);

      helpers.mockPrompt(angularView, mockPrompts);
      angularView.run([], function () {
        helpers.assertFile(['src/views/foo.html']);
        done();
      });
    });

    it('should generate a new view in subdirectories', function (done) {
      var angularView;
      var deps = ['../../view'];
      angularView = helpers.createGenerator('angular:view', deps, ['foo/bar'], genOptions);

      helpers.mockPrompt(angularView, mockPrompts);
      angularView.run([], function () {
        helpers.assertFile(['src/views/foo/bar.html']);
        done();
      });
    });
  });
});
