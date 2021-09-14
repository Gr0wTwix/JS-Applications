window.addEventListener('load', () => {
  if(!sessionStorage.userToken) {
    window.location.pathname = 'home.html';
  } else {
    window.location.pathname = 'homeLogged.html';
  }
});