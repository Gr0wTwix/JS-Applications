import { html, render } from 'https://unpkg.com/lit-html?module';

const rowTemplate = (student, select) => html`
 <tr class=${select ? 'select' : ''}>
   <td>${student.firstName} ${student.lastName}</td>
   <td>${student.email}</td>
   <td>${student.courseNumber}</td>
 </tr>
`
const input = document.getElementById('searchField');
const tbody = document.querySelector('tbody');
start();

async function start() {
   document.querySelector('searchBtn').addEventListener('click', () => {
      update(list, input.value);
   });

   const resource = await fetch('http://localhost:3030/jsonstore/advanced/table');
   const data = await resource.json();
   const list = Object.values(data);
   update(list);
}

function update(list, match = '') {
   const result = list.map((e) => rowTemplate(e, compare(e, match)));
   render(result, tbody);
}

function compare(item, match) {
   return Object.values(item).some(v => match && v.toLowerCase().includes(match));
}