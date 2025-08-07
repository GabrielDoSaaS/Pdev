const axios = require('axios');
const { CreateRepositoryInGithub } = require('../../Controllers/GitHubFunctionsController');

jest.mock('axios');

const mockGithubToken = 'mock-github-token';
const originalEnv = process.env;

describe('CreateRepositoryInGithub Controller', () => {
  let req, res;
  let mockExit;
  let mockConsoleError;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      GITHUB_TOKEN: mockGithubToken,
    };
    
    mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
    mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    req = {
      body: {
        repoName: 'my-portfolio',
        description: 'Um portfólio pessoal criado com Node.js',
      },
    };

    res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };

    axios.post.mockClear();
    axios.get.mockClear();
    axios.patch.mockClear();
  });

  afterAll(() => {
    process.env = originalEnv;
    mockExit.mockRestore();
    mockConsoleError.mockRestore();
  });

  test('deve criar um repositório e adicionar o arquivo index.html com sucesso', async () => {
    const repoResponseData = {
      name: 'my-portfolio',
      full_name: 'test-user/my-portfolio',
      html_url: 'https://github.com/test-user/my-portfolio',
    };
    const mainRefResponseData = {
      object: {
        sha: 'latest-commit-sha',
      },
    };
    const latestCommitResponseData = {
      tree: {
        sha: 'base-tree-sha',
      },
    };
    const newTreeResponseData = {
      sha: 'new-tree-sha',
    };
    const newCommitResponseData = {
      sha: 'new-commit-sha',
    };

    axios.post.mockResolvedValueOnce({ data: repoResponseData });
    axios.get.mockResolvedValueOnce({ data: mainRefResponseData });
    axios.get.mockResolvedValueOnce({ data: latestCommitResponseData });
    axios.post.mockResolvedValueOnce({ data: newTreeResponseData });
    axios.post.mockResolvedValueOnce({ data: newCommitResponseData });
    axios.patch.mockResolvedValueOnce({});

    await CreateRepositoryInGithub(req, res);

    expect(axios.post).toHaveBeenCalledTimes(3);
    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(axios.patch).toHaveBeenCalledTimes(1);
    
    expect(res.send).toHaveBeenCalledWith({
      repoUrl: 'https://github.com/test-user/my-portfolio',
      pageUrl: 'https://github.com/test-user/my-portfolio/tree/main/public',
    });
    expect(res.status).not.toHaveBeenCalled();
    
    expect(mockExit).not.toHaveBeenCalled();
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  test('deve lidar com falha na criação do repositório', async () => {
    const mockError = {
      response: {
        data: { message: 'Repositório já existe' },
        status: 422,
      },
    };
    
    axios.post.mockRejectedValue(mockError);

    await CreateRepositoryInGithub(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      error: 'Erro ao criar repositório',
      details: { message: 'Repositório já existe' },
    });
  });

  test('deve lidar com falha na atualização do repositório', async () => {
    const repoResponseData = {
      name: 'my-portfolio',
      full_name: 'test-user/my-portfolio',
      html_url: 'https://github.com/test-user/my-portfolio',
    };
    const mockError = {
      response: {
        data: { message: 'Erro de permissão' },
        status: 403,
      },
    };
    
    axios.post.mockResolvedValueOnce({ data: repoResponseData });
    axios.get.mockRejectedValue(mockError);

    await CreateRepositoryInGithub(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      error: 'Erro ao criar repositório',
      details: { message: 'Erro de permissão' },
    });
  });
  
  test('deve chamar console.error e process.exit se o token do GitHub não estiver definido', async () => {
    process.env.GITHUB_TOKEN = undefined;
    
    jest.resetModules();
    const { CreateRepositoryInGithub: createRepoWithNoToken } = require('../../Controllers/CreateRepositoryInGithub');
    
    createRepoWithNoToken(req, res);
    
    expect(mockConsoleError).toHaveBeenCalledWith('Erro: O token do GitHub não foi encontrado. Verifique seu arquivo .env.');
    expect(mockExit).toHaveBeenCalledWith(1);
    
    jest.resetModules();
    require('../../Controllers/CreateRepositoryInGithub');
  });
});
