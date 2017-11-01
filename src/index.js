/**
 * Our main entry file for the Webpack build.
 *
 * @package Undercurrent
 */

const gulp = require( 'gulp' );
const { cwd } = require( 'yargs' ).argv;
const { log, colors } = require( 'gulp-util' );

// If cwd is undefined, throw an error and bail.
if ( undefined === cwd ) {
	let error = new Error( `Current working directory (cwd) argument is undefined. Script requires a --cwd argument set to $(npm prefix) before running.` );
	console.error( error.stack ); // eslint-disable-line no-console
	process.exit( 1 ); // eslint-disable-line no-magic-numbers
}

// We should have all the information we need to get started.
const config = require( './setup/config' );
const tasks = require( './setup/tasks' );

log( `Using ${ colors.yellow( config.workflow.name ) } workflow...` );
log( `Using ${ colors.yellow( config.env ) } environment...` );

gulp.task( 'default', gulp.series( tasks ) );
