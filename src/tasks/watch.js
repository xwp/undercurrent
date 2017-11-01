const path = require( 'path' );
const gulp = require( 'gulp' );
const Task = require( '../classes/class-task.js' );
const { schema, root, workflow } = require( '../setup/config' );

const task = new Task ( 'watch', [], schema.watch );

task.run( () => {
	task.settings.tasks.map( ( name ) => {
		if ( schema.hasOwnProperty( name ) ) {
			gulp.watch( path.resolve( root, workflow.cwd, schema[ name ].src ), gulp.parallel( name ) );
		}
	} );
} );
