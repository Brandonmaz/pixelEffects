const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];
let adjustX = 0;
let adjustY = 5;

// handle mouse
let mouse = {
  x: null,
  y: null,
  radius: 150,
};
window.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

ctx.fillStyle = "white";
ctx.font = "30px Verdana";
ctx.fillText("A", 10, 40); // change x and y placement with 0, 40
const textCoordinates = ctx.getImageData(0, 0, 100, 100);

class Particle {
  constructor(x, y) {
    this.x = x + 100;
    this.y = y;
    this.size = 3;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = Math.random() * 40 + 10;
  }
  draw() {
    // ctx.fillStyle = "#" + Math.floor(Math.random() * 16777215).toString(10);
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
  update() {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    let maxDistance = mouse.radius;
    let force = (maxDistance - distance) / maxDistance;
    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;

    if (distance < mouse.radius) {
      this.x -= directionX * 3;
      this.y -= directionY * 3;
    } else {
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX;
        this.x -= dx / 15; // controls the speed of the dots going back together
      }
      if (this.x !== this.baseY) {
        let dy = this.y - this.baseY;
        this.y -= dy / 15;
      }
    }
  }
}

function init() {
  particleArray = [];
  // for (let i = 0; i < 5000; i++) {
  //   let x = Math.random() * canvas.width;
  //   let y = Math.random() * canvas.height;
  //   particleArray.push(new Particle(x, y));
  // }
  for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
    for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
      if (
        textCoordinates.data[y * 4 * textCoordinates.width + x * 4 + 3] > 128
      ) {
        let positionX = x + adjustX;
        let positionY = y + adjustY;
        particleArray.push(new Particle(positionX * 20, positionY * 20));
      }
    }
  }
}
init();

const connect = () => {
  let opacityValue = 1;
  for (let a = 0; a < particleArray.length; a++) {
    for (let b = a; b < particleArray.length; b++) {
      let dx = particleArray[a].x - particleArray[b].x;
      let dy = particleArray[a].y - particleArray[b].y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      opacityValue = 0.5;
      ctx.strokeStyle = "rgba(255,255,255" + opacityValue + ")";
      if (distance < 50) {
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(particleArray[a].x, particleArray[a].y);
        ctx.lineTo(particleArray[b].x, particleArray[b].y);
        ctx.stroke();
      }
    }
  }
};

animate = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].draw();
    particleArray[i].update();
  }
  connect();
  requestAnimationFrame(animate);
};
animate();
