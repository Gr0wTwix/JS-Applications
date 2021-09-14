function attachEvents() {
    document.getElementById('btnLoad').addEventListener('click', renderPhoneBook);
    document.getElementById('btnCreate').addEventListener('click', savePhone);
}

attachEvents();

async function savePhone() {
    const person = document.getElementById('person');
    const phone = document.getElementById('phone');

    if(person.value == '' || phone.value == '') {
        alert('All fields are required!');
        return;
    }

    await fetch('http://localhost:3030/jsonstore/phonebook', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({person: person.value, phone: phone.value})
    });

    document.getElementById('person').value = '';
    document.getElementById('phone').value = '';
}

async function renderPhoneBook() {
    const phoneBookUl = document.getElementById('phonebook');
    phoneBookUl.innerHTML = '';

    const data = await getPhoneBook();

    Object.values(data).map(x => {
        const li = createElement('li', `${x.person}: ${x.phone}`);
        const delBtn = createElement('button', 'Delete');
        delBtn.addEventListener('click', deleteRecord);
        delBtn.classList.add('button');
        li.appendChild(delBtn);
        phoneBookUl.appendChild(li);
    })
}

async function getPhoneBook() {
    const response = await fetch('http://localhost:3030/jsonstore/phonebook');
    const data = await response.json();
    return data;
}

async function deleteRecord(ev) {
    const data = await getPhoneBook();
    const currPhoneTextContent = ev.target.parentNode.textContent.replace('Delete', '');
    const phoneDb = Object.values(data).find(x => `${x.person}: ${x.phone}` === currPhoneTextContent);

    await fetch('http://localhost:3030/jsonstore/phonebook/' + phoneDb._id, {
        method: 'delete'
    });

    ev.target.parentNode.remove();
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