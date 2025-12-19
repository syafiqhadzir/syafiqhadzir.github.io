const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://syafiqhadzir.dev',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
