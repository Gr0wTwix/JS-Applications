document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.clear();

    window.location.pathname = 'index.html';
});