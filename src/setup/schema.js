/**
 * Gets the schema provided by the user, if one exists. If no custom schema
 * it uses the default schema.
 *
 * @exports object
 */

const fs = require( 'fs' );
const path = require( 'path' );
const workflow = require( './workflow' );
const { cwd } = require( 'yargs' ).argv;

let schema = path.resolve( __dirname, '../schema/default.json' );

// If no workflow argument is provided, set workflow to default.
if ( workflow.schema !== undefined && fs.existsSync( path.resolve( cwd, workflow.schema ) ) ) {
	schema = path.resolve( cwd, workflow.schema );
}

module.exports = JSON.parse( fs.readFileSync( schema ) );
