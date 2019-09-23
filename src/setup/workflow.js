/**
 * Gets the current workflow argument and sets up the workflow object. If no
 * workflow is provided as an argument, it falls back to default workflow.
 *
 * @exports object
 */

const pkg = require( './package' );
const { workflow } = require( 'yargs' ).argv;

let flow = {
	cwd: './assets',
	name: 'default',
};

// Check if pkg.workflows is defined, an object and has workflow as object key.
if ( workflow !== undefined && undefined !== pkg.workflows && 'object' === typeof pkg.workflows && pkg.workflows.hasOwnProperty( workflow ) ) {
	flow = pkg.workflows[ workflow ];
	flow.name = workflow;
}

module.exports = flow;
