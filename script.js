

document.addEventListener('DOMContentLoaded', () => {
    // --- Seleção dos Elementos do DOM ---
    const form = document.getElementById('user-form');
    // Dados Pessoais
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    // Endereço
    const cepInput = document.getElementById('cep');
    const logradouroInput = document.getElementById('logradouro');
    const bairroInput = document.getElementById('bairro');
    const cidadeInput = document.getElementById('cidade');
    const ufInput = document.getElementById('uf');
    const cepError = document.getElementById('cep-error');

    // Chave para o Web Storage
    const STORAGE_KEY = 'userFormData';

    // --- Funções Auxiliares ---

    /**
     * Limpa os campos de endereço e a mensagem de erro do CEP.
     */
    const clearAddressFields = () => {
        logradouroInput.value = '';
        bairroInput.value = '';
        cidadeInput.value = '';
        ufInput.value = '';
        cepError.textContent = '';
    };

    /**
     * Preenche os campos de endereço com os dados da API ViaCEP.
     * @param {object} data - O objeto de dados retornado pela API.
     */
    const fillAddressFields = (data) => {
        logradouroInput.value = data.logradouro;
        bairroInput.value = data.bairro;
        cidadeInput.value = data.localidade;
        ufInput.value = data.uf;
    };

    // --- Funções Principais ---

    /**
     * Busca o CEP na API ViaCEP e preenche o formulário.
     * Função assíncrona para aguardar a resposta da rede.
     */
    const handleCepLookup = async () => {
        const cep = cepInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos
        cepError.textContent = ''; // Limpa erros anteriores

        // Validação do formato do CEP
        if (cep.length !== 8) {
            if (cep.length > 0) {
                cepError.textContent = 'CEP deve conter 8 dígitos.';
            }
            return; // Interrompe a execução se o CEP for inválido
        }

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            if (!response.ok) {
                throw new Error('Não foi possível buscar o CEP. Verifique a rede.');
            }
            
            const data = await response.json();

            if (data.erro) {
                // Se a API retorna 'erro: true', o CEP não foi encontrado
                clearAddressFields();
                cepError.textContent = 'CEP não encontrado.';
            } else {
                // Preenche os campos e dispara o evento para salvar
                fillAddressFields(data);
                form.dispatchEvent(new Event('input', { bubbles: true }));
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            clearAddressFields();
            cepError.textContent = 'Erro ao consultar o serviço de CEP.';
        }
    };

    /**
     * Salva todos os dados do formulário no localStorage.
     */
    const saveFormData = () => {
        const formData = {
            name: nameInput.value,
            email: emailInput.value,
            cep: cepInput.value,
            logradouro: logradouroInput.value,
            bairro: bairroInput.value,
            cidade: cidadeInput.value,
            uf: ufInput.value,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    };

    /**
     * Restaura os dados do formulário a partir do localStorage ao carregar a página.
     */
    const restoreFormData = () => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            const formData = JSON.parse(savedData);
            // Itera sobre o objeto salvo e preenche os campos correspondentes
            Object.keys(formData).forEach(key => {
                const input = document.getElementById(key);
                if (input) {
                    input.value = formData[key];
                }
            });
        }
    };

    // --- Adicionando os Event Listeners ---

    // 1. Busca o CEP quando o usuário sai do campo CEP
    cepInput.addEventListener('blur', handleCepLookup);

    // 2. Salva os dados no localStorage a cada alteração em qualquer campo
    form.addEventListener('input', saveFormData);

    // 3. Restaura os dados ao carregar a página
    restoreFormData();
});
