import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: 'https://syafiqhadzir.dev',
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
});
