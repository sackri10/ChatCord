const chatForm = document.getElementById("chat-form");
const chatMessages=document.querySelector('.chat-messages');

const {username,room} =Qs.parse(location.search,{ignoreQueryPrefix:true});
console.log(username,room);



chatForm.addEventListener('submit',(e)=> {

e.preventDefault();
const msg=e.target.elements.msg.value;
socket.emit('chatMessage',msg);
document.getElementById('msg').value='';
document.getElementById("msg").focus();


});
const socket=io();

socket.emit('joinRoom',{username,room}); 
socket.on('message',(message)=>{
    console.log(message);
    outputMessage(message);
    chatMessages.scrollTop=chatMessages.scrollHeight;
});

socket.on('roomUsers',({room,users})=> {
    outputRoomName(room);
    outputUsers(users);
})

function outputMessage(message){
    const div= document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
						<p class="text">
							${message.text}
                        </p>`;
document.querySelector('.chat-messages').appendChild(div) ;
}

function outputRoomName(room){
document.getElementById("room-name").innerText=room;
}

function outputUsers(users) {
  const usersdiv=document.getElementById("users");
  usersdiv.innerHTML= `${users.map(user=>`<li>${user.username}</li>`).join('')}`

}