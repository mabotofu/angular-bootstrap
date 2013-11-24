module.exports = function (grunt) {
    "use strict";

    var cfg = grunt.file.readJSON("config.json");

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        cfg: cfg,
        bower: {
            install: {
                options: {
                    targetDir: "<%= cfg.src_dir %>/vendor",
                    layout: "byComponent",
                    install: true,
                    verbose: false,
                    cleanTargetDir: true,
                    cleanBowerDir: true
                }
            }
        },

        copy: {
            js: {
                expand: true,
                cwd: "<%= cfg.src_dir %>",
                src: ["**/*.js"],
                dest: "<%= cfg.build_dir %>"
            },

            "img_dev": {
                expand: true,
                flatten: true,
                cwd: "<%= cfg.src_dir %>/",
                src: ["**/*.{jpg,png,gif,icon}"],
                dest: "<%= cfg.build_dir %>/<%= cfg.img_dir %>"
            },

            "img_prod": {
                expand: true,
                flatten: true,
                cwd: "<%= cfg.build_dir %>/",
                src: ["**/*.{jpg,png,gif,icon}"],
                dest: "<%= cfg.prod_dir %>/<%= cfg.img_dir %>"
            }
        },

        concat: {
            "prod_js": {
                options: {
                    separator: ";"
                },
                src: cfg.js.dev.map(function (file) {
                    return cfg.build_dir + "/" + file;
                }),
                dest: "<%= cfg.prod_dir %>/<%= cfg.js_final %>"
            }
        },

        connect: {
            dev: {
                options: {
                    port: 9001,
                    base: "<%= cfg.build_dir %>"
                }
            },
            prod: {
                options: {
                    keepalive: true,
                    port: 9001,
                    base: "<%= cfg.prod_dir %>"
                }
            },
            test: {
                options: {
                    port: 9876
                }
            }
        },

        clean: {

            js: {
                src: ["<%= cfg.build_dir %>/**/*.js"]
            },

            img: {
                src: ["<%= cfg.build_dir %>/img"]
            },

            css: {
                src: ["<%= cfg.build_dir %>/**/*.css"]
            },

            html: {
                src: ["<%= cfg.build_dir %>/**/*.html"]
            },

            dev: {
                src: ["<%= cfg.build_dir %>"]
            },

            prod: {
                src: ["<%= cfg.prod_dir %>"]
            }
        },

        karma: {
            unit: {
                configFile: "karma.conf.js",
                autoWatch: false,
                background: true
//                singleRun: true
            },
            unit_auto: {
                configFile: "karma.conf.js",
                autoWatch: true,
                background: true,
                singleRun: false
            }
        },

        uglify: {
            prod: {
                src: "<%= cfg.prod_dir %>/app.js",
                dest: "<%= cfg.prod_dir %>/app.js"
            }
        },

        html2js: {
            main: {
                src: ["<%= cfg.src_dir %>/**/*.tpl.html"],
                dest: "<%= cfg.build_dir %>/templates.js"
            }
        },

        ngmin: {
            all: {
                expand: true,
                cwd: "<%= cfg.build_dir %>",
                src: ["**/*.js"],
                dest: "<%= cfg.build_dir %>"
            }
        },

        watch: {

            options: {
                nospawn: true
            },

            js: {
                files: [
                    "<%= cfg.src_dir %>/**/*.js",
                    "!<%= cfg.src_dir %>/**/*.spec.js"
                ],
                tasks: [
                    "clean:js",
                    "copy:js",
                    "html2js",
                    "index:dev"
                ]
            },

            img: {
                files: ["<%= cfg.src_dir %>/img"],
                tasks: [
                    "clean:img",
                    "copy:img_dev"
                ]
            },

            css: {
                files: ["<%= cfg.src_dir %>/**/*.{less,css}"],
                tasks: [
                    "clean:css",
                    "less:dev",
                    "index:dev"
                ]
            },

            html: {
                files: ["<%= cfg.src_dir %>/**/*.tpl.html"],
                tasks: [
                    "html2js"
                ]
            },

            index: {
                files: [
                    "<%= cfg.src_dir %>/index.html",
                    "config.json"
                ],
                tasks: ["index:dev"]
            },

            karma: {
                files: ["<%= cfg.src_dir %>/**/*.js"],
                tasks: ["karma:unit:run"],
                options: {
                    debounceDelay: 1000
                }
            }

        },

        index: {
            dev: {
                srcFile: "<%= cfg.src_dir %>/index.html",
                cwd: "<%= cfg.build_dir %>",
                src: [cfg.js.dev || [], cfg.css.dev || []],
                destDir: "<%= cfg.build_dir %>"
            },
            prod: {
                srcFile: "<%= cfg.src_dir %>/index.html",
                cwd: "<%= cfg.prod_dir %>",
                src: [cfg.js.prod || [], cfg.css.prod || []],
                destDir: "<%= cfg.prod_dir %>"
            }
        },

        htmlmin: {
            prod: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    "<%= cfg.prod_dir %>/index.html": "<%= cfg.prod_dir %>/index.html"
                }
            }
        },

        less: {

            dev: {
                options: {
                    dumpLineNumbers: "comments"
                },
                files: {
                    "<%= cfg.build_dir %>/<%= cfg.css_final %>": "<%= cfg.src_dir %>/<%= cfg.main_less %>"
                }
            },
            prod: {
                options: {
                    cleancss: true,
                    compress: true
                },
                files: {
                    "<%= cfg.prod_dir %>/<%= cfg.css_final %>": "<%= cfg.src_dir %>/<%= cfg.main_less %>"
                }
            }
        }

    });


    grunt.loadNpmTasks("grunt-bower-task");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-htmlmin");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-html2js");
    grunt.loadNpmTasks("grunt-ngmin");
    grunt.loadNpmTasks("grunt-karma");

    grunt.registerMultiTask("index", "Process index.html template", function () {
        var
            taskCfg = this.data,
            files = {};

        this.filesSrc.forEach(function (fileName) {
            var ext = fileName.split(".").pop();
            files[ext] = files[ext] || [];
            files[ext].push(fileName);
        });

        grunt.file.copy(taskCfg.srcFile, taskCfg.destDir + "/index.html", {
            process: function (contents, path) {
                return grunt.template.process(contents, {
                    data: {
                        files: files,
                        version: grunt.config("pkg.version")
                    }
                });
            }
        });
    });

    grunt.registerTask("build", [
        "clean:dev",
        "html2js",
        "copy:js",
        "copy:img_dev",
        "less:dev",
        "index:dev"
    ]);

    grunt.registerTask("default", [
        "build",
        "connect:dev",
        "test:unit",
        "watch"
    ]);

    grunt.registerTask("compile", [
        "clean:prod",
        "build",
        "ngmin",
        "concat",
        "uglify",
        "less:prod",
        "index:prod",
        "htmlmin:prod",
        "copy:img_prod"
    ]);

    grunt.registerTask("test:unit", ["karma:unit"]);
    grunt.registerTask("test:unit_auto", ["karma:unit_auto"]);

};