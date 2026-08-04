module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['import'],
  extends: ['eslint:recommended', 'plugin:import/recommended'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.cjs', '.mjs'],
      },
    },
  },
  rules: {
    // -------------------------------------------------------------------------
    // Import cycle detection — prevents circular dependencies between modules
    // -------------------------------------------------------------------------
    'import/no-cycle': [
      'error',
      {
        maxDepth: Infinity,
        ignoreExternal: true,
      },
    ],

    // -------------------------------------------------------------------------
    // Import boundary rules — enforce layered architecture
    // Routes/controllers must not import repositories directly;
    // repositories must not import services.
    // -------------------------------------------------------------------------
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          {
            // Controllers must not bypass the service layer
            target: './src/modules',
            from: './src/db/repositories',
            except: ['./src/modules/**/*.service.js'],
            message:
              'Controllers and routes must not import repositories directly. Use the service layer instead.',
          },
          {
            // Repositories must not import service modules
            target: './src/db/repositories',
            from: './src/modules',
            message:
              'Repositories must not import service modules. Keep the data layer free of business logic.',
          },
          {
            // Middleware must not import route/controller modules
            target: './src/middleware',
            from: './src/modules',
            message:
              'Middleware must not import route or controller modules directly.',
          },
        ],
      },
    ],

    // -------------------------------------------------------------------------
    // General import hygiene
    // -------------------------------------------------------------------------
    'import/no-unresolved': 'error',
    'import/no-duplicates': 'warn',
    'import/no-self-import': 'error',
    'import/first': 'error',
    'import/newline-after-import': ['warn', { count: 1 }],
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],

    // -------------------------------------------------------------------------
    // ESLint core rules
    // -------------------------------------------------------------------------
    'no-unused-vars': [
      'warn',
      { vars: 'all', args: 'after-used', ignoreRestSiblings: true },
    ],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-var': 'error',
    'prefer-const': 'error',
    eqeqeq: ['error', 'always'],
    curly: ['error', 'all'],
    'no-throw-literal': 'error',
    'no-return-await': 'warn',
    'consistent-return': 'warn',
  },
  overrides: [
    {
      // CommonJS config/tooling files at the project root
      files: ['*.cjs', 'knexfile.js', 'jest.config.cjs', 'babel.config.cjs'],
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        commonjs: true,
      },
      rules: {
        'import/no-commonjs': 'off',
      },
    },
    {
      // Test files — relax some rules
      files: [
        '**/*.test.js',
        '**/*.spec.js',
        'jest.setup.cjs',
        'test-utils/**/*.js',
        'test-utils/**/*.cjs',
      ],
      env: {
        jest: true,
      },
      rules: {
        'no-console': 'off',
        'import/no-restricted-paths': 'off',
      },
    },
    {
      // Seed and migration scripts may access repositories and db client directly
      files: [
        'src/db/migrations/**/*.js',
        'src/db/seeds/**/*.js',
      ],
      rules: {
        'import/no-restricted-paths': 'off',
      },
    },
  ],
};
