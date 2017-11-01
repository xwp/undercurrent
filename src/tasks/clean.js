const del = require( 'del' );
const Task = require( '../classes/class-task.js' );
const { schema } = require( '../setup/config' );

const task = new Task ( 'clean', [ 'src' ], schema.clean );

task.run( done => {
	del( task.src ).then( () => done() );
} );
