module.exports = {
    forbidden: [
        /* RULES: CIRCULAR */
        {
            name: 'no-circular',
            severity: 'error',
            comment:
                'This dependency is part of a circular relationship. You might want to revise your solution (i.e. use dependency injection, split modules or interface separation) to solve it.',
            from: {},
            to: {
                circular: true,
            },
        },
        /* RULES: ORPHANS */
        {
            name: 'no-orphans',
            severity: 'warn',
            comment:
                "This is an orphan module - it's likely not used (anymore?). Either use it or remove it. If it's logical this module is an orphan (i.e. it's a config file), add an exception in your .dependency-cruiser.js.",
            from: {
                orphan: true,
                pathNot: [
                    String.raw`(^|/)\.[^/]+\.(js|cjs|mjs|ts|json)$`, // .config.js, .eslintrc.js
                    String.raw`\.d\.ts$`, // type definitions
                    String.raw`eleventy\.config\.js`,
                    'src/pages/', // pages are entry points
                    'scripts/', // scripts are entry points
                    String.raw`src/components/.*\.worker\.js`, // workers are entry points
                    String.raw`knip\.config\.ts`,
                    String.raw`vitest\.config\.ts`,
                    String.raw`cypress\.config\.ts`,
                ],
            },
            to: {},
        },
        /* RULES: ARCHITECTURAL BOUNDARIES */
        {
            name: 'no-cli-imports-source',
            severity: 'error',
            comment:
                'CLI scripts should not import application logic directly to ensure separation of concerns. Import shared config/types is allowed.',
            from: {
                path: '^scripts/',
            },
            to: {
                path: '^src/',
                pathNot: ['^src/config/', '^src/types/'],
            },
        },
        {
            name: 'config-is-leaf',
            severity: 'error',
            comment:
                'Configuration modules must not import from the rest of the application to prevent cycles and ensure stability.',
            from: {
                path: '^src/config/',
            },
            to: {
                path: '^src/',
                pathNot: '^src/config/', // Importing other config files is fine
            },
        },
        // Prevent importing from _site (build output)
        {
            name: 'no-import-from-dist',
            severity: 'error',
            comment: 'Do not import from build artifacts.',
            from: {},
            to: {
                path: ['^_site/', '^dist/'],
            },
        },
    ],
    options: {
        /* USEFUL FOR TYPESCRIPT */
        doNotFollow: {
            path: 'node_modules',
        },
        tsPreCompilationDeps: true, // Use TS pre-compilation to find imports (handles paths better)
        tsConfig: {
            fileName: './tsconfig.json',
        },

        /* REPORTER OPTIONS */
        reporterOptions: {
            dot: {
                /* pattern of modules that can be consolidated in the detailed
                   graphical dependency graph. The default pattern in this configuration
                   collapses everything in node_modules to one folder deep so you see
                   the external modules, but not the innards your app depends upon.
                 */
                collapsePattern: 'node_modules/[^/]+',

                /* Options to tweak the appearance of your graph.See
                   https://github.com/sverweij/dependency-cruiser/blob/main/doc/options-reference.md#reporteroptions
                   for details and some examples. If you don't specify a theme
                   don't worry - dependency-cruiser will use the default one.
                 */
                theme: {
                    graph: {
                        /* use splines: "ortho" for straight lines. Be aware though
                           that "ortho" is calculated, and often comes out not-quite-right.
                         */
                        splines: 'ortho',
                    },
                },
            },
            archi: {
                /* pattern of modules that can be consolidated in the high level
                   graphical dependency graph. If you use the high level graphical
                   dependency graph reporter (`archi`) you probably want to tweak
                   this collapsePattern to your situation.
                 */
                collapsePattern: '^(node_modules|packages|src|lib|app|bin|test(s?)|spec(s?))/[^/]+',
            },
        },
    },
};
