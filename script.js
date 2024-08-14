// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBjpFuQ0Mg9KnthmToMXMw_c0tXIBY2rKo",
    authDomain: "mycrick88497.firebaseapp.com",
    databaseURL: "https://mycrick88497-default-rtdb.firebaseio.com",
    projectId: "mycrick88497",
    storageBucket: "mycrick88497.appspot.com",
    messagingSenderId: "731647894608",
    appId: "1:731647894608:web:3a9267b6b77074a95f9d55",
    measurementId: "G-RDSDMX8ZZ9"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();
const database = firebase.database();

// Game variables
let roomCode = '';
let playerName = '';
let playerTurn = false;
let opponentTurn = false;
let roomRef;

// Function to create a room
function createRoom() {
    playerName = document.getElementById('playerName').value;
    roomCode = generateRoomCode();
    roomRef = database.ref('rooms/' + roomCode);

    // Set initial room data
    roomRef.set({
        player1: playerName,
        player2: '',
        player1Score: 0,
        player2Score: 0,
        turn: 'player1',
    });

    document.querySelector('.room-container').style.display = 'none';
    document.querySelector('.game-board').style.display = 'block';
    document.getElementById('roomInfo').innerText = `Room: ${roomCode}`;
    document.getElementById('playerInfo').innerText = `Player: ${playerName}`;
    playerTurn = true; // creator starts the game
    setupGame();
}

// Function to join a room
function joinRoom() {
    playerName = document.getElementById('playerName').value;
    roomCode = document.getElementById('roomCode').value;
    roomRef = database.ref('rooms/' + roomCode);

    // Listen for room data updates
    roomRef.on('value', (snapshot) => {
        const roomData = snapshot.val();
        if (roomData && !roomData.player2) {
            roomRef.update({ player2: playerName });
        }

        document.querySelector('.room-container').style.display = 'none';
        document.querySelector('.game-board').style.display = 'block';
        document.getElementById('roomInfo').innerText = `Room: ${roomCode}`;
        document.getElementById('playerInfo').innerText = `Player: ${playerName}`;
        playerTurn = roomData.turn === 'player2';
        opponentTurn = !playerTurn;
    });

    setupGame();
}

// Function to generate room code
function generateRoomCode() {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
}

// Function to set up game logic
function setupGame() {
    const runButtons = document.querySelectorAll('.run-btn');
    runButtons.forEach(button => {
        button.addEventListener('click', selectRun);
    });

    // Listen for opponent's move
    roomRef.child('turn').on('value', (snapshot) => {
        const turn = snapshot.val();
        playerTurn = turn === (playerName === 'player1' ? 'player1' : 'player2');
        opponentTurn = !playerTurn;
        if (playerTurn) {
            document.getElementById('scoreBoard').innerText = 'Your turn!';
        } else {
            document.getElementById('scoreBoard').innerText = 'Waiting for opponent...';
        }
    });
}

// Function to handle run selection
function selectRun(event) {
    const selectedRun = event.target.getAttribute('data-run');
    if (playerTurn) {
        const scoreKey = playerTurn ? 'player1Score' : 'player2Score';

        roomRef.update({ [scoreKey]: selectedRun })
            .then(() => {
                roomRef.update({ turn: opponentTurn ? 'player2' : 'player1' });
            });

        playerTurn = false;
        opponentTurn = true;
        document.getElementById('scoreBoard').innerText = `You selected ${selectedRun}. Waiting for opponent...`;
    } else {
        document.getElementById('scoreBoard').innerText = 'Wait for your turn.';
    }
}
