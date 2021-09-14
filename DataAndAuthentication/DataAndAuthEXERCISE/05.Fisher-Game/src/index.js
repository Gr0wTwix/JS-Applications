function attachEvents() {
    window.addEventListener('load', restartIndexPage);
    
    document.getElementsByClassName('load')[0].addEventListener('click', loadAllCatches);
    document.getElementsByClassName('add')[0].addEventListener('click', addCatch);
    document.getElementById('catches').addEventListener('click', handleTableEvents);
}

attachEvents();

async function restartIndexPage() {
    await loadAllCatches();

    const token = sessionStorage.getItem('userToken');
    if (token !== null) {
        document.getElementById('addBtn').disabled = false;

        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'inline-block';

        Array.from(document.getElementById('catches').children).forEach(x => {
            if (sessionStorage.userId && x.dataset.ownerid === sessionStorage.userId) {
                x.querySelectorAll('button')[0].disabled = false;
                x.querySelectorAll('button')[1].disabled = false;
            }
        });
    }
}

async function addCatch(ev) {
    const form = ev.target.parentNode;

    const inputs = form.querySelectorAll('input');

    const angler = inputs[0].value;
    const weight = inputs[1].value;
    const species = inputs[2].value;
    const location = inputs[3].value;
    const bait = inputs[4].value;
    const captureTime = inputs[5].value;

    if (angler == '' || weight == '' || species == '' || location == '' || bait == '' || captureTime == '') {
        alert('All fields are required!');
        return;
    }

    const catchObject = {
        angler,
        weight,
        species,
        location,
        bait,
        captureTime
    }

    const response = await fetch('http://localhost:3030/data/catches', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': sessionStorage['userToken']
        },
        body: JSON.stringify(catchObject)
    });

    if (response.ok == false) {
        const error = await response.json();
        alert(error.message);
        return;
    }

    await restartIndexPage();

    clearInputs();
}

async function updateCatch(catchEl) {
    const inputs = catchEl.querySelectorAll('input');

    const angler = inputs[0].value;
    const weight = inputs[1].value;
    const species = inputs[2].value;
    const location = inputs[3].value;
    const bait = inputs[4].value;
    const captureTime = inputs[5].value;

    if (angler == '' || weight == '' || species == '' || location == '' || bait == '' || captureTime == '') {
        alert('All fields are required!');
        return;
    }

    const catchObject = {
        angler,
        weight,
        species,
        location,
        bait,
        captureTime
    }

    const response = await fetch('http://localhost:3030/data/catches/' + catchEl.dataset.id, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': sessionStorage['userToken']
        },
        body: JSON.stringify(catchObject)
    });

    if (response.ok == false) {
        const error = await response.json();
        alert(error.message);
        return;
    }

    await restartIndexPage();
}

async function deleteCatch(catchEl) {
    await fetch('http://localhost:3030/data/catches/' + catchEl.dataset.id, {
        method: 'delete',
        headers: { 'X-Authorization': sessionStorage['userToken'] }
    });

    await restartIndexPage();
}

async function loadAllCatches() {
    const catches = await request('http://localhost:3030/data/catches');

    const catchesDiv = document.getElementById('catches');
    catchesDiv.innerHTML = '';

    catches.map(createDivCatch).forEach(x => catchesDiv.appendChild(x));

    sortCatches();
}

function sortCatches() {
    const catchesDiv = document.getElementById('catches');

    let sortedCatches = Array.from(catchesDiv.children)
        .sort((a, b) => Number(b.querySelectorAll('input')[1].value) - Number(a.querySelectorAll('input')[1].value));

    for (const element of sortedCatches) {
        catchesDiv.appendChild(element);
    }
}

async function handleTableEvents(ev) {
    if (ev.target.textContent == 'Update') {
        await updateCatch(ev.target.parentNode);
    } else if (ev.target.textContent == 'Delete') {
        await deleteCatch(ev.target.parentNode);
    }
}

function createDivCatch(input) {
    const hr = createElement('hr');

    const anglerLabel = createElement('label', 'Angler');
    const anglerInput = createElement('input');
    anglerInput.value = input.angler;
    anglerInput.classList.add('angler');

    const weightLabel = createElement('label', 'Weight');
    const weightInput = createElement('input');
    weightInput.value = input.weight;
    weightInput.classList.add('weight');

    const speciesLabel = createElement('label', 'Species');
    const speciesInput = createElement('input');
    speciesInput.value = input.species;
    speciesInput.classList.add('species');

    const locationLabel = createElement('label', 'Location');
    const locationInput = createElement('input');
    locationInput.value = input.location;
    locationInput.classList.add('location');

    const baitLabel = createElement('label', 'Bait');
    const baitInput = createElement('input');
    baitInput.value = input.bait;
    baitInput.classList.add('bait');

    const captureTimeLabel = createElement('label', 'Capture Time');
    const captureTimeInput = createElement('input');
    captureTimeInput.value = input.captureTime;
    captureTimeInput.classList.add('captureTime');

    const updateButton = createElement('button', 'Update');
    updateButton.classList.add('update');
    updateButton.disabled = true;

    const deleteButton = createElement('button', 'Delete');
    deleteButton.classList.add('delete');
    deleteButton.disabled = true;

    const catchDiv = createElement('div', anglerLabel, anglerInput, hr, weightLabel, weightInput, hr, speciesLabel, speciesInput, hr, locationLabel, locationInput, hr, baitLabel, baitInput, hr, captureTimeLabel, captureTimeInput, hr, updateButton, deleteButton);
    catchDiv.classList.add('catch');

    catchDiv.setAttribute('data-id', input._id);
    catchDiv.setAttribute('data-ownerId', input._ownerId);

    return catchDiv;
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

function clearInputs() {
    const form = document.getElementById('addForm');
    Array.from(form.querySelectorAll('input')).forEach(x => x.value = '');
}