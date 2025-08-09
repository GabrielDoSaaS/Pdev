const routes = require('express').Router( );
const GitHubFunctionsController = require('../Controllers/GitHubFunctionsController');
const LoginController = require('../Controllers/LoginController');
const RegisterController = require('../Controllers/RegisterController');
const RenderFunctionsController = require('../Controllers/RenderFunctionsController');
const StripeController = require('../Controllers/StripeController');

routes.post('/api/createRepository', GitHubFunctionsController.CreateRepositoryInGithub);
routes.post('/api/register', RegisterController);
routes.post('/api/login', LoginController);
routes.post('/api/createStaticProject', RenderFunctionsController.CreateStaticSite);
routes.post('/api/create-payment', StripeController.CreatePayment);
routes.post('/api/get-repo-info', GitHubFunctionsController.GetRepoInfo);

module.exports = routes;