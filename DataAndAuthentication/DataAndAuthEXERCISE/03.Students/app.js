async function solution(){
    await renderStudents();

    document.getElementById('form').addEventListener('submit', saveStudent);
}

solution();

async function getStudents() {
    const response = await fetch('http://localhost:3030/jsonstore/collections/students');
    const data = await response.json();
    return data;
}

async function renderStudents() {
    const tbody = document.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    const data = await getStudents();

    Object.values(data).map(x => {
        const firstNameTh = createElement('td', x.firstName);
        const lasNameTh = createElement('td', x.lastName);
        const facultyNumberTh = createElement('td', x.facultyNumber);
        const gradeTh = createElement('td', x.grade);
        const tr = createElement('tr', firstNameTh, lasNameTh, facultyNumberTh, gradeTh);

        tbody.appendChild(tr);
    })
}

async function saveStudent(ev) {
    ev.preventDefault();

    const inputs = document.getElementsByClassName('inputs')[0];
    const firstName = inputs.children[0].value;
    const lastName = inputs.children[1].value;
    const facultyNumber = inputs.children[2].value;
    const grade = inputs.children[3].value;

    if(firstName == '' || lastName == '' || facultyNumber == '' || grade == ''){
        alert('All fields are required!');
        return;
    }

    const recordedStudents = await getStudents();

    if(Object.values(recordedStudents).some(x => x.facultyNumber === facultyNumber)) {
        alert('Student with this faculty number already exist!');
        return;
    }

    await fetch('http://localhost:3030/jsonstore/collections/students', {
        method: 'post',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({firstName, lastName, facultyNumber, grade})
    });

    await renderStudents();
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