/* eslint-disable no-process-env */
/**
 * Sets up the Configuration object.
 *
 * @package Undercurrent
 */

const pkg = require( './package' );
const workflow = require( './workflow' );
const schema = require( './schema' );
let { cwd } = require( 'yargs' ).argv;

const config = {
	workflow,
	schema,
	pkg,
	root: cwd,
	env: process.env.NODE_ENV,
	isDev: /^dev/ig.test( process.env.NODE_ENV ),
	isProd: /^prod/ig.test( process.env.NODE_ENV ),
};

module.exports = config;
