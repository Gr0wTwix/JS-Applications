import page from "//unpkg.com/page/page.mjs";

const pages = {
            '/home': '<h2>Home Page</h2><p>Home page content</p>',
            '/catalog': '<h2>Catalog Page</h2><p>List of recent articles <a href="/catalog/action/123">Item 123</a></p>',
            '/catalog/123': '<h2>Item 123</h2><p>Item details</p>',
            '/about': '<h2>About Page</h2><p>About page content</p>',
            '/buy': '<h2>Thank you for your purchase</h2>'
        }

const defaultPage = '<h2>404</h2><p>Page not found</p>';
const main = document.querySelector('main');
 
page('/home', updatePageContent);
page('/catalog', updatePageContent);
page('/catalog/:category/:id', itemDetails);
page('/about', updatePageContent);
page('/buy', updatePageContent);
page.redirect('/', 'home');
page.start();

function updatePageContent(context) {
    main.innerHTML = pages[context.pathname] || defaultPage;
}

function itemDetails(context) {
    const category = context.params.category
    const id = context.params.id;
    const html = `<h2>Category ${category}<h2>
    <h3>Item ${id}</h3>
    <p>Details for item ${id}</p>`;
    main.innerHTML = html;

    const btn = document.createElement('button');
    btn.textContent = 'Buy';
    btn.addEventListener('click', () => {
        context.page.redirect('/buy');
    });
    main.appendChild(btn);
}