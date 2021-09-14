async function loadRepos() {
    const username = document.getElementById('username').value;
    const url = `https://api.github.com/users/${username}/repos`;

    const response = await fetch(url);
    console.log(response);
    const data = await response.json();
    console.log(data);
    
    const ulElement = document.getElementById('repos');
    ulElement.innerHTML = '';
    data.forEach((item) => {
        const liElement = document.createElement('li');
        liElement.textContent = item.full_name;
        ulElement.appendChild(liElement);
    });
}