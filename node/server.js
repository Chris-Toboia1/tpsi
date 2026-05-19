const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/pagina2", (req, res) => {
    res.sendFile(path.join(__dirname, "pagina2.html"));
});

app.get("/pagina3", (req, res) => {
    res.sendFile(path.join(__dirname, "pagina3.html"));
});

app.listen(port, () => {
    console.log(`Server avviato su http://localhost:${port}`);
});
