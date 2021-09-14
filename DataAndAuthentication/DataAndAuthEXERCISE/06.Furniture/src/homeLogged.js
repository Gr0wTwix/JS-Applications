function atachEvents() {
    window.addEventListener('load', async () => {
        if(!sessionStorage.userToken) {
            window.location.pathname = 'home.html';
            return;
        }

        const tbody = document.querySelector('tbody');
        tbody.innerHTML = '';

        const response = await fetch('http://localhost:3030/data/furniture');
        const data = await response.json();

        Array.from(data).forEach(x => {
            const tr = createFurnitureHtmlElement(x);
            tbody.appendChild(tr);
        })
    });
    
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.querySelector('form').addEventListener('submit', createProduct);
    document.getElementById('buyBtn').addEventListener('click', buyProducts);
    document.getElementById('showBought').addEventListener('click', showBoughtProducts);
}

atachEvents();

async function buyProducts() {
    const tbody = document.querySelector('tbody');
    const markedProducts = Array.from(tbody.querySelectorAll('input[type=checkbox]:checked'))
        .map(x => x.parentNode.parentNode);

    for (let product of markedProducts) {
        const name = product.querySelectorAll('p')[0].textContent;
        const price = product.querySelectorAll('p')[1].textContent;

        await fetch('http://localhost:3030/data/orders', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': sessionStorage.userToken
            },
            body: JSON.stringify({ name, price })
        })
    }
}

async function showBoughtProducts() {
    const response = await fetch('http://localhost:3030/data/orders');
    const data = await response.json();

    const products = data
        .filter(x => x._ownerId == sessionStorage.userId);

    const namesOfProducts = [];
    let totalPrice = 0;

    for (let product of products) {
        namesOfProducts.push(product.name);
        totalPrice += Number(product.price);
    }

    document.getElementById('boughtProductNames').textContent = namesOfProducts.join(', ');
    document.getElementById('boughtTotalPrice').textContent = `${totalPrice} $`;
}

async function createProduct(ev) {
    ev.preventDefault();

    const formData = new FormData(ev.target);

    const name = formData.get('name');
    const price = formData.get('price');
    const decFactor = formData.get('factor');
    const img = formData.get('img');

    if (name == '' || price == '' || decFactor == '' || img == '') {
        alert('All fields are required!');
        return;
    }

    const response = await fetch('http://localhost:3030/data/furniture', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': sessionStorage.userToken
        },
        body: JSON.stringify({ name, price, decFactor, img })
    });

    if (response.ok !== true) {
        const error = await response.json();
        alert(error.message);
        return;
    }

    await loadFurnitures();
    ev.target.reset();
}

function createFurnitureHtmlElement(obj) {
    const img = createElement('img');
    img.setAttribute('src', obj.img);
    const imgTd = createElement('td', img);

    const nameParagraph = createElement('p', obj.name);
    const nameTd = createElement('td', nameParagraph);

    const priceParagraph = createElement('p', obj.price);
    const priceTd = createElement('td', priceParagraph);

    const decFactorParagraph = createElement('p', obj.decFactor);
    const decFactorTd = createElement('td', decFactorParagraph);

    const input = createElement('input');
    input.setAttribute('type', 'checkbox');
    const checkboxTd = createElement('td', input);

    const tr = createElement('tr', imgTd, nameTd, priceTd, decFactorTd, checkboxTd);
    tr.setAttribute('data-id', obj._id);
    tr.setAttribute('data-ownerId', obj._ownerId);

    return tr;
}

function createElement(type, ...content) {
    const result = document.createElement(type);

    content.forEach(e => {
        if (typeof e == 'string' || typeof e == 'number') {
            const node = document.createTextNode(e.toString());
            result.appendChild(node);
        } else {
            result.appendChild(e);
        }
    });

    return result;
}

function logout() {
    sessionStorage.clear();
    window.location.pathname = 'home.html';
}