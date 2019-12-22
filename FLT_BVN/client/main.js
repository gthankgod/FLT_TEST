const bvn = document.querySelector('#bvn-number');
const submitBtn = document.querySelector('#submit');
const bvndetails = document.querySelector('#bvn-details');
const loading = document.querySelector('#loading');
let html;

submitBtn.addEventListener('click', async () => {
    if (!parseInt(bvn.value) || !bvn.value || bvn.value.length !== 11) {
        html = `<div class="text-center">Invalid Entry</div> `;
        M.toast({ html });
        html = '';
        return
    }

    loading.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJkAAABzCAMAAAC8XVBsAAAAZlBMVEX///8AAAB6envz8/N2dne8vL2jo6M2Njf7+/vf39/w8PC+v787OzuoqKns7OwbHB1sbGzIyMjm5uZGRkfX19hMTE2urq+1tbZlZWZcXF2IiIlSUlMvMDAjJCWQkJEpKSoODg+ampo4UaXYAAACr0lEQVR4nO2Y6ZKjIBCAbTUIXvHAiyiJ7/+SI1eiVTupyWp2s7X9/XBgFP3k6MZ4HoIgCIIgCIIgCIIgCIIgCIIgCPI/EtC/bfANwfX0R57D+astglSbzUNwvM2asHi1hTUboTzeZo0fvtrCmvHueJkNv232dv4ds1KI9hEVqkzI1XRKhOg8asxypo6UUd3mIcukIIxxzo41S2AUYoDMWqYQCh8aujnZ1WZtntUxjhi/XpaLInMRLUDMPsCl9vdGvY1ZApm6X3mTqpZfdK0aZ3uSqCqrIVFVEmmzek5Vp8amiec3+XLkU+ntDsdrswBmZ6ijnA1Y2aQdbsJU8/G0Mkun2FxUB/oOZhBJs9drazaDKxXrKJeDen/iTtoVYM0iOw35VC3HLjVdxc75oWYX6UoJPAYj5qC6pRG/Nks866J6q7VzkmnPw8yC9B48czDvTBN/aEZVeWTLZ2bmJZaZCvuz/sosHxNXpHq+UAl9xilVZvnkosczM+9sZmrj7xZbm8XRPSoFSiZOm+BeySen/dSM3WQes6GJDzXzmtmVuBoNGa00aUR+YsbTIW1G/wCxjZmI7iW16s9kZeYNw0/Mlg1IkB+zs1ybVWAfw0E9/EZcTZmVYJcbP39vxuC4TdsmBxATYauoV38KHS4pibQZHWq9XpeUtc4BWzMK3WFbcf9cWJSUhLBtBRT69hU07Wm+FjaExNNNdmQA3ujgQkxmcMGEmejfQdovhHJ3QvfKzEL0YFWy7323AadzX4jl35kdoi7sw9bzTmauaz/a2jGOWz3rC1GSBdlDu1vtUEjvSqJ+82fCawTX+/dOOe3PnAcSwz1dzpeP+iqlg8tK/N1fVq9SQV8ufcX9T1sAajlfAKCWHzXJLDQIPvaHDwRBEARBEARBEARBEARBEARBEGQ/X/rNIKmAzi7qAAAAAElFTkSuQmCC';
    const options = {
        headers: {
            "Content-type": "application/json",
            "Accept": "*/*"
        },
        method: "POST",
        body: JSON.stringify({ bvn: bvn.value })
    }
    const result = await fetch('https://blooming-mesa-23844.herokuapp.com', options);
    const resdata = await result.json();
    const { status, message, data } = resdata;
    if (status === 'success') {
        loading.src = '';
        html = `<div class="text-center">BVN VERIFIED</div> `;
        M.toast({ html });
        html = '';
        let div = document.createElement('div');
        let val = `
                <div class="row">
                <div class="col s12 m6">
                <div class="card">
                    <div class="card-content darken-4">
                    <span class="card-title">${data.first_name} ${data.last_name}</span>
                   <p>Phone Number : ${data.phone_number} </p>
                   <p>Gender : ${data.gender} </p>
                   <p>Nationality : ${data.nationality} </p>
                   <p>DOB : ${data.date_of_birth} </p>
                   <p>Registered Branch : ${data.enrollment_branch} </p>
                    </div>
                </div>
                </div>
            </div>
    `;
        div.innerHTML = val;
        bvndetails.append(div);
        bvn.value = '';
        bvn.focus();
    }

    if (status === 'error') {
        loading.src = '';
        bvn.value = '';
        html = `<div class="text-center">${message}</div> `;
        M.toast({ html });
        html = '';
        bvn.focus();
    }
});