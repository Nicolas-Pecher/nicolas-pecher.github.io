let data = {
    type: "text",
    text: "Hey!"
};

let randomId = Math.random().toString(36).substr(2, 9);
console.log(randomId);


function writeText(message,type = 'default') {
    let messageBox = document.getElementById('messageBox');
    let newMessage = document.createElement('p');

    if(type == 'user') {
        newMessage.setAttribute('class','userText');
    } else {
        newMessage.setAttribute('class','botText');
    }
    newMessage.textContent = message;
    messageBox.appendChild(newMessage);
}

function choiceBox(data) {
    console.log(data.quick_replies);

    writeText(data.wrapped.text)

    let buttonBox = document.getElementById('buttonBox');
    buttonBox.innerHTML = '';
    data.quick_replies.forEach(replie => {
        let replyButton = document.createElement('button');
        replyButton.textContent = replie.title;
        buttonBox.appendChild(replyButton);

        replyButton.addEventListener('click', () => {
            console.log(replyButton.textContent);
            let answer = {
                type: "text",
                text: replyButton.textContent
            }
            sendMessage(answer);
            buttonBox.innerHTML = '';
            writeText(replyButton.textContent,'user')
        })
    })
}

function sendMessage(message) {
    fetch('http://ec2-3-89-183-161.compute-1.amazonaws.com:3000/api/v1/bots/opla/converse/' + randomId, {
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

document.getElementById('inputForm').addEventListener('submit', (e) =>{
    e.preventDefault();
    const input = document.getElementById("chatInput").value
    writeText(input,'user')
    let answer = {
        type: "text",
        text: input
    }
    sendMessage(answer);
})

//start application
sendMessage(data);

