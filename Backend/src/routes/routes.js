const routes = require('express').Router( );
const GitHubFunctionsController = require('../Controllers/GitHubFunctionsController');

routes.post('/api/createRepository', GitHubFunctionsController.CreateRepositoryInGithub)


module.exports = routes;