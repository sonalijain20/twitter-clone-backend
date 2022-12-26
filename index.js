const express = require("express");
require('dotenv').config();
const cors = require('cors');
const router = require('./routes/index')

const port = process.env.PORT || 1111;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


app.use('/api', router);
// app.use('/tweet');
// app.use('/feed');

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});