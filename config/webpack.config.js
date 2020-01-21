'use strict';

const path = require('path');
const webpack = require('webpack');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const ManifestPlugin = require('webpack-manifest-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const paths = require('./paths');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const shouldUseSourceMap = true;

const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [,
        {
            loader: MiniCssExtractPlugin.loader,
            options: {},
        },
        {
            loader: require.resolve('css-loader'),
            options: cssOptions,
        },
        {
            loader: require.resolve('postcss-loader'),
            options: {
                ident: 'postcss',
                plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    require('postcss-preset-env')({
                        autoprefixer: {
                            flexbox: 'no-2009',
                        },
                        stage: 3,
                    }),
                    postcssNormalize(),
                ],
                sourceMap: shouldUseSourceMap,
            },
        },
    ].filter(Boolean);
    if (preProcessor) {
        loaders.push({
            loader: require.resolve(preProcessor),
            options: {
                sourceMap: shouldUseSourceMap,
            },
        });
    }
    return loaders;
};

module.exports = {
    mode: 'production',
    bail: true,
    devtool: shouldUseSourceMap ? 'source-map' : false,
    entry: [
        path.resolve(__dirname, '../client/src/index.js')
    ],
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'static/js/[name].[contenthash:8].js',
        futureEmitAssets: true,
        chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
        publicPath: '/dist/'
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    parse: {
                        ecma: 8,
                    },
                    compress: {
                        ecma: 5,
                        warnings: false,
                        comparisons: false,
                        inline: 2
                    },
                    mangle: {
                        safari10: true,
                    },
                    output: {
                        ecma: 5,
                        comments: false,
                        ascii_only: true,
                    },
                },
                parallel: true,
                cache: true,
                sourceMap: shouldUseSourceMap
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    parser: safePostCssParser,
                    map: shouldUseSourceMap ?
                        {
                            inline: false,
                            annotation: true,
                        } :
                        false
                },
            }),
        ],
        splitChunks: {
            chunks: 'all',
            name: false
        },
        runtimeChunk: true
    },
    resolve: {
        modules: [
            'node_modules',
            path.resolve(__dirname, '../node_modules')
        ],
        extensions: [
            '.web.mjs',
            '.mjs',
            '.web.js',
            '.js',
            '.json',
            '.web.jsx',
            '.jsx'
        ],
        plugins: [
            PnpWebpackPlugin,
            new ModuleScopePlugin(path.resolve(__dirname, '../client/src'), [path.resolve(__dirname, '../package.json')])
        ]
    },
    resolveLoader: {
        plugins: [
            PnpWebpackPlugin.moduleLoader(module)
        ]
    },
    module: {
        strictExportPresence: true,
        rules: [{
                parser: {
                    requireEnsure: false
                }
            },
            // First, run the linter.
            // It's important to do this before Babel processes the JS.
            // {
            //   test: /\.(js|mjs|jsx|ts|tsx)$/,
            //   enforce: 'pre',
            //   use: [
            //     {
            //       options: {
            //         formatter: require.resolve('react-dev-utils/eslintFormatter'),
            //         eslintPath: require.resolve('eslint'),

            //       },
            //       loader: require.resolve('eslint-loader'),
            //     },
            //   ],
            //   include: paths.appSrc,
            // },
            {
                oneOf: [{
                        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        loader: require.resolve('url-loader'),
                        options: {
                            limit: 10000,
                            name: 'static/media/[name].[hash:8].[ext]',
                        },
                    },
                    {
                        test: /\.(js)$/,
                        include: path.resolve(__dirname, '../client/src'),
                        loader: require.resolve('babel-loader'),
                        options: {
                            customize: require.resolve(
                                'babel-preset-react-app/webpack-overrides'
                            ),

                            plugins: [
                                [
                                    require.resolve('babel-plugin-named-asset-import'),
                                    {
                                        loaderMap: {
                                            svg: {
                                                ReactComponent: '@svgr/webpack?-svgo,+ref![path]',
                                            },
                                        },
                                    },
                                ],
                            ],
                            cacheDirectory: true,
                            cacheCompression: true,
                            compact: true,
                        },
                    },
                    {
                        test: /\.(js)$/,
                        exclude: /@babel(?:\/|\\{1,2})runtime/,
                        loader: require.resolve('babel-loader'),
                        options: {
                            babelrc: false,
                            configFile: false,
                            compact: false,
                            presets: [
                                [
                                    require.resolve('babel-preset-react-app/dependencies'),
                                    {
                                        helpers: true
                                    },
                                ],
                            ],
                            cacheDirectory: true,
                            cacheCompression: true,
                            sourceMaps: false,
                        },
                    },
                    {
                        test: cssRegex,
                        exclude: cssModuleRegex,
                        use: getStyleLoaders({
                            importLoaders: 1,
                            sourceMap: shouldUseSourceMap,
                        }),
                        sideEffects: true,
                    },
                    {
                        test: cssModuleRegex,
                        use: getStyleLoaders({
                            importLoaders: 1,
                            sourceMap: shouldUseSourceMap,
                            modules: true,
                            getLocalIdent: getCSSModuleLocalIdent,
                        }),
                    },
                    {
                        test: sassRegex,
                        exclude: sassModuleRegex,
                        use: getStyleLoaders({
                                importLoaders: 2,
                                sourceMap: shouldUseSourceMap,
                            },
                            'sass-loader'
                        ),
                        sideEffects: true,
                    },
                    {
                        test: sassModuleRegex,
                        use: getStyleLoaders({
                                importLoaders: 2,
                                sourceMap: shouldUseSourceMap,
                                modules: true,
                                getLocalIdent: getCSSModuleLocalIdent,
                            },
                            'sass-loader'
                        ),
                    },
                    {
                        loader: require.resolve('file-loader'),
                        exclude: [/\.js$/, /\.html$/, /\.json$/],
                        options: {
                            name: 'static/media/[name].[hash:8].[ext]',
                        },
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin(
            Object.assign({}, {
                inject: true,
                template: path.resolve(__dirname, '../client/public/index.html')
            }, {
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true,
                },
            })
        ),
        new ModuleNotFoundPlugin(paths.appPath),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"',
                PUBLIC_URL: '"/dist"'
            }
        }),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash:8].css',
            chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
        }),
        new ManifestPlugin({
            fileName: 'asset-manifest.json',
            publicPath: '/dist/',
            generate: (seed, files) => {
                const manifestFiles = files.reduce(function (manifest, file) {
                    manifest[file.name] = file.path;
                    return manifest;
                }, seed);

                return {
                    files: manifestFiles,
                };
            },
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new WorkboxWebpackPlugin.GenerateSW({
            clientsClaim: true,
            exclude: [/\.map$/, /asset-manifest\.json$/],
            importWorkboxFrom: 'cdn',
            navigateFallback: '/dist/index.html',
            navigateFallbackBlacklist: [
                new RegExp('^/_'),
                new RegExp('/[^/]+\\.[^/]+$'),
            ],
        })
    ],
    node: {
        module: 'empty',
        dgram: 'empty',
        dns: 'mock',
        fs: 'empty',
        http2: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    },
    performance: false,
};