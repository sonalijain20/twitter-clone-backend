const express = require("express");
require('dotenv').config();
const cors = require('cors');
const router = require('./routes/index')

const port = process.env.PORT || 1111;

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Access-Control-Request-Method', 'Access-Control-Request-Headers']
}));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use('/api', router);

//return 404 if API not found
app.use('*', (req, res) => {
    return res.status(404).json({
        statusCode: 404,
        messgae: 'Not Found'
    })
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});