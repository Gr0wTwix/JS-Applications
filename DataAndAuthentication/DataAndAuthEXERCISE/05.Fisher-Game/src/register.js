const registerForm = document.getElementsByTagName('form')[0];

registerForm.addEventListener('submit', onRegisterSubmit);

async function onRegisterSubmit(ev) {
    ev.preventDefault();
    const formData = new FormData(ev.target);

    const email = formData.get('email');
    const password = formData.get('password');
    const rePass = formData.get('rePass');

    if(email == '' || password == '' || rePass == '') {
        alert('All fields are required!');
        return;
    } else if(password !== rePass) {
        alert('Passwords do not match!');
        return;
    }

    const registerUrl = 'http://localhost:3030/users/register';
    const response = await fetch(registerUrl, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})
    });

    if(response.ok == false) {
        const error = await response.json();
        alert(error.message);
    }

    const data = await response.json();
    sessionStorage.setItem('userToken', data.accessToken);
    sessionStorage.setItem('userId', data._id);

    window.location.pathname = 'index.html';
}