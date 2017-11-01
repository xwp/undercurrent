/**
 * Gets the package.json from the current working directory and converts it to
 * an object.
 *
 * @exports object
 */

const fs = require( 'fs' );
const path = require( 'path' );
let { cwd } = require( 'yargs' ).argv;

const pkg = path.resolve( cwd, 'package.json' );

if ( ! fs.existsSync( pkg ) ) {
	let error = new Error( `The main package.json file could not be found.` );
	console.error( error.stack ); // eslint-disable-line no-console
	process.exitCode = 1;
}

module.exports = JSON.parse( fs.readFileSync( pkg ) );
