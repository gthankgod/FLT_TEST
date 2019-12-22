const express = require('express');
const config = require('config');
const debug = require('debug')('app:startup');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
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

app.get('/subAccount', (req, res) => {

    fetch(`https://api.ravepay.co/v2/gpx/subaccounts?seckey=${config.get('seckey')}`)
        .then(res => res.json())
        .then(data => res.json(data))
        .catch(err => res.send(err));

});

app.post('/subAccount', async (req, res) => {

    const { account_bank, account_number, business_name, business_email, business_contact, business_contact_mobile, country } = req.body;
    const newdriver = {
        account_bank,
        account_number,
        business_name,
        business_email,
        business_contact,
        business_contact_mobile,
        country
    };

    newdriver.seckey = config.get('seckey');
    const option = {
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(newdriver)
    }

    const result = await fetch(`https://api.ravepay.co/v2/gpx/subaccounts/create?seckey=${config.get('seckey')}`, option);
    const data = await result.json();

    res.send(data);

});

app.post('/pay', async (req, res) => {
    let { flwref, txref } = req.query;

    const query = {
        "SECKEY": config.get('seckey'),
        "txref": txref
    };
    const option = {
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(query)
    }

    const response = await fetch('https://api.ravepay.co/flwv3-pug/getpaidx/api/v2/verify', option);
    let resdata = await response.json();
    const { data } = resdata;
    const { subaccount, transaction_charge, transaction_charge_type } = JSON.parse(data.meta[0].metavalue);

    res.render('pages/index', { data, subaccount, transaction_charge, transaction_charge_type });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => debug(`Server started on PORT ${PORT}`))