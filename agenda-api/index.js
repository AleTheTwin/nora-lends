const { app } = require("./app")

const PORT = process.env.EVENTS_API_PORT || 8080;

const server = app.listen(PORT, () => {
    console.log(`Agenda API listening on port ${PORT}, http://localhost:${PORT}`);
});