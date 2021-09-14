function attachEvents() {
    const refreshButton = document.getElementById('refresh');
    const sendButton = document.getElementById('submit');

    refreshButton.addEventListener('click', refreshMessages);

    sendButton.addEventListener('click', async () => {
        const author = document.getElementsByTagName('input')[0].value;
        const content = document.getElementsByTagName('input')[1].value;

        await sendMessage({ author, content });

        document.getElementsByTagName('input')[0].value = '';
        document.getElementsByTagName('input')[1].value = '';
    });
}

async function refreshMessages() {
    const response = await fetch('http://localhost:3030/jsonstore/messenger');
    const data = await response.json();

    const messages = Object.values(data).map(x => `${x.author}: ${x.content}`);
    document.getElementById('messages').value = messages.join('\n');
}

async function sendMessage(message) {

    if (message.author == '' || message.content == '') {
        alert('The fields can not be empty!');
        return;
    }

    await fetch('http://localhost:3030/jsonstore/messenger', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
    });
}

attachEvents();