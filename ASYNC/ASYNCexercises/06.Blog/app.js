function attachEvents() {
    document.getElementById('btnLoadPosts').addEventListener('click', getPosts);
    document.getElementById('btnViewPost').addEventListener('click', displayPost);
}

attachEvents();

async function getPosts() {
    const urlPosts = 'http://localhost:3030/jsonstore/blog/posts';
    const response = await fetch(urlPosts);
    const data = await response.json();

    const select = document.getElementById('posts');

    Object.values(data).map(createOption).forEach(o => select.appendChild(o));
}

function createOption(post) {
    const result = document.createElement('option');
    result.textContent = post.title;
    result.value = post.id;
    return result;
}

function displayPost() {
    const postId = document.getElementById('posts').value;
    getCommentsByPostId(postId);
}
async function getCommentsByPostId(postId) {
    const commentUl = document.getElementById('post-comments');
    commentUl.innerHTML = '';
    const postUrl = 'http://localhost:3030/jsonstore/blog/posts' + postId;
    const urlComments = 'http://localhost:3030/jsonstore/blog/comments';

    const [postResponse, commentsResponse] = await Promise.all([
        fetch(postUrl),
        fetch(urlComments)
    ]);

    const postData = await postResponse.json();

    document.getElementById('post-title').textContent = postData.title;
    document.getElementById('post-body').textContent = postDate.body;

    const data = await commentsResponse.json();
    const comments = Object.values(data).filter(c => c.postId == postId);

    comments.map(createElement).forEach(c => commentUl.appendChild(c));
}

function createElement(comment) {
    const result = document.createElement('li');
    result.textContent = comment.text;
    result.id = comment.id;
    return result;
}