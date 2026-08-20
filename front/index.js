function toggleForms() {
    const loginBox = document.getElementById('login-box');
    const registerBox = document.getElementById('register-box');

    loginBox.classList.toggle('hidden');
    registerBox.classList.toggle('hidden');
}

const API_URL = 'http://localhost:3000/api';

document.getElementById('register-form').addEventListener('submit', async function (event) {
    event.preventDefault(); 
    
    const nome = document.getElementById('reg-nome').value;
    const email = document.getElementById('reg-email').value;
    const senha = document.getElementById('reg-senha').value;

    const dadosUsuario = { nome, email, senha };

    try {
        const resposta = await fetch(`${API_URL}/cadastro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosUsuario)
        });

        if (resposta.ok) {
            alert('Cadastro realizado com sucesso!');
            toggleForms(); 
        } else {
            alert('Erro ao realizar o cadastro.');
        }
    } catch (erro) {
        console.error('Erro de conexão:', erro);
        alert('Não foi possível conectar à API.');
    }
});

document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;

    const dadosLogin = { email, senha };

    try {
        const resposta = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosLogin)
        });
        
        if (resposta.ok) {
            const dados = await resposta.json();
            localStorage.setItem('usuarioToken', dados.token);

            window.location.href = 'cadastro.html';
        }

        else {
            alert('E-mail ou senha incorretos.');
        }
    }
    catch (erro) {
        console.error('Erro de conexão:', erro);
        alert('Não foi possível conectar à API.');
    }

});
