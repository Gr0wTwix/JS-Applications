window.addEventListener('load', () => {
    if(sessionStorage.userToken) {
        window.location.pathname = 'index.html';
        alert('You are already logged!');
    }
});

const loginForm = document.getElementsByTagName('form')[1];

loginForm.addEventListener('submit', onLoginSubmit);

async function onLoginSubmit(ev) {
    ev.preventDefault();

    const formData = new FormData(ev.target);

    const email = formData.get('email');
    const password = formData.get('password');

    if(email == '' || password == '') {
        alert('All fields are required!');
        return;
    }

    const loginUrl = 'http://localhost:3030/users/login';
    const response = await fetch(loginUrl, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})
    });

    const data = await response.json();

    if(response.ok === false) {
        alert(data.message);
        return;
    }

    sessionStorage.setItem('userToken', data.accessToken);
    sessionStorage.setItem('userId', data._id);

    window.location.pathname = 'index.html';
}