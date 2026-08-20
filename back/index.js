const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const arquivoUsuarios = path.join(__dirname, 'usuarios.json');
const arquivoAlbuns = path.join(__dirname, 'albuns.json');

function lerArquivo(caminho) {
    if (!fs.existsSync(caminho)) {
        const dadosIniciais =
            caminho === arquivoUsuarios
                ? { usuarios: [] }
                : { itens: [] };

        fs.writeFileSync(
            caminho,
            JSON.stringify(dadosIniciais, null, 2),
            'utf-8'
        );

        return dadosIniciais;
    }

    try {
        const conteudo = fs.readFileSync(caminho, 'utf-8');
        return JSON.parse(conteudo);
    } catch (erro) {
        console.error('Erro ao ler o arquivo JSON:', erro);
        return caminho === arquivoUsuarios
            ? { usuarios: [] }
            : { itens: [] };
    }
}

function salvarArquivo(caminho, dados) {
    try {
        fs.writeFileSync(
            caminho,
            JSON.stringify(dados, null, 2),
            'utf-8'
        );
    } catch (erro) {
        console.error('Erro ao salvar o arquivo JSON:', erro);
    }
}



function verificarToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({
            erro: 'Acesso negado. Token não fornecido.'
        });
    }

    if (!token.startsWith('token_secreto_')) {
        return res.status(401).json({
            erro: 'Token inválido ou expirado.'
        });
    }

    next();
}


app.post('/api/cadastro', (req, res) => {
    const { nome, email, senha } = req.body;

    const db = lerArquivo(arquivoUsuarios);
    
    if (db.usuarios.find(user => user.email === email)) {
        return res.status(400).json({
            erro: 'E-mail já cadastrado.'
        });
    }

    db.usuarios.push({
        nome,
        email,
        senha
    });

    salvarArquivo(arquivoUsuarios, db);

    res.status(201).json({
        mensagem: 'Sucesso!'
    });
});

app.post('/api/login', (req, res) => {
    const { email, senha } = req.body;

    const db = lerArquivo(arquivoUsuarios);

    const usuario = db.usuarios.find(
        user => user.email === email && user.senha === senha
    );

    if (usuario) {
        res.status(200).json({
            mensagem: 'Login realizado com sucesso!',
            token:
                'token_secreto_' +
                Math.random().toString(36).substring(2)
        });
    } else {
        res.status(401).json({
            erro: 'E-mail ou senha incorretos.'
        });
    }
});

app.post('/api/itens', verificarToken, (req, res) => {
    const {
        artista,
        nacionalidade,
        nome_album,
        ano
    } = req.body;

    if (!artista || !nome_album) {
        return res.status(400).json({
            erro: 'Artista e Nome do Álbum são obrigatórios.'
        });
    }
    const dados = lerArquivo(arquivoAlbuns);

    const novoAlbum = {
        id: Date.now(),
        artista,
        nacionalidade,
        nome_album,
        ano
    };

    dados.itens.push(novoAlbum);

    salvarArquivo(arquivoAlbuns, dados);

    res.status(201).json({
        mensagem: 'Álbum cadastrado com sucesso!',
        item: novoAlbum
    });
});

app.get('/api/itens', verificarToken, (req, res) => {
    const dados = lerArquivo(arquivoAlbuns);

    let albuns = dados.itens;
    const termoBusca = req.query.busca;

    if (termoBusca) {
        const termo = termoBusca.toLowerCase();


        albuns = albuns.filter(album =>
            String(album.artista)
                .toLowerCase()
                .includes(termo) ||

            String(album.nome_album)
                .toLowerCase()
                .includes(termo) ||

            String(album.ano)
                .toLowerCase()
                .includes(termo) ||

            String(album.nacionalidade)
                .toLowerCase()
                .includes(termo)
        );
    }

    res.status(200).json(albuns);
});

app.listen(PORT, () => {
    console.log(
        `Servidor rodando! API disponível em http://localhost:${PORT}`
    );

    console.log(
        `Usuários: ${arquivoUsuarios}`
    );

    console.log(
        `Álbuns: ${arquivoAlbuns}`
    );
});
