module.exports = function(grunt) {

  var files = ['src/widgets/modal.js', 'src/widgets/button.js',
    'src/widgets/popover.js', 'src/widgets/tab.js',
    'src/vendor/snap.min.js'
    ]
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      // build: {
      //   src: 'src/<%= pkg.name %>.js',
      //   dest: 'build/<%= pkg.name %>.min.js'
      // },
      release: {
        files: {'dest/<%= pkg.name %>.min.js': files }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};
