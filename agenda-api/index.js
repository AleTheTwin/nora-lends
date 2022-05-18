const { app } = require("./app")

const PORT = process.env.EVENTS_API_PORT || 8081;

const server = app.listen(PORT, () => {
    console.log(`USERS API listening on port ${PORT}, http://localhost:${PORT}`);
});