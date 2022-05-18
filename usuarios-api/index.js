const { app } = require("./app")

const PORT = process.env.USERS_API_PORT || 8080;

const server = app.listen(PORT, () => {
    console.log(`USERS API listening on port ${PORT}, http://localhost:${PORT}`);
});