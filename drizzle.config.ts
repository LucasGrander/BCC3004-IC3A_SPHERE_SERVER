import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env' });

export default defineConfig({
    out: './drizzle',
    schema: './src/db/schema/**/*.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!, // Altere aqui para process.env.CLOUD_DATABASE_URL! depois de setar a url do banco remoto (se for usar o remoto)
    },
    
    breakpoints: true,
    strict: true,
    verbose: true,
});