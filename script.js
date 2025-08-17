// Elementos do DOM
const guessInput = document.getElementById('guessInput');
const guessButton = document.getElementById('guessButton');
const message = document.getElementById('message');
const attemptsDisplay = document.getElementById('attempts');
const resetButton = document.getElementById('resetButton');

// Variáveis do jogo
const maxAttempts = 10;
let secretNumber;
let attempts;

// Função para iniciar ou reiniciar o jogo
function startGame() {
    // Gera um número aleatório entre 1 e 100
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attempts = maxAttempts;

    // Reseta a interface
    message.textContent = '';
    attemptsDisplay.textContent = `Tentativas restantes: ${attempts}`;
    guessInput.value = '';
    guessInput.disabled = false;
    guessButton.disabled = false;
    resetButton.classList.add('hidden');
    guessInput.focus();
}

// Função para verificar o palpite do jogador
function checkGuess() {
    const userGuess = parseInt(guessInput.value);

    // Validação da entrada
    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
        message.textContent = 'Por favor, insira um número válido entre 1 e 100.';
        return;
    }

    // Decrementa as tentativas
    attempts--;

    // Compara o palpite com o número secreto
    if (userGuess === secretNumber) {
        message.textContent = `Parabéns! Você acertou! O número era ${secretNumber}.`;
        message.style.color = 'green';
        endGame();
    } else if (userGuess < secretNumber) {
        message.textContent = 'O número secreto é MAIOR.';
        message.style.color = 'orange';
    } else {
        message.textContent = 'O número secreto é MENOR.';
        message.style.color = 'orange';
    }

    // Atualiza a exibição de tentativas
    attemptsDisplay.textContent = `Tentativas restantes: ${attempts}`;

    // Verifica se o jogador perdeu
    if (attempts === 0 && userGuess !== secretNumber) {
        message.textContent = `Você perdeu! O número secreto era ${secretNumber}.`;
        message.style.color = 'red';
        endGame();
    }

    guessInput.value = '';
    guessInput.focus();
}

function endGame() {
    guessInput.disabled = true;
    guessButton.disabled = true;
    resetButton.classList.remove('hidden');
}

// Event Listeners
guessButton.addEventListener('click', checkGuess);
resetButton.addEventListener('click', startGame);

// Inicia o jogo ao carregar a página
startGame();