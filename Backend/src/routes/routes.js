const routes = require('express').Router( );
const GitHubFunctionsController = require('../Controllers/GitHubFunctionsController');
const LoginController = require('../Controllers/LoginController');
const RegisterController = require('../Controllers/RegisterController');
const RenderFunctionsController = require('../Controllers/RenderFunctionsController');

routes.post('/api/createRepository', GitHubFunctionsController.CreateRepositoryInGithub)
routes.post('/api/register', RegisterController);
routes.post('/api/login', LoginController);
routes.post('/api/createStaticProject', RenderFunctionsController.CreateStaticSite);

module.exports = routes;