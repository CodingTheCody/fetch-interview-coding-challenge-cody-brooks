import {defaults} from 'jest-config';

/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
    preset: 'ts-jest/presets/default-esm',
    bail: true,
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
    rootDir: '.',
    modulePaths: [
        '<rootDir>',
        '<rootDir>/app',
    ],
    testMatch: [
        '<rootDir>/__tests__/**/*.test.ts?(x)',
    ],
    injectGlobals: true,
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                // tsconfig: './tsconfig.jest.json',
                diagnostics: {
                    ignoreCodes: [1343]
                },
                useESM: true,
                astTransformers: {
                    before: [
                        {
                            path: 'node_modules/ts-jest-mock-import-meta',  // or, alternatively, 'ts-jest-mock-import-meta' directly, without node_modules.
                            options: {
                            }
                        }
                    ]
                }
            },
        ],
    },
    verbose: true,
    setupFilesAfterEnv: ['<rootDir>/app/globalJestSetup.ts'],
    "moduleNameMapper": {
        "~/(.*)": "<rootDir>/app/$1"
    },
};
