function loadRepos() {
	const username = document.getElementById('username').value;
	const url = `https://api.github.com/users/${username}/repos`;

	fetch(url).then(response => response.json().then(handleResponse));

	function handleResponse(data) {
		const ulElement = document.getElementById('repos');
		ulElement.innerHTML = '';
		data.forEach((item) => {
			const liElement = document.createElement('li');
			liElement.textContent = item.full_name;
			ulElement.appendChild(liElement);
		});
	}
}