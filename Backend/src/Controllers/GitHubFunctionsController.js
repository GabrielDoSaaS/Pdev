const axios = require('axios');
const githubToken = process.env.GITHUB_TOKEN;


if (!githubToken) {
    console.error('Erro: O token do GitHub não foi encontrado. Verifique seu arquivo .env.');
    process.exit(1);
}

const apiUrl = 'https://api.github.com/user/repos';

const config = {
    headers: {
        'Authorization': `token ${githubToken}`,
        'Content-Type': 'application/json'
    }
};

const CreateRepositoryInGithub = async ( req, res ) => {
    const {repoName, description} = req.body;
    
    const data = {
    name: repoName,
    description: description,
    private: false
    };

    try {
        const response = await axios.post(apiUrl, data, config);
        console.log(`Repositório '${response.data.name}' criado com sucesso!`);
        console.log(`URL: ${response.data.html_url}`);

        res.send(response.data.html_url);
    } catch (error) {
        if (error.response) {
            console.error('Erro ao criar o repositório:', error.response.data.message);
        } else if (error.request) {
            console.error('Erro: Nenhuma resposta recebida do GitHub.');
        } else {
            console.error('Erro:', error.message);
        }
    }
}

module.exports = {
    CreateRepositoryInGithub: CreateRepositoryInGithub
}
