const { app } = require("./app")

const PORT = process.env.NOTES_API_PORT || 8081;

const server = app.listen(PORT, () => {
    console.log(`NOTA API listening on port ${PORT}, http://localhost:${PORT}`);
});