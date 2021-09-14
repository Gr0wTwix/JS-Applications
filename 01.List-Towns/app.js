import { html, render } from 'https://unpkg.com/lit-html?module';

const listTemplate = (data) => html`
    <ul>
        ${data.map(t => html`<li>${t}</li>`)}
    </ul>`;

document.getElementById('btnLoadTowns').addEventListener('click', updateList);
function updateList(event) {
    event.preventDefault();
    const townsAsString = document.getElementById('towns').value;
    const root = document.getElementById('root');
    townsAsString.split(', ').map(x => x.trim());
    // add click listener
    // parse input
    // execute template
    // render result
    const result = listTemplate(towns);
    render(result, root);
}