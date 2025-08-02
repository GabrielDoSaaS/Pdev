const routes = require('express').Router( );
const GitHubFunctionsController = require('../Controllers/GitHubFunctionsController');
const LoginController = require('../Controllers/LoginController');
const RegisterController = require('../Controllers/RegisterController');

routes.post('/api/createRepository', GitHubFunctionsController.CreateRepositoryInGithub)
routes.post('/api/register', RegisterController);
routes.post('/api/login', LoginController);

module.exports = routes;