const path = require( 'path' );
const gulp = require( 'gulp' );
const { colors } = require( 'gulp-util' );
const gulpif = require( 'gulp-if' );
const cache = require( 'gulp-cached' );
const progeny = require( 'gulp-progeny' );
const sass = require( 'gulp-sass' );
const sourcemaps = require( 'gulp-sourcemaps' );
const postcss = require( 'gulp-postcss' );
const reporter = require( 'postcss-reporter' );
const redent = require( 'redent' );
const scss = require( 'postcss-scss' );
const stylelint = require( 'stylelint' );
const cssnext = require( 'postcss-preset-env' );
const pxtorem = require( 'postcss-pxtorem' );
const autoprefixer = require( 'autoprefixer' );
const assets = require( 'postcss-assets' );
const Task = require( '../classes/class-task.js' );
const { isDev, schema, root, pkg } = require( '../setup/config' );

// Set the preprocessors.
let postcssProcessors = {
	cssnext,
	pxtorem,
	autoprefixer,
	assets,
};

const task = new Task( 'css', [ 'src', 'dest', 'base' ], schema.css );

task.run( () => {
	const redentCount = 11;
	const positionPad = 8;

	return gulp.src( task.src, { base: task.base } )

		// Caching and incremental building (progeny) in Gulp.
		.pipe( gulpif( isDev, cache( task.cacheName ) ) )
		.pipe( gulpif( isDev, progeny() ) )

		// Lint when enableLinter is on.
		.pipe( gulpif( task.settings.enableLinter,
			postcss( [
				stylelint( {
					configFile: path.resolve( __dirname, '../../.stylelintrc.js' ),
					configOverrides: undefined !== pkg.stylelint ? pkg.stylelint : {},
				} ),
				reporter( {
					clearAllMessages: true,
					formatter: ( input ) => {
						let output = `${ colors.yellow( 'WARNING in', input.source.replace( root, '.' ) ) }\n\n`;

						output += `${ colors.yellow( input.source ) }\n`;

						for ( let { line, column, text, type, rule } of input.messages ) {
							let position = `${ line }:${ column }`.padEnd( positionPad );

							output += ` ${ colors.dim.red( position ) }${ colors.red( type.padEnd( positionPad ) ) } ${ text.replace( `(${ rule })`, colors.dim.grey( rule ) ) }\n`;
						}

						return redent( `\n${ output }\n`, redentCount );
					},
				} ),
			], { syntax: scss } ),
		) )

		// Actual SASS compilation.
		.pipe( gulpif( isDev, sourcemaps.init() ) )
		.pipe( sass( {
			includePaths: schema.css.includePaths || [],
			outputStyle: isDev ? 'expanded' : 'compressed',
		} ).on( 'error', sass.logError ) )
		.pipe( gulpif( schema.css.postcssProcessors, postcss( () => {
			const processors = [];

			// Loop over the settings and dynamically push a function to PostCSS.
			for ( let processor in schema.css.postcssProcessors ) {
				if ( postcssProcessors.hasOwnProperty( processor ) && 'function' === typeof postcssProcessors[ processor ] ) {
					processors.push( postcssProcessors[ processor ]( schema.css.postcssProcessors[ processor ] ) );
				}
			}

			return processors;
		} ) ) )
		.pipe( gulpif( isDev, sourcemaps.write( '' ) ) )

		.pipe( gulp.dest( task.dest ) );
} );
