export default {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  transform: {
    "^.+\\.jsx?$": "babel-jest", // Use Babel to transform JavaScript files
  },
};