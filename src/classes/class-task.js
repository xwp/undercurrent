const path = require( 'path' );
const gulp = require( 'gulp' );
const { log, colors } = require( 'gulp-util' );
const config = require( '../setup/config' );

const Task = class {

	/**
	 * Constructor.
	 *
	 * @param {String} name The task name.
	 * @param {Array} paths The required paths.
	 * @param {Object} settings The task settings (defined in the schema).
	 */
	constructor( name, paths, settings ) {
		this.name = name;
		this.settings = settings;

		this.paths = {
			required: paths,
			invalid: []
		};

		this.series = false;
	}

	/**
	 * Runs the Gulp task or throws a message that the task is "skipped".
	 *
	 * @param {Function} callback The callback function to run.
	 *
	 * @returns {Void} Fires the callback or prints a message.
	 */
	run( callback ) {

		// First validate paths exist.
		if ( this.paths.required.every( p => this.valadatePaths( p ) ) ) {
			if ( this.series ) {
				gulp.task( this.name, gulp.series( this.series ) );
			} else {
				gulp.task( this.name, ( done ) => callback( done ) );
			}
		} else {
			gulp.task( this.name, ( done ) => {
				log( `Skipping '${ colors.cyan( this.name ) }'... required settings do not exist in the workflow schema: ${ colors.red( this.paths.invalid.join( ', ' ) ) }` );
				done();
			} );
		}
	}

	/**
	 * Validates the required paths.
	 *
	 * @param {String} p The required element.
	 *
	 * @return {Boolean} False if the path is not defined, otherwise true.
	 */
	valadatePaths( p ) {
		if ( undefined === this.settings[ p ] ) {
			this.paths.invalid.push( p );
			return false;
		} else {
			return true;
		}
	}

	/**
	 * Sets the current working path for the task.
	 *
	 * @param {String} current The current path localized to the workflow.
	 *
	 * @return {String} The full path.
	 */
	currentWorkingPath( current ) {
		return path.resolve( config.root, config.workflow.cwd, current );
	}

	/**
	 * Combines the source using the full path to the project root.
	 */
	get src() {
		return this.currentWorkingPath( this.settings.src );
	}

	/**
	 * Combines the destination using the full path to the project root.
	 */
	get dest() {
		return this.currentWorkingPath( this.settings.dest );
	}

	/**
	 * Checks if settings includes base and, if so, combines the base with the
	 * workflow current working directory.
	 */
	get base() {
		return undefined === this.settings.base ? '' : path.join( config.workflow.cwd, this.settings.base ) ;
	}

	/**
	 * Get the current task's cache name.
	 */
	get cacheName() {
		return `${ this.name }-task-cache`;
	}
};

module.exports = Task;
