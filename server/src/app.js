const path = require("node:path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const api = require("./routes/v1");

const app = express();

app.use(
    cors({
        origin: "http://localhost:3000",
    })
);
app.use(morgan("combined"));

app.use(express.json());

// Static build files
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/v1", api);

// TODO Needs clarification if this is still necessary
app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
