const { app } = require("./app")

const PORT = process.env.PORT || 8081;

const server = app.listen(PORT, () => {
    console.log(`Agenda API listening on port ${PORT}, http://localhost:${PORT}`);
});