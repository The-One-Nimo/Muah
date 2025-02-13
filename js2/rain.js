const canvas = document.getElementById('rainCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let raindrops = [];

class Raindrop {
    constructor(x, y, length, speed) {
        this.x = x;
        this.y = y;
        this.length = length;
        this.speed = speed;
    }

    fall() {
        this.y += this.speed;
        if (this.y > canvas.height) {
            this.y = Math.random() * -canvas.height;
            this.x = Math.random() * canvas.width;
            this.length = Math.random() * 10 + 8; // Random length between 10 and 30
            this.speed = Math.random() * 10 + 6; // Random speed between 2 and 6
        }
    }

    draw() {
        ctx.strokeStyle = 'rgba(173, 4, 4, 0.6)'; // White color for raindrops
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.length);
        ctx.stroke();
    }
}

// Create raindrops
function createRaindrops(num) {
    for (let i = 0; i < num; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
				this.length = Math.random() * 10 + 8; // Random length between 10 and 30
				this.speed = Math.random() * 10 + 6; // Random speed between 2 and 6
		raindrops.push(new Raindrop(x, y, length, speed));
    }
}

// Update and draw the raindrops
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    raindrops.forEach(drop => {
        drop.fall();
        drop.draw();
    });
    requestAnimationFrame(animate);
}

// Initialize
createRaindrops(100); // Number of raindrops
animate();
