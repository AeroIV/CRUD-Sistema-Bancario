const express = require('express');
const router = require('./routes');
const app = express();

app.use(express.json());

app.use(router);

app.get('/', (req, res) => {
    res.json({ sucess: "OK, Running!"});
});

app.listen(8080, () => {
    console.log("Running on port 8080")
});