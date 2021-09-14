const form = document.getElementById('loginForm');

form.addEventListener('submit', onLoginSubmit);

async function onLoginSubmit(ev) {
    ev.preventDefault();

    const formData = new FormData(ev.target);

    const email = formData.get('email');
    const password = formData.get('password');

    if(email == '' || password == '') {
        alert('All fields are required!');
        return;
    }

    const response = await fetch('http://localhost:3030/users/login', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})
    });

    if(response.ok != true) {
        const error = await response.json();
        alert(error.message);
        return;
    }

    const data = await response.json();

    sessionStorage.userToken = data.accessToken;
    sessionStorage.userId = data._id;

    window.location.pathname = 'homeLogged.html';
}