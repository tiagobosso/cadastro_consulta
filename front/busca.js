const API_URL = 'http://localhost:3000/api';

window.onload = () => {
    if (!localStorage.getItem('usuarioToken')) {
        window.location.href = 'index.html';
    } else {
        buscarAlbuns(''); // Carrega tudo ao abrir a página
    }
};

document.getElementById('btn-sair').addEventListener('click', () => {
    localStorage.removeItem('usuarioToken');
    window.location.href = 'index.html';
});

// A MÁGICA DA BUSCA: Evento acionado a cada letra digitada
document.getElementById('campo-busca').addEventListener('input', (event) => {
    const termo = event.target.value;
    buscarAlbuns(termo);
});

async function buscarAlbuns(termo) {
    try {
        // Envia o termo digitado para o back-end
        const resposta = await fetch(`${API_URL}/itens?busca=${termo}`, {
            headers: { 'Authorization': localStorage.getItem('usuarioToken') }
        });

        if (resposta.ok) {
            const albuns = await resposta.json();
            const tbody = document.getElementById('lista-resultados');
            tbody.innerHTML = ''; 

            albuns.forEach(album => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${album.artista}</td>
                    <td>${album.nacionalidade}</td>
                    <td>${album.nome_album}</td>
                    <td>${album.ano}</td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (erro) {
        console.error('Erro ao buscar dados:', erro);
    }
}