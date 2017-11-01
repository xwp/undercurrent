const fs = require( 'fs' );
const path = require( 'path' );
const gulp = require( 'gulp' );
const config = require( './config' );

const tasks = [];
const series = {
	before: [],
	default: [],
	after: []
};

for ( let task in config.schema ) {

	// Check if this task is supposed to run in the current environment.
	if ( undefined !== config.schema[ task ].env && ! config.env.includes( config.schema[ task ].env ) ) {
		continue;
	}

	// Check if we should use a custom task, the default task or skip this task.
	if ( undefined !== config.workflow.tasks && fs.existsSync( path.resolve( config.root, config.workflow.tasks, `${task}.js` ) ) ) {
		require( path.resolve( config.root, config.workflow.tasks, `${task}.js` ) ); // eslint-disable-line global-require
	} else if ( fs.existsSync( path.resolve( __dirname, '../tasks', `${task}.js` ) ) ) {
		require( path.resolve( __dirname, '../tasks', `${task}.js` ) ); // eslint-disable-line global-require
	} else {

		// Log a notice that no task was found, but is included in schema.
		continue;
	}

	// If a specific series is defined, use it.
	if ( undefined !== config.schema[ task ].series ) {
		if ( series.hasOwnProperty( config.schema[ task ].series ) ) {
			series[ config.schema[ task ].series ].push( task );
		} else {
			continue;
		}
	} else {
		series.default.push( task );
	}

}

for ( let order in series ) {

	// Skip series with no tasks.
	if ( 0 === series[ order ].length ) {
		continue;
	}

	tasks.push( gulp.parallel( series[ order ] ) );
}

module.exports = tasks;
