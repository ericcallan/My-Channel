module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

      uglify: {
        dev: {
          options: {
            beautify: true,
            mangle: false
          },
          files: {
            "public/js/main.js": "build/js/main.js"
          },
        },
        prod: {
          options: {
            beautify: true,
            banner: '/*! last updated <%= grunt.template.today("yyyy-mm-dd") %> */\n',
            mangle: {
              except:['jQuery'],
            }
          },
          files: {
            "public/js/main.js": "build/js/main.js"
          },
        },
      },

      // image optimazations
      imagemin: {                          // Task
        dev: {                         // Another target
          options: {                       // Target options
            optimizationLevel: 1,
            pngquant: true
          },
          files: [{
            expand: true,                  // Enable dynamic expansion
            cwd: 'build/img',                   // Src matches are relative to this path
            src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
            dest: 'public/img/'                  // Destination path prefix
          }]
        }
      },

      jshint: {
        files: ['build/js/*.js'],
        options: {
          curly: true,
          eqeqeq: true,
          eqnull: true,
          browser: true,
          globals: {
            jQuery: true
          }
        }
      },

      svgmin: {                       // Task
        options: {                  // Configuration that will be passed directly to SVGO
            plugins: [{
                removeViewBox: false
            }]
        },
        dev: {                     // Target
            files: [{               // Dictionary of files
                expand: true,       // Enable dynamic expansion.
                cwd: 'build/img',     // Src matches are relative to this path.
                src: ['**/*.svg'],  // Actual pattern(s) to match.
                dest: 'public/img/',       // Destination path prefix.
                ext: '.svg'     // Dest filepaths will have this extension.
                // ie: optimise img/src/branding/logo.svg and store it in img/branding/logo.min.svg
            }]
          }
      },

      cssmin: {
        add_banner: {
          options: {
            banner: '/* updated <%= grunt.template.today("yyyy-mm-dd") %> */'
          },
          files: {
            'public/stylesheets/screen.css': ['stylesheets/*.css']
          }
        }
      },

      compass: {                  // Task
        default: {                    // Another target
          options: {
            config: 'config.rb'
          }
        }
      },

      validation: {
        options: {
                reset: grunt.option('reset') || false,
                stoponerror: false,
                relaxerror: ["Bad value X-UA-Compatible for attribute http-equiv on element meta."]
        },
        files: {
                src: ['public/**/*.html','! node_modules/**/*.html']
        }
      },
      nodemon: {
        dev: {
          script: 'bin/dev',
          ignore: ['node_modules/**', 'public/js/**']
        }
      },
      copy: {
        main:{
          files:[
            {
              expand: true,
              flatten: true,
              src: ['build/js/**'],
              dest: 'public/js/',
              filter:'isFile'},
          ],
        },
      },
      browserify: {
        dist: {
          options: {
            transform: [["babelify", { "stage": 0 }]]
          },
          files: {
            "public/js/main.js": "build/js/main.js"
          }
        }
      },

      watch: {
        options: {
          livereload: true,
        },
        html:{
          files: ['public/**/*.html'],
          tasks: ['build'],
        },
        js:{
          files: ['build/**/*.js'],
          tasks: ['browserify'],
        },
        sass:{
          options:{
            livereload: false,
          },
          files: ['build/sass/**/*.scss'],
          tasks: ['compass'],
        },
        img:{
          files: ['build/img/**/*.img'],
          tasks: ['images'],
        },
        css:{
          files: ['public/stylesheets/**/*.css'],
          tasks:[],
        }
      }
  });

  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-html-validation');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('images', [], function () {
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-svgmin');
    grunt.task.run('newer:imagemin','newer:svgmin');
  });

  // Default tasks
  grunt.registerTask('build', ['images','compass','uglify:dev']);
  grunt.registerTask('prod', ['imagemin','svgmin','compass','cssmin','uglify:prod']);


  // Custom tasks
  grunt.registerTask("validate", ['validation']);
  grunt.registerTask("img", ['imagemin','svgmin']);

  //watchs
  grunt.registerTask('watchSetBuild', ['watch:set1','watch:set2']);


  // run grunt watch to run build every time a file changes
  // grunt.event.on('watch', function(action, filepath) {
  //   grunt.log.writeln(filepath + ' has ' + action);
  // });

};
