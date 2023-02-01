const express = require("express");
const env = require("dotenv");
const app = express();
const cors = require("cors");
const fs = require("fs");
// const sorter = require("./utils/sort");

const http = require('http');
const https = require('https')
require("./db/conn")


const path = require("path");

//Routes

const authRoutes = require("./routes/auth");


//Environment Variables
env.config();

// MiddleWares
app.use(cors())
app.use(express.json())
app.use('/api', authRoutes);




const port = process.env.PORT || 5000

if (process.env.NODE_ENV === "production") {
    const privateKey = fs.readFileSync('/etc/letsencrypt/live/sstonebats.com/privkey.pem', 'utf8');
    const certificate = fs.readFileSync('/etc/letsencrypt/live/sstonebats.com/cert.pem', 'utf8');
    const ca = fs.readFileSync('/etc/letsencrypt/live/sstonebats.com/chain.pem', 'utf8');
    const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
    };

    https.createServer(credentials, app).listen(443, () => {
        console.log('HTTPS Server running on port 443');
    });
    http.createServer(function (req, res) {
        res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
        res.end();
    }).listen(80);
} else if (process.env.NODE_ENV === "development") {
    app.listen(5000, (req, res) => {
        console.log(`server is running on 5000`);
    })
} else {
    app.listen(5000, (req, res) => {
    console.log(`server is running on 5000`);
})
}

// app.listen(port, (req, res) => {
//     console.log(`server is running on 5000`);
// })