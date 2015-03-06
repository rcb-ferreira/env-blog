'use strict';

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    // Config
    var ghunt = {
        port: '2368'    // Ghost Port #
    };

    var _banner = '/** \n* Package: <%= pkg.name %> \n* Author: <%= pkg.author %> \n* Build Time: <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %>  \n*/\n';

    grunt.initConfig({

        ghunt: ghunt,

        pkg: grunt.file.readJSON('package.json'),

        watch: {
            css: {
                files: 'src/assets/less/*.less',
                tasks: ['less','cssmin'],
                options: {
                    interrupt: true,
                    livereload: true
                },
            },
            scripts: {
                files: 'src/assets/js/*.js',
                options:{
                    livereload: true
                }
            },
            html: {
                files: ['src/*.hbs', 'src/partials/*.hbs'],
                options: {
                    livereload: true
                }
            },
            livereload: {
                options: {
                    livereload: true
                },
                files: 'src/less/*.less',
            }
        },

        cssmin: {
            options: {
                banner: _banner,
            }, // close .options
            build: {
                files: [{
                    cwd: 'src/assets/css',
                    expand: true,
                    src: ['*.css'],
                    dest: 'assets/css/',
                    ext: '.min.css'
                }]
            }, // close .build
        }, // close cssmin

        less: {
            options: {
                banner: _banner
            },
            build: {
                files: [{
                    cwd: 'src/assets/less',
                    expand: true,
                    src: ['style.less'],
                    dest: 'src/assets/css/',
                    ext: '.css'
                }]
            }, // close .build
        }, // close less

        // Rename files for browser caching purposes
        rev: {
            release: {
                files: {
                    src: [
                        'assets/css/vendor.css',
                        'assets/images/background/*.{gif,jpeg,jpg,png,svg}',
                        'assets/fonts/{,*/}*.*',
                        'assets/js/{,*/}*.js'
                    ]
                }
            }
        },

        // The following *-min tasks produce minified files in the release folder
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/assets/images',
                    src: '{,*/}*.{gif,jpeg,jpg,png}',
                    dest: 'assets/images'
                }]
            }
        },

        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/assets/images',
                    src: '{,*/}*.svg',
                    dest: 'assets/images'
                }]
            }
        },

        concurrent: {
            release: [
                'clean:release',
                'less',
                'imagemin',
                'svgmin'
            ]
        },

        // Open ghost page for development
        open: {
            dev: {
                path: 'http://127.0.0.1:<%= ghunt.port %>'
            }
        }

    });

    // livereload for development mode
    grunt.registerTask('watch', [
        'less',
        'cssmin',
        'watch'
    ]);

    grunt.registerTask('build', [
        'less',
        'cssmin'
    ]);

};
