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
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
    }
};

const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meu Portfólio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        html {
            scroll-behavior: smooth;
        }
    </style>
</head>
<body class="bg-gray-100 text-gray-800 font-sans">

    <header class="bg-white shadow-md sticky top-0 z-50">
        <nav class="container mx-auto p-4 flex justify-between items-center">
            <a href="#" class="text-2xl font-bold text-indigo-600">Seu Nome</a>
            <ul class="flex space-x-6">
                <li><a href="#sobre" class="hover:text-indigo-600 transition duration-300">Sobre Mim</a></li>
                <li><a href="#projetos" class="hover:text-indigo-600 transition duration-300">Projetos</a></li>
                <li><a href="#contato" class="hover:text-indigo-600 transition duration-300">Contato</a></li>
            </ul>
        </nav>
    </header>

    <main class="container mx-auto p-4">
        <section id="sobre" class="my-12 py-16 bg-white rounded-lg shadow-lg text-center">
            <div class="max-w-2xl mx-auto">
                <img src="https://via.placeholder.com/150" alt="Sua Foto de Perfil" class="w-32 h-32 rounded-full mx-auto mb-6 shadow-md">
                <h1 class="text-4xl font-bold text-gray-900 mb-2">Olá, eu sou [Seu Nome]!</h1>
                <h2 class="text-xl text-gray-600 mb-4">Desenvolvedor Front-end</h2>
                <p class="text-gray-700 leading-relaxed">
                    Aqui você pode colocar uma breve descrição sobre você. Fale sobre sua experiência, suas habilidades e o que te motiva. Por exemplo: Sou um desenvolvedor web apaixonado por criar interfaces de usuário intuitivas e bonitas. Tenho experiência com tecnologias como JavaScript, React e Tailwind CSS.
                </p>
                <a href="#contato" class="mt-6 inline-block bg-indigo-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-indigo-700 transition duration-300">Entre em Contato</a>
            </div>
        </section>

        <section id="projetos" class="my-12">
            <h2 class="text-3xl font-bold text-center text-gray-900 mb-8">Meus Projetos</h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div class="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
                    <img src="https://via.placeholder.com/400x250" alt="Imagem do Projeto 1" class="w-full h-48 object-cover">
                    <div class="p-6">
                        <h3 class="text-xl font-bold text-gray-900 mb-2">Nome do Projeto 1</h3>
                        <p class="text-gray-700 mb-4">Uma breve descrição do seu projeto. Mencione as tecnologias que você usou e o objetivo dele.</p>
                        <a href="#" class="text-indigo-600 hover:underline font-semibold">Ver Projeto &rarr;</a>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
                    <img src="https://via.placeholder.com/400x250" alt="Imagem do Projeto 2" class="w-full h-48 object-cover">
                    <div class="p-6">
                        <h3 class="text-xl font-bold text-gray-900 mb-2">Nome do Projeto 2</h3>
                        <p class="text-gray-700 mb-4">Outra breve descrição do seu projeto. Fale sobre o que você aprendeu.</p>
                        <a href="#" class="text-indigo-600 hover:underline font-semibold">Ver Projeto &rarr;</a>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
                    <img src="https://via.placeholder.com/400x250" alt="Imagem do Projeto 3" class="w-full h-48 object-cover">
                    <div class="p-6">
                        <h3 class="text-xl font-bold text-gray-900 mb-2">Nome do Projeto 3</h3>
                        <p class="text-gray-700 mb-4">Mais uma descrição. Incentive as pessoas a clicarem e verem o resultado.</p>
                        <a href="#" class="text-indigo-600 hover:underline font-semibold">Ver Projeto &rarr;</a>
                    </div>
                </div>
            </div>
        </section>

        <section id="contato" class="my-12 bg-indigo-600 text-white rounded-lg shadow-lg p-10 text-center">
            <h2 class="text-3xl font-bold mb-4">Vamos Construir Algo Juntos!</h2>
            <p class="text-indigo-100 max-w-2xl mx-auto mb-6">
                Ficou interessado no meu trabalho? Sinta-se à vontade para me enviar uma mensagem. Estou sempre aberto a novas oportunidades e colaborações.
            </p>
            <div class="flex justify-center space-x-6">
                <a href="mailto:seu.email@exemplo.com" class="bg-white text-indigo-600 font-semibold py-3 px-6 rounded-full hover:bg-gray-200 transition duration-300">Email</a>
                <a href="https://linkedin.com/in/seuperfil" target="_blank" class="bg-white text-indigo-600 font-semibold py-3 px-6 rounded-full hover:bg-gray-200 transition duration-300">LinkedIn</a>
                <a href="https://github.com/seuperfil" target="_blank" class="bg-white text-indigo-600 font-semibold py-3 px-6 rounded-full hover:bg-gray-200 transition duration-300">GitHub</a>
            </div>
        </section>
    </main>

    <footer class="bg-gray-800 text-white text-center p-4">
        <p>&copy; 2025 Seu Nome. Todos os direitos reservados.</p>
    </footer>

</body>
</html>`;

const CreateRepositoryInGithub = async (req, res) => {
    const { repoName, description } = req.body;

    const repoData = {
        name: repoName,
        description: description,
        private: false,
        auto_init: true
    };

    try {
        const repoResponse = await axios.post(apiUrl, repoData, config);
        console.log(`Repositório '${repoResponse.data.name}' criado com sucesso!`);
        
        const repoFullName = repoResponse.data.full_name;
        const commitsUrl = `https://api.github.com/repos/${repoFullName}/git/commits`;
        const refsUrl = `https://api.github.com/repos/${repoFullName}/git/refs`;
        const treesUrl = `https://api.github.com/repos/${repoFullName}/git/trees`;
        
        const mainRef = await axios.get(`${refsUrl}/heads/main`, config);
        const latestCommitSha = mainRef.data.object.sha;
        const latestCommit = await axios.get(`${commitsUrl}/${latestCommitSha}`, config);
        const baseTreeSha = latestCommit.data.tree.sha;
        
        const newTree = {
            base_tree: baseTreeSha,
            tree: [
                {
                    path: "public/index.html",
                    mode: "100644",
                    type: "blob",
                    content: htmlContent
                }
            ]
        };
        
        const treeResponse = await axios.post(treesUrl, newTree, config);
        const newTreeSha = treeResponse.data.sha;
        
        const newCommit = {
            message: "Adiciona estrutura inicial com pasta public",
            parents: [latestCommitSha],
            tree: newTreeSha
        };
        
        const commitResponse = await axios.post(commitsUrl, newCommit, config);
        const newCommitSha = commitResponse.data.sha;
        
        await axios.patch(`${refsUrl}/heads/main`, {
            sha: newCommitSha,
            force: true
        }, config);
        
        console.log(`Estrutura de arquivos criada com sucesso no repositório '${repoResponse.data.name}'`);
        console.log(`URL: ${repoResponse.data.html_url}`);

        res.send({
            repoUrl: repoResponse.data.html_url,
            pageUrl: `${repoResponse.data.html_url}/tree/main/public`
        });
    } catch (error) {
        console.error('Erro ao criar o repositório:', error.response ? error.response.data : error.message);
        res.status(500).send({
            error: 'Erro ao criar repositório',
            details: error.response ? error.response.data : error.message
        });
    }
}

const GetRepoInfo = async (req, res) => {
  const repoLinks = req.body;

  if (!Array.isArray(repoLinks) || repoLinks.length === 0) {
    return res.status(400).json({
      error: 'O corpo da requisição deve ser um array de links para repositórios.'
    });
  }

  const allRepoData = [];

  for (const repoLink of repoLinks) {
    try {
      const url = new URL(repoLink);
      const pathParts = url.pathname.split('/');
      const owner = pathParts[1];
      const repo = pathParts[2];

      if (!owner || !repo) {
        console.error(`Link inválido ou com formato incorreto: ${repoLink}`);
        continue;
      }

      const repoApiUrl = `https://api.github.com/repos/${owner}/${repo}`;
      const response = await axios.get(repoApiUrl);
      const repoData = response.data;

      allRepoData.push({
        name: repoData.name,
        owner: repoData.owner.login,
        description: repoData.description,
        url: repoData.html_url,
        stars: repoData.stargazers_count,
        license: repoData.license ? repoData.license.name : 'Nenhuma',
        language: repoData.language,
        forks: repoData.forks_count,
        createdAt: new Date(repoData.created_at).toLocaleDateString(),
        updatedAt: new Date(repoData.updated_at).toLocaleDateString(),
      });

    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error(`Repositório não encontrado para o link: ${repoLink}`);
      } else {
        console.error(`Erro ao processar o link ${repoLink}:`, error.message);
      }

      allRepoData.push({
        link: repoLink,
        error: `Não foi possível obter informações do repositório.`,
      });
    }
  }
  
  res.status(200).json(allRepoData);
};


module.exports = {
    CreateRepositoryInGithub,
    GetRepoInfo
}