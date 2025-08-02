const routes = require('express').Router( );
const GitHubFunctionsController = require('../Controllers/GitHubFunctionsController');
const RegisterController = require('../Controllers/RegisterController');

routes.post('/api/createRepository', GitHubFunctionsController.CreateRepositoryInGithub)
routes.post('/api/register', RegisterController);

module.exports = routes;