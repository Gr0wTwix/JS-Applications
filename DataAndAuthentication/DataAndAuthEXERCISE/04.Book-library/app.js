function atachEvents() {
    document.getElementById('loadBooks').addEventListener('click', renderBooks);
    document.getElementById('createForm').addEventListener('submit', saveBook);
    document.querySelector('table').addEventListener('click', handleTableClick);
    document.getElementById('editForm').addEventListener('submit', updateBook);
}

atachEvents();

async function saveBook(ev) {
    ev.preventDefault();

    const formData = new FormData(ev.target);
    const title = formData.get('title');
    const author = formData.get('author');

    if (title == '' || author == '') {
        alert('All fields are required!');
        return;
    }

    await createBook({ title, author });
    await renderBooks();

    clearFormInputs(ev.target);
}

async function createBook(book) {
    const result = await request('http://localhost:3030/jsonstore/collections/books', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
    });

    return result;
}

async function updateBook(ev) {
    ev.preventDefault();

    const formData = new FormData(ev.target);
    const id = formData.get('id');
    const title = formData.get('title');
    const author = formData.get('author');

    if (title == '' || author == '') {
        alert('All fields are required!');
        return;
    }

    await request('http://localhost:3030/jsonstore/collections/books/' + id, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author })
    });

    await renderBooks();

    clearFormInputs(ev.target);
}

async function deleteBook(id) {
    await request('http://localhost:3030/jsonstore/collections/books/' + id, {
        method: 'delete'
    });

    await renderBooks();
}

async function getBook(id) {
    const book = await request('http://localhost:3030/jsonstore/collections/books/' + id);
    return book;
}

async function getAllBooks() {
    const books = await request('http://localhost:3030/jsonstore/collections/books');
    return books;
}

async function renderBooks() {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    const booksDb = await getAllBooks();

    const rows = Array.from(Object.entries(booksDb).map(createRow));
    rows.forEach(x => tbody.appendChild(x));

    function createRow([id, book]) {
        const titleTd = createElement('td', book.title);
        const authorTd = createElement('td', book.author);
        const editButton = createElement('button', 'Edit');
        editButton.classList.add('editBtn');
        const deleteButton = createElement('button', 'Delete');
        deleteButton.classList.add('deleteBtn');
        const buttonsTd = createElement('td', editButton, deleteButton);
        const row = createElement('tr', titleTd, authorTd, buttonsTd);
        row.setAttribute('data-id', id);
    
        return row;
    }
}

async function request(url, options) {
    const response = await fetch(url, options);

    if (response.ok !== true) {
        const error = await response.json();
        alert(error.message);
        throw new Error(error.message);
    }

    const data = await response.json();
    return data;
}

async function handleTableClick(ev) {
    if (ev.target.className == 'editBtn') {
        document.getElementById('createForm').style.display = 'none';
        document.getElementById('editForm').style.display = 'block';

        const id = ev.target.parentNode.parentNode.dataset.id;
        const bookDb = await getBook(id);

        editForm.querySelector('#editForm [name="id"]').value = bookDb._id;
        editForm.querySelector('#editForm [name="title"]').value = bookDb.title;
        editForm.querySelector('#editForm [name="author"]').value = bookDb.author;
    } else if (ev.target.className == 'deleteBtn') {
        const confirmed = confirm('Are you sure you want to delete this book?');
        if (confirmed) {
            const id = ev.target.parentNode.parentNode.dataset.id;
            await deleteBook(id);
        }
    }
}

function clearFormInputs(form) {
    form.reset();
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