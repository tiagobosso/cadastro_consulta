const API_URL = 'http://localhost:3000/api';

window.onload = () => {
    if (!localStorage.getItem('usuarioToken')) {
        window.location.href = 'index.html';
    }
};

document.getElementById('btn-sair').addEventListener('click', () => {
    localStorage.removeItem('usuarioToken');
    window.location.href = 'index.html';
});

document.getElementById('form-album').addEventListener('submit', async (event) => {
    event.preventDefault();

    const novoAlbum = {
        artista: document.getElementById('artista').value,
        nacionalidade: document.getElementById('nacionalidade').value,
        nome_album: document.getElementById('nome_album').value,
        ano: document.getElementById('ano').value
    };

    console.log('Álbum enviado:', novoAlbum);

    try {

        const resposta = await fetch(`${API_URL}/itens`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('usuarioToken')
            },
            body: JSON.stringify(novoAlbum)
        });

        if (resposta.ok) {
            alert('Álbum cadastrado com sucesso!');
            document.getElementById('form-album').reset();
        } else {
            const erro = await resposta.json();
            console.log('Erro da API:', erro);
            alert(`Erro ao salvar: ${erro.erro || erro.mensagem || 'Erro desconhecido'}`);
        }
    } catch (erro) {
        alert('Erro de conexão.');
    }
});