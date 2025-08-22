/**
 * Classe que representa a lógica de um parquímetro.
 * Encapsula as regras de cálculo de tempo e troco.
 */
class Parquimetro {
    /**
     * Calcula o tempo de permanência e o troco com base no valor inserido.
     * @param {number} valor - O valor em dinheiro inserido pelo usuário.
     * @returns {object} Um objeto contendo o status e a mensagem de resultado.
     */
    calcularPermanencia(valor) {
        // Validação de entrada
        if (isNaN(valor) || valor <= 0) {
            return {
                sucesso: false,
                mensagem: "Por favor, insira um valor numérico válido."
            };
        }

        // Definição das faixas de preço
        const PRECO_MINIMO = 1.00;

        if (valor < PRECO_MINIMO) {
            return {
                sucesso: false,
                mensagem: `Valor insuficiente. O mínimo é R$ ${PRECO_MINIMO.toFixed(2)}.`
            };
        }

        let tempo, custo;

        if (valor >= 3.00) {
            tempo = 120; // minutos
            custo = 3.00;
        } else if (valor >= 1.75) {
            tempo = 60; // minutos
            custo = 1.75;
        } else { // valor >= 1.00
            tempo = 30; // minutos
            custo = 1.00;
        }

        const troco = valor - custo;

        let mensagem = `<strong>Tempo Liberado:</strong> ${tempo} minutos.`;
        if (troco > 0) {
            // Formata o troco para o padrão monetário brasileiro.
            mensagem += `<br><strong>Troco:</strong> ${troco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
        }

        return {
            sucesso: true,
            mensagem: mensagem
        };
    }
}

// --- Lógica de Interação com a Página (DOM) ---
document.addEventListener('DOMContentLoaded', () => {
    const parquimetro = new Parquimetro();

    const valorInput = document.getElementById('valorInput');
    const calcularButton = document.getElementById('calcularButton');
    const resultadoDiv = document.getElementById('resultado');

    calcularButton.addEventListener('click', () => {
        // Converte o valor do input para um número de ponto flutuante.
        const valorInserido = parseFloat(valorInput.value);

        const resultado = parquimetro.calcularPermanencia(valorInserido);

        // Exibe a mensagem na tela
        resultadoDiv.innerHTML = resultado.mensagem;

        // Adiciona ou remove a classe de erro para estilização
        if (resultado.sucesso) {
            resultadoDiv.classList.remove('error');
        } else {
            resultadoDiv.classList.add('error');
        }
    });

    // Permite que o usuário pressione "Enter" no campo de input para calcular
    valorInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            calcularButton.click();
        }
    });
});