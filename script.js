// Firebase Configuration
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
const database = firebase.database();

// Global Variables
let playerName;
let roomCode;
let roomRef;
let playerTurn = false;

// Generate a random room code
function generateRoomCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

// Create Room
function createRoom() {
    playerName = document.getElementById('playerName').value;
    roomCode = generateRoomCode();

    roomRef = database.ref('rooms/' + roomCode);
    roomRef.set({
        player1: playerName,
        player2: '',
        player1Score: 0,
        player2Score: 0,
        turn: 'player1',
    }).then(() => {
        console.log('Room created successfully:', roomCode);
        updateUIAfterRoomCreation();
    }).catch((error) => {
        console.error('Error creating room:', error);
    });
}

// Join Room
function joinRoom() {
    playerName = document.getElementById('playerName').value;
    roomCode = document.getElementById('roomCodeInput').value;

    roomRef = database.ref('rooms/' + roomCode);
    roomRef.once('value', (snapshot) => {
        if (snapshot.exists()) {
            const roomData = snapshot.val();
            if (!roomData.player2) {
                roomRef.update({
                    player2: playerName,
                }).then(() => {
                    console.log('Joined room successfully:', roomCode);
                    updateUIAfterRoomJoin(roomData);
                }).catch((error) => {
                    console.error('Error joining room:', error);
                });
            } else {
                alert('Room is full!');
            }
        } else {
            alert('Room not found!');
        }
    });
}

function updateUIAfterRoomCreation() {
    document.querySelector('.room-container').style.display = 'none';
    document.querySelector('.game-board').style.display = 'block';
    document.getElementById('roomInfo').innerText = `Room: ${roomCode}`;
    document.getElementById('playerInfo').innerText = `Player: ${playerName}`;
    playerTurn = true; // creator starts the game
    setupGame();
}

function updateUIAfterRoomJoin(roomData) {
    document.querySelector('.room-container').style.display = 'none';
    document.querySelector('.game-board').style.display = 'block';
    document.getElementById('roomInfo').innerText = `Room: ${roomCode}`;
    document.getElementById('playerInfo').innerText = `Player: ${playerName}`;
    playerTurn = false; // joiner waits for their turn
    setupGame(roomData);
}

function setupGame(roomData = null) {
    // Set up game logic and listeners here...
    if (roomData) {
        // Handle game setup when joining
        document.getElementById('player1Score').innerText = roomData.player1Score;
        document.getElementById('player2Score').innerText = roomData.player2Score;
        document.getElementById('turnInfo').innerText = `Turn: ${roomData.turn}`;
    }
}

// Run Selection
function selectRun(run) {
    if (playerTurn) {
        // Game logic for selecting a run
        console.log(`Player selected run: ${run}`);
        // Update the game state in Firebase...
        playerTurn = false; // after selecting, wait for opponent's turn
    }
}
