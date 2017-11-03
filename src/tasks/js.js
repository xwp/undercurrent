const path = require( 'path' );
const { log, colors } = require( 'gulp-util' );
const webpack = require( 'webpack' );
const browserslist = require( 'browserslist' );
const redent = require( 'redent' );
const { removeEmpty } = require( 'webpack-config-utils' );
const Task = require( '../classes/class-task.js' );
const { isDev, isProd, schema, root } = require( '../setup/config' );

const task = new Task ( 'js', [ 'src', 'dest', 'base', 'entry' ], schema.js );

task.run( ( done ) => {
	const redentCount = 11;
	const webpackConfig = {
		context: path.resolve( root, task.base ),
		entry: schema.js.entry,
		cache: true,

		output: {
			filename: '[name].js',
			path: path.resolve( root, task.dest ),
			pathinfo: isDev
		},

		stats: {
			colors: true,
			modules: true,
			version: false
		},

		devtool: isProd ? 'source-map' : 'inline-source-map',

		resolveLoader: {
			modules: [ path.resolve( __dirname, '../../../' ) ]
		},

		watch: isDev,

		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: [ {
						loader: 'babel-loader',
						options: {
							presets: [ [
								path.resolve( __dirname, '../../../', 'babel-preset-env' ),
								{
									targets: {
										browsers: browserslist()
									}
								}
							] ]
						}
					}, {
						loader: 'eslint-loader',
						options: {
							failOnError: Boolean( isProd ),
							emitWarning: true,
							configFile: path.resolve( __dirname, '../../.eslintrc.js' )
						}
					} ]
				}
			]
		},

		plugins: removeEmpty( [
			isProd ? new webpack.optimize.UglifyJsPlugin() : undefined
		] )
	};

	if ( isDev ) {
		log( `Webpack is running ${ colors.cyan( 'watch' )} mode.` );
	}

	webpack( webpackConfig, ( err, stats ) => {
		log( `Webpack build complete.\n${ redent( stats.toString( webpackConfig.stats ), redentCount ) }` );

		if ( isProd ) {
			done();
		}

		if ( err || stats.hasErrors() ) {

			// TODO: Log errors when Webpack fails.
			done();
		}
	} );
} );
