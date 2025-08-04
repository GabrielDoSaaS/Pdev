const axios = require('axios');

const CreateStaticSite = async ( req, res ) => {
    const {repositoryName, repoUrl, branch} = req.body;    if (!process.env.RENDER_API_KEY) {
        console.error('RENDER_API_KEY não está definida nas variáveis de ambiente.');
        res.status(401);
        return;
    }

    const payload = {
        type: 'static_site',
        name: repositoryName,
        ownerId: process.env.OWNER_ID,
        repo: repoUrl,
        branch: branch,
        staticSiteDetails: {
        buildCommand: '',
        publishPath: '.',
        },
    };

    try {
        const response = await axios.post('https://api.render.com/v1/services', payload, {
            headers: {
            'Authorization': `Bearer ${process.env.RENDER_API_KEY}`,
            'Content-Type': 'application/json'
        }
    });

    console.log('Site estático criado com sucesso!');
    console.log('Detalhes do serviço:', response.data);
    res.send(response.data);
  } catch (error) {
    console.error('Erro ao criar o site estático:', error.response ? error.response.data : error.message);
    res.status(500);
  }
};

module.exports = {CreateStaticSite: CreateStaticSite};