const gulp = require( 'gulp' );
const gulpif = require( 'gulp-if' );
const cache = require( 'gulp-cached' );
const Task = require( '../classes/class-task.js' );
const { isDev, schema } = require( '../setup/config' );

const task = new Task ( 'copy', [ 'src', 'dest', 'base' ], schema.copy );

task.run( ( done ) => {
	gulp.src( task.src, { base: task.base } )
		.pipe( gulpif( isDev, cache( task.cacheName, { optimizeMemory: false } ) ) )
		.pipe( gulp.dest( task.dest ) );

	done();
} );
