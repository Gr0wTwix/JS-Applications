window.addEventListener('load', async () => {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    const response = await fetch('http://localhost:3030/data/furniture');
    const data = await response.json();

    Array.from(data).forEach(x => {
        const tr = createFurnitureHtmlElement(x);
        tbody.appendChild(tr);
    })
})

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
    input.disabled = true;
    const checkboxTd = createElement('td', input);

    const tr = createElement('tr', imgTd, nameTd, priceTd, decFactorTd, checkboxTd);

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