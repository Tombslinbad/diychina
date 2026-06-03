import app from "../dist/server.cjs";

// Safely handle default/named exports from the compiled CJS server bundle
const expressApp = app.default || app;

export default expressApp;
