"use strict"

//* Initialize webGL with camera and lights
const canvas = document.getElementById("mycanvas");
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setClearColor('rgb(255,255,255)');

const secondCanvas = document.getElementById("mysecondcanvas");
const secondRenderer = new THREE.WebGLRenderer({
    canvas: secondCanvas
});
secondRenderer.setClearColor('rgb(255,255,255)');

//FUNCTIONS
const generateInitialBallPosition = function() {
    let position = Math.floor(Math.random() * Math.floor(fieldW / 2));
    const randomSignal = Math.floor(Math.random() * 10) % 2 == 0;
    if (randomSignal) {
        position = -position;
    }
    return position;
};

const newGame = function() {
    document.location.reload(true);
};

const onePlayerMode = function() {
    if (speedX == 0 && speedY == 0) {
        const cushionW = fieldW;
        const cushionH = fieldW / 10;
        const cushionUpGeometry = new THREE.BoxGeometry(cushionW, cushionH, 0);
        const cushionUp = new THREE.Mesh(cushionUpGeometry, cushionMaterial);
        cushionUp.position.y = fieldH / 2;
        cushionUp.position.z = radius;
        speedX = Math.floor(Math.random() * (maxSpeedX - minSpeedX) + minSpeedX);
        speedY = Math.floor(Math.random() * (maxSpeedY - minSpeedY) + minSpeedX) * -1;
        scene.add(cushionUp);
        upBoundary = cushionUp.position.y - cushionH / 2;
        singlePlayerMode = true;
    }
};

const twoPlayerMode = function() {
    if (speedX == 0 && speedY == 0) {
        scene.add(racketPlayer2);
        speedX = Math.floor(Math.random() * (maxSpeedX - minSpeedX) + minSpeedX);
        speedY = Math.floor(Math.random() * (maxSpeedY - minSpeedY) + minSpeedX) * -1;
        console.log(speedX);
        console.log(speedY);
        singlePlayerMode = false;
        secondCanvas.style = {
            'display': 'block'
        };
    }
};

// create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, canvas.width / canvas.height,
    0.1, 1000);
camera.position.z = 5;
camera.position.y = -15;

const ambientLight = new THREE.AmbientLight(0x909090);
scene.add(ambientLight);
const light = new THREE.DirectionalLight(0x444444);
light.position.set(1.5, 1, 1);
scene.add(light);

//Creates camera for the double player mode.
const secondCamera = new THREE.PerspectiveCamera(270, secondCanvas.width / secondCanvas.height,
    0.1, 1000);
secondCamera.position.z = 5;
secondCamera.position.y = 15;


//FIELD 
const fieldW = 10;
const fieldH = 20;
const fieldGeometry = new THREE.PlaneGeometry(fieldW, fieldH, 64, 64); // (width : Float, height : Float, widthSegments : Integer, heightSegments : Integer)
const fieldMaterial = new THREE.MeshBasicMaterial({
    color: 'green',
    side: THREE.DoubleSide
});
const field = new THREE.Mesh(fieldGeometry, fieldMaterial);

//CENTRAL LINE
const lineMaterial = new THREE.LineBasicMaterial({
    color: 'white'
});
const lineGeometry = new THREE.Geometry();
lineGeometry.vertices.push(new THREE.Vector3(fieldW, 0, 0));
lineGeometry.vertices.push(new THREE.Vector3(-fieldW, 0, 0));
const line = new THREE.Line(lineGeometry, lineMaterial);
line.position.z = 0.01

//BALL 
const radius = 0.5;
const omega = 6;
const segments = 32;
const ballGeometry = new THREE.SphereGeometry(radius, segments, segments);
const ballMaterial = new THREE.MeshBasicMaterial({
    color: 0xFFEE00
});
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.position.z = radius;
ball.position.x = generateInitialBallPosition();

//CUSHIONS
const cushionW = fieldW / 10;
const cushionH = fieldH;
const cushionGeometry = new THREE.BoxGeometry(cushionW, cushionH, 0);
const cushionMaterial = new THREE.MeshBasicMaterial({
    color: 0x08591B
});
const cushionLeft = new THREE.Mesh(cushionGeometry, cushionMaterial);
cushionLeft.position.x = -fieldW / 2;
cushionLeft.position.z = radius;


const cushionRight = new THREE.Mesh(cushionGeometry, cushionMaterial);
cushionRight.position.x = fieldW / 2;
cushionRight.position.z = radius;


//RACKETS
const racketW = 2;
const racketH = 0.5;
const racketGeometry = new THREE.BoxGeometry(racketW, racketH, 0);
const racketP1Material = new THREE.MeshBasicMaterial({
    color: 'red'
});
const racketPlayer1 = new THREE.Mesh(racketGeometry, racketP1Material);
racketPlayer1.position.z = radius;
racketPlayer1.position.y = -fieldH / 2;

const racketP2Material = new THREE.MeshBasicMaterial({
    color: 'blue'
});
const racketPlayer2 = new THREE.Mesh(racketGeometry, racketP2Material);
racketPlayer2.position.z = radius;
racketPlayer2.position.y = fieldH / 2;

//CONSTANTS AND ANIMATION VARIABLES
const maxSpeedX = 5;
const minSpeedX = 3;
const maxSpeedY = 10;
const minSpeedY = 3;
let speedX = 0;
let speedY = 0;
let singlePlayerMode = false;
const controls = new THREE.TrackballControls(camera, canvas);
const clock = new THREE.Clock();
const leftBoundary = cushionLeft.position.x + cushionW / 2;
const rightBoundary = cushionRight.position.x - cushionW / 2;
const victoryDownLimit = racketPlayer1.position.y - (2 * radius);
const victoryUpLimit = racketPlayer2.position.y + (2 * radius);
let upBoundary = undefined;
const secondcontrols = new THREE.TrackballControls(secondCamera, secondCanvas);
const buttonOnePlayer = document.getElementById("playerOne");
const buttonTwoPlayer = document.getElementById("playerTwo");


//EVENTS
document.addEventListener("keydown", (event) => {
    event.preventDefault();
    const limitRightP1Reached = (racketPlayer1.position.x + racketW / 2) >= fieldW / 2;
    const limitRightP2Reached = (racketPlayer2.position.x + racketW / 2) >= fieldW / 2;
    const limitLeftP1Reached = (racketPlayer1.position.x - racketW / 2) <= -fieldW / 2;
    const limitLeftP2Reached = (racketPlayer2.position.x - racketW / 2) <= -fieldW / 2;

    if (event.keyCode === 39 && !limitRightP1Reached) {
        racketPlayer1.position.x = racketPlayer1.position.x + 1;
    }

    if (event.keyCode === 37 && !limitLeftP1Reached) {
        racketPlayer1.position.x = racketPlayer1.position.x - 1;
    }

    if (event.keyCode === 68 && !limitRightP2Reached) {
        racketPlayer2.position.x = racketPlayer2.position.x + 1;
    }

    if (event.keyCode === 65 && !limitLeftP2Reached) {
        racketPlayer2.position.x = racketPlayer2.position.x - 1;
    }
});

//ADD SCENE OBJECTS
scene.add(field);
scene.add(cushionRight);
scene.add(cushionLeft);
scene.add(line);
scene.add(racketPlayer1);
scene.add(ball);



//* Render loop
function render() {
    requestAnimationFrame(render);

    const h = clock.getDelta();
    const t = clock.getElapsedTime();

    ball.position.y += speedY * h;
    ball.position.x += speedX * h;

    const racketOneRangeRight = racketPlayer1.position.x + racketW / 2;
    const racketOneRangeLeft = racketPlayer1.position.x - racketW / 2;
    const racketOneRangeUp = racketPlayer1.position.y + racketH / 2;
    const racketOneRangeDown = racketPlayer1.position.y - racketH / 2;

    const racketTwoRangeRight = racketPlayer2.position.x + racketW / 2;
    const racketTwoRangeLeft = racketPlayer2.position.x - racketW / 2;
    const racketTwoRangeUp = racketPlayer2.position.y + racketH / 2;
    const racketTwoRangeDown = racketPlayer2.position.y - racketH / 2;

    const ballPositionUp = ball.position.y + radius;
    const ballPositionDown = ball.position.y - radius;
    const ballPositionRight = ball.position.x + radius;
    const ballPositionLeft = ball.position.x - radius;

    if (ballPositionLeft <= leftBoundary) {
        speedX = -speedX;
    }

    if (ballPositionRight >= rightBoundary) {
        speedX = -speedX;
    }

    if ((ball.position.x <= racketOneRangeRight && ball.position.x >= racketOneRangeLeft && ballPositionDown <= racketOneRangeUp)) {
        speedY = -speedY;
    }

    if (singlePlayerMode) {
        if (ballPositionUp >= upBoundary) {
            speedY = -speedY;
        }

        if (ballPositionDown < victoryDownLimit) {
            alert('Game Over! \n Player 1 Lost!');
            newGame();
        }
    } else {
        if (!singlePlayerMode && (ball.position.x <= racketTwoRangeRight && ball.position.x >= racketTwoRangeLeft && ballPositionUp >= racketTwoRangeDown)) {
            speedY = -speedY;
        }

        if (!singlePlayerMode && ballPositionDown < victoryDownLimit) {
            alert('Game Over! \n Player 2 Won!');
            newGame();
        }

        if (!singlePlayerMode && ballPositionDown > victoryUpLimit) {
            alert('Game Over! \n Player 1 Won!');
            newGame();
        }
    }

    controls.update();
    secondcontrols.update();

    renderer.render(scene, camera);
    secondRenderer.render(scene, secondCamera);
}

render();