let data = {
    type: "text",
    text: "Hey!"
};

let randomId = Math.random().toString(36).substr(2, 9);
let hostUrl = 'http://' + window.location.hostname;

function findUrls(message) {
    try {
        //url = message.match(/\(([^)]+)\)/)[1];
        if (!message.includes('('))
            return message;
        
        let urls = message.split('- ');
        if (urls.length > 1) {
            message = "";
            urls.forEach(element => {
                try {
                    element = element.trim();
                    element = element.substr(0, element.length - 1);
                    [subject, url] = element.split('(');
                    console.log(subject + `<a href="${url}" target="_blank">${url}</a>`);
                    if(url) {
                        message += subject + `<br /><a href="${url}" target="_blank">${url}</a><br /><br/>`;
                    } else {
                        message += subject + '<br/><br/>';
                    }
                        
                } catch (error) {
                    console.log(error);
                }
            });
        }

        if (urls.length == 1) {
            url = message.match(/\(([^)]+)\)/)[1]
            message = message.replace(`[${url}](${url})`, `<a href="${url}" target="_blank">${url}</a>`);
            console.log(message);
            //console.log(message + `<a href=${url} target='_blank'>${url}</a>`);
            //return message + `<a href="${url}" target="_blank">${url}</a>`;
        }
    } catch (error) {
    }
    return message;
}


function writeText(message, type = 'default') {
    let messageBox = document.getElementById('messageBox');
    let newMessage = document.createElement('p');

    if (type == 'user') {
        newMessage.setAttribute('class', 'userText');
    } else {
        message = findUrls(message);
        console.log(message);
        newMessage.setAttribute('class', 'botText');
    }
    newMessage.innerHTML = message;
    messageBox.appendChild(newMessage);
    window.scrollTo(0, document.body.scrollHeight);
}

function choiceBox(data) {

    writeText(data.wrapped.text)

    let buttonBox = document.getElementById('buttonBox');
    buttonBox.innerHTML = '';
    data.quick_replies.forEach(replie => {
        let replyButton = document.createElement('button');
        replyButton.textContent = replie.title;
        buttonBox.appendChild(replyButton);

        replyButton.addEventListener('click', () => {
            let answer = {
                type: "text",
                text: replyButton.textContent
            }
            sendMessage(answer);
            buttonBox.innerHTML = '';
            writeText(replyButton.textContent, 'user')
        })
    })
    window.scrollTo(0, document.body.scrollHeight);
}

function sendMessage(message) {
    fetch('http://localhost:3000/api/v1/bots/opla_v11/converse/' + randomId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            data.responses.forEach(message => {
                if (message.type == "text") {
                    writeText(message.text);
                    //console.log(message.text);
                }
                if (message.type == "custom") {
                    choiceBox(message)
                }
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

document.getElementById('inputForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById("chatInput").value
    writeText(input, 'user')
    let answer = {
        type: "text",
        text: input
    }
    sendMessage(answer);
})

console.log(window.location.hostname);

//start application
sendMessage(data);

