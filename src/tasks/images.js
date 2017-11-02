const gulp = require( 'gulp' );
const gulpif = require( 'gulp-if' );
const cache = require( 'gulp-cached' );
const imagemin = require( 'gulp-imagemin' );
const Task = require( '../classes/class-task.js' );
const { isDev, schema } = require( '../setup/config' );

const task = new Task ( 'images', [ 'src', 'dest' ], schema.images );

task.run( () => {
	return gulp.src( task.src, { base: task.base } )
		.pipe( gulpif( isDev, cache( task.cacheName, { optimizeMemory: false } ) ) )
		.pipe( imagemin() )
		.pipe( gulp.dest( task.dest ) );
} );
