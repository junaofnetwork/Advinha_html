// Elementos do DOM
const listaClientesElement = document.getElementById('listaClientes');
const botaoSalvar = document.getElementById('salvar');
const inputNome = document.getElementById('nome');
const inputEmail = document.getElementById('email');

// URL da API (use a sua chave do crudcrud.com)
// Note que mudei o final da URL para /clientes para não misturar com os dados de tarefas.
const API_URL = 'https://crudcrud.com/api/2be5090878424b7b980a21188dd8437d/clientes';

/**
 * Função para carregar e exibir os clientes da API
 */
function carregarClientes() {
    listaClientesElement.innerHTML = '<li>Carregando...</li>';

    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar os dados da API.');
            }
            return response.json();
        })
        .then(listaDeClientes => {
            listaClientesElement.innerHTML = ''; // Limpa a lista
            if (listaDeClientes.length === 0) {
                listaClientesElement.innerHTML = '<li>Nenhum cliente cadastrado.</li>';
            } else {
                listaDeClientes.forEach(cliente => {
                    const item = document.createElement('li');
                    
                    // Cria a estrutura do item da lista
                    item.innerHTML = `
                        <div class="info">
                            <span class="nome">${cliente.nome}</span>
                            <span class="email">${cliente.email}</span>
                        </div>
                        <button class="delete-btn" data-id="${cliente._id}">Excluir</button>
                    `;
                    
                    listaClientesElement.appendChild(item);
                });
            }
        })
        .catch(error => {
            console.error('Houve um problema ao carregar os clientes:', error);
            listaClientesElement.innerHTML = '<li>Erro ao carregar os clientes.</li>';
        });
}

/**
 * Função para salvar (cadastrar) um novo cliente
 */
function salvarCliente() {
    const nome = inputNome.value;
    const email = inputEmail.value;

    // Validação simples
    if (!nome.trim() || !email.trim()) {
        alert('Por favor, preencha o nome e o e-mail.');
        return;
    }

    // Validação de e-mail (básica)
    if (!email.includes('@')) {
        alert('Por favor, insira um e-mail válido.');
        return;
    }

    const cliente = { nome, email };

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cliente),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao salvar o cliente.');
        }
        return response.json();
    })
    .then(() => {
        console.log('Cliente salvo com sucesso!');
        inputNome.value = ''; // Limpa o campo de nome
        inputEmail.value = ''; // Limpa o campo de e-mail
        carregarClientes(); // Recarrega a lista
    })
    .catch(error => {
        console.error('Houve um problema ao salvar o cliente:', error);
        alert('Não foi possível salvar o cliente.');
    });
}

/**
 * Função para deletar um cliente
 * @param {string} id - O ID do cliente a ser deletado
 */
function deletarCliente(id) {
    // Confirmação antes de deletar
    if (!confirm('Tem certeza que deseja excluir este cliente?')) {
        return;
    }

    fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao deletar o cliente.');
        }
        console.log('Cliente deletado com sucesso.');
        carregarClientes(); // Recarrega a lista para refletir a exclusão
    })
    .catch(error => {
        console.error('Houve um problema ao deletar o cliente:', error);
        alert('Não foi possível deletar o cliente.');
    });
}

// --- Event Listeners ---

// Carrega os clientes quando a página é carregada
document.addEventListener('DOMContentLoaded', carregarClientes);

// Adiciona o evento de clique para o botão de salvar
botaoSalvar.addEventListener('click', salvarCliente);

// Adiciona o evento de clique para os botões de deletar (usando delegação de eventos)
listaClientesElement.addEventListener('click', (event) => {
    // Verifica se o elemento clicado é um botão de deletar
    if (event.target.classList.contains('delete-btn')) {
        const clienteId = event.target.dataset.id;
        deletarCliente(clienteId);
    }
});