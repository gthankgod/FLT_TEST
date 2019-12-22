const express = require('express');
const config = require('config');
const debug = require('debug')('app:startup');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'client')));

app.get('/', (req, res) => {
    res.send(path.join(__dirname, 'client', 'index'));
});

app.post('/', (req, res) => {

    fetch(`http://ravesandboxapi.flutterwave.com/v2/kyc/bvn/${req.body.bvn}?seckey=${config.get('seckey')}`)
        .then(res => res.json())
        .then(data => res.json(data))
        .catch(err => res.send(err));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => debug(`Server started on PORT ${PORT}`))