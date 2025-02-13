pumpum = document.getElementById("pumpum")
left = false;


pumpum.addEventListener("mouseover",async (e)=>{
	if(left){
		pumpum.style.left ='90%'
		pumpum.style.translate = 'translateX(-100%)' 
		
	}else{
		pumpum.style.left ='10%'
		pumpum.style.translate = 'translateX(0%)' 
	}

	await setTimeout(()=>{left = !left}, 500 );
})

const messages = [
	"I love you",
	"Muah :3",
	"You lil cutie",
	"Damn this counter still goinn",
	"Foto tita ?",
	"MUAHHH <33",
	"yes... the rain is blood",
];

const messageElement = document.querySelector("#message-bubble .message");

function changeMessage() {
	const randomMessage = messages[Math.floor(Math.random() * messages.length)];
	
	// Apply bounce effect
	messageElement.style.transform = "scale(1.2)";
	setTimeout(() => {
			messageElement.innerText = randomMessage;
			messageElement.style.transform = "scale(1)";
	}, 200);

	// Set next interval randomly between 5 to 10 seconds
	const nextTime = Math.random() * (10000 - 5000) + 5000;
	setTimeout(changeMessage, nextTime);
}

// Start the cycle
setTimeout(changeMessage, 5000);
