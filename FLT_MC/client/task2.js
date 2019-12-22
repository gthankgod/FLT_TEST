const API_publicKey = "FLWPUBK_TEST-757eb84c8b6003179546e67740694bc0-X";
const subAccounts = document.querySelector('#sub_accounts');
const merchant_name = document.querySelector('#merchant_name');
const loading = document.querySelector('#loading');


fetch('https://radiant-harbor-86788.herokuapp.com/subAccount')
    .then(res => res.json())
    .then(({ data }) => {
        const { subaccounts } = data;
        if (subaccounts.length !== 0) {
            subaccounts.forEach(account => {
                let tr = document.createElement('tr');
                let val = `
                    <td>${account.fullname}</td>
                    <td>${account.bank_name}</td>
                    <td>${account.split_type}</td>
                    <td>${account.split_value}</td>
                    <td><a class="waves-effect waves-light btn>Edit Split Ratio</a><td>
                `;
                tr.innerHTML = val;
                subAccounts.append(tr);
                loading.src = '';
            });
            return
        }
        subAccounts.innerHTML = '<p>No Driver is registered yet</p>'
    })
    .catch(err => console.log(err));


async function payWithRave() {
    const customer_email = document.querySelector('#customer_email').value;
    const customer_amount = parseInt(document.querySelector('#customer_amount').value);
    const currency = document.querySelector('#customer_currency').value;
    const customer_phone = document.querySelector('#customer_phone_number').value;
    const merchant_id = document.querySelector('#merchant_name').options[document.querySelector('#merchant_name').selectedIndex].value;
    const res = await fetch('https://radiant-harbor-86788.herokuapp.com/subAccount');
    const response = await res.json();
    const { data } = response;
    let { subaccounts } = data;
    let amountcharged;

    if (!customer_email || !customer_amount || !currency || !merchant_id) {
        html = `<div class="text-center">Invalid Entries</div> `;
        return M.toast({ html });
    }
    subaccounts = subaccounts.filter(account => account.fullname === merchant_id).map(a => {
        if (a.split_type === "percentage") {
            amountcharged = a.split_value * customer_amount;
        }
        if (a.split_type === "flat") {
            amountcharged = customer_amount - a.split_value;

        }

        return {
            id: a.subaccount_id,
            transaction_charge_type: a.split_type,
            transaction_charge: amountcharged
        }
    });

    const body = {
        PBFPubKey: API_publicKey,
        txref: `TL-${Math.random()}`,
        subaccounts,
        amount: customer_amount,
        currency,
        customer_email,
        customer_phone,
        pay_button_text: 'Thanks for doing business with Us',
        redirect_url: 'https://radiant-harbor-86788.herokuapp.com/pay'
    };
    const option = {
        headers: {
            "Content-Type": "application/json",
            Accept: "*/*"
        },
        method: "POST",
        body: JSON.stringify(body)
    }

    const pay = await fetch('https://api.ravepay.co/flwv3-pug/getpaidx/api/v2/hosted/pay', option);
    const payResult = await pay.json();
    if (payResult.status === "success") {
        window.location.href = payResult.data.link;
        M.toast({ html: `<div>Processing Transaction</div>` });
    }
}

