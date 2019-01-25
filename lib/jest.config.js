module.exports = {

    // The path to a module that runs some code to configure or set up the testing framework before each test
    setupTestFrameworkScriptFile: "<rootDir>/scripts/jest/setup.js",
    
    // Equivalent to calling jest.clearAllMocks() between each test. 
    clearMocks: true,
    
    testMatch: ["**/tests/**/*.js"],

    testPathIgnorePatterns: [ "/node_modules/", "<rootDir>/tests/.+-helpers/"],
    
}