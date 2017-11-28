// For performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all sub-folders, use:
// 'test/spec/**/*.js'

'use strict';

module.exports = function (grunt) {

  var autoprefixer = require('autoprefixer')({
      browsers: [
        'Chrome >= 35',
        'Firefox >= 31',
        'Edge >= 12',
        'Explorer >= 9',
        'iOS >= 8',
        'Safari >= 8',
        'Android 2.3',
        'Android >= 4',
        'Opera >= 12'
      ]
    }),
    cssnano = require('cssnano')();

  grunt.initConfig({

    //-----------------------------------------------------------------------------------------------IMPORT-package.json


    pkg: grunt.file.readJSON('package.json'),


    //-----------------------------------------------------------------------------------------------------CONFIG-OBJECT


    config: {
      src: {
        root: 'src',
        fonts: '<%= config.src.root %>/fonts/{,*/}*.{woff,woff2,ttf,eot,svg}',
        html: '<%= config.src.root %>/pug',
        images: '<%= config.src.root %>/images/',
        scripts: '<%= config.src.root %>/scripts/{,*/}*.js',
        sass: '<%= config.src.root %>/sass',
        less: '<%= config.src.root %>/less'
      },
      dist: {
        root: 'dist',
        fonts: '<%= config.dist.root %>/fonts',
        html: '<%= config.dist.root %>/',
        images: '<%= config.dist.root %>/img',
        scripts: '<%= config.dist.root %>/js',
        styles: '<%= config.dist.root %>/css',
        assets: '<%= config.dist.root %>/assets'
      }
    },


    //--------------------------------------------------------------------------------------------------------CLEAN-DIST


    clean: {
      dist: ['<%= config.dist.root %>']
    },


    //---------------------------------------------------------------------------------------------------------SASS/SCSS

    // grunt-contrib-sass (need to be installed)
    sass: {
      development: {
        options: {
          sourcemap: 'none',
          style: 'compact', // nested, compact, compressed, expanded
          quiet: true,
        },
        files: [{
          expand: true,
          cwd: '<%= config.src.sass %>',
          src: ['{,*!/}*.{scss,sass}'],
          dest: '<%= config.dist.styles %>',
          ext: '.css'
        }]
      }
    },

    less: {
        development: {
          options: {
            paths: ['<%= config.src.styles %>'],
            modifyVars: {
              configEnv: 'development',
            }
          },
          files: {
            '<%= config.dist.styles %>/main.css': '<%= config.src.less %>/main.less'
          }
        },
        stage: {
          options: {
            paths: ['<%= config.src.styles %>'],
            modifyVars: {
              configEnv: 'stage',
            }
          },
          files: {
            '<%= config.dist.styles %>/main.css': '<%= config.src.less %>/main.less'
          }
        }
    },

    //---------------------------------------------------------------------------------------------------------UGLIFY-JS


    uglify: {
      options: {sourceMap: true},
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.src.root %>/scripts/',
          src: ['{,*/}*.js', '!{,*/}*.min.js'],
          dest: '<%= config.dist.scripts %>',
          ext: '.min.js'
        }]
      }
    },


    //----------------------------------------------------------------------------------------------------------JADE/PUG


    pug: {
      dist: {
        options: {
          pretty: '    ',
          //data: {debug: false, timestamp: '<%= grunt.template.today("yyyy-mm-dd hh:mm:ss") %>'},
          data: function(dest, src) {
            // Return an object of data to pass to templates
            return require('./src/pug/data/globals.json');
          }
        },
        files: [{
          expand: true,
          cwd: '<%= config.src.html %>',
          dest: '<%= config.dist.html %>',
          src: ['{,*/}*.{pug,jade,htm,html,php}', '!{,*/}/_*.{pug,jade,htm,html,php}'],
          ext: '.html'
        }]
      }
    },

    //---------------------------------------------------------------------------------------------------------MODERNIZR


    modernizr: {
      dist: {
        crawl: false,
        customTests: [],
        // Avoid unnecessary builds
        cache: true,
        // Path to the build you're using for development.
        devFile: false,
        dest: '<%= config.dist.scripts %>/modernizr.js',
        options: [
          'domPrefixes',
          'prefixes',
          'prefixed',
          'testAllProps',
          'testProp',
          'testStyles',
          'html5shiv',
          'setClasses'
        ],
        uglify: true,
        tests: [
          'cssanimations', 'csstransitions', 'flexbox', 'flexboxlegacy'

          /*'applicationcache', 'audio', 'canvas', 'canvastext', 'geolocation', 'hashchange', 'history', 'indexeddb',
          'svg', 'touchevents', 'video', 'webgl', 'websockets', 'cssanimations', 'backgroundsize', 'bgsizecover',
          'boxshadow', 'csscolumns', 'ellipsis', 'cssfilters', 'flexbox', 'flexboxlegacy', 'flexboxtweener', 'flexwrap',
          'fontface', 'generatedcontent', 'cssgradients', 'hsla', 'multiplebgs', 'opacity', 'cssreflections',
          'cssremunit', 'rgba', 'textshadow', 'csstransforms', 'csstransforms3d', 'csstransitions', 'localstorage',
          'sessionstorage', 'websqldatabase', 'svgclippaths', 'svgfilters', 'inlinesvg', 'videoautoplay', 'webworkers'*/
        ]
      }
    },

    //--------------------------------------------------------------------------------------------------------------COPY

    copy: {
      main: {
        expand: true,
        cwd: '<%= config.src.root %>/assets',
        src: '**',
        dest: '<%= config.dist.root %>/',
      },
    },

    //-------------------------------------------------------------------------------------------------------------WATCH


    watch: {
      sass: {
        files: '<%= config.src.sass %>/**/*.scss',
        tasks: ['sass:development'],
        options: {
          spawn: false,
        },
      },
      less: {
        files: '<%= config.src.less %>/**/*.less',
        tasks: ['less:development'],
        options: {
          spawn: false,
        },
      },
      js: {
        files: '<%= config.src.scripts %>',
        tasks: ['uglify'],
        options: {
          spawn: false,
        },
      },
      html: {
        files: '<%= config.src.html %>/**/*.{pug,jade,htm,html,php,json}',
        tasks: ['pug:dist'],
        options: {
          spawn: false,
        },
      },
    },

  });


  //------------------------------------------------------------------------------------------------------LOAD-NPM-TASKS


  // load npm tasks, these plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt, {
    scope: 'devDependencies',
    pattern: ['grunt-*']
  });


  //------------------------------------------------------------------------------------------------------REGISTER-TASKS


  // Default task
  grunt.registerTask('default', [
    'clean', 'sass:development', 'uglify', 'modernizr', 'copy:main', 'pug', 'watch'
  ]);
  // Stage task for stage environement
  grunt.registerTask('stage', [
    'clean', 'sass:stage', 'uglify', 'modernizr', 'copy:main', 'pug'
  ]);

};