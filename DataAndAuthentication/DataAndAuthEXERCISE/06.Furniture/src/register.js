document.getElementById('registerForm').addEventListener('submit', onRegisterSubmit);

async function onRegisterSubmit(ev) {
    ev.preventDefault();

    const formData = new FormData(ev.target);

    const email = formData.get('email');
    const password = formData.get('password');
    const rePass = formData.get('rePass');

    if(email == '' || password == '' || rePass == '' ){
        alert('All fields are required!');
        return;
    }

    if(password !== rePass) {
        alert('Passwords do not match!');
        return;
    }

    const response = await fetch('http://localhost:3030/users/register', {
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