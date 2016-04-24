module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    less: {
      development: {
        files: {
          'stylesheet/style.css': 'stylesheet/style.less'
        }
      },
    },
    watch: {
      scripts: {
        files: 'stylesheet/*.less',
        tasks: ['less:development'],
        options: {
          interrupt: true,
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');

  // Default task(s).
  grunt.registerTask('default', ['less', 'watch']);

};
