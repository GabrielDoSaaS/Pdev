const axios = require('axios');
const { CreateStaticSite } = require('../../Controllers/RenderFunctionsController');

jest.mock('axios');

const mockApiKey = 'rnd_SqfP8TkKEl4NKsnDZ4LH55oKWnaD';
const mockOwnerId = 'tea-csppglt6l47c73dk0f70';
const originalEnv = process.env;

describe('CreateStaticSite Controller', () => {
  let req, res;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      RENDER_API_KEY: mockApiKey,
      OWNER_ID: mockOwnerId,
    };
    
    req = {
      body: {
        repositoryName: 'my-test-repo',
        repoUrl: 'https://github.com/user/my-test-repo.git',
        branch: 'main',
      },
    };

    res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };

    axios.post.mockClear();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('deve criar um site estático com sucesso e retornar os dados da API', async () => {
    const mockResponseData = {
      id: 'service-id-123',
      name: 'my-test-repo',
      status: 'creating',
    };
    
    axios.post.mockResolvedValue({ data: mockResponseData });

    await CreateStaticSite(req, res);

    const expectedPayload = {
      type: 'static_site',
      name: req.body.repositoryName,
      ownerId: mockOwnerId,
      repo: req.body.repoUrl,
      branch: req.body.branch,
      staticSiteDetails: {
        buildCommand: '',
        publishPath: '.',
      },
    };

    const expectedHeaders = {
      headers: {
        Authorization: `Bearer ${mockApiKey}`,
        'Content-Type': 'application/json',
      },
    };

    expect(axios.post).toHaveBeenCalledWith('https://api.render.com/v1/services', expectedPayload, expectedHeaders);
    expect(res.send).toHaveBeenCalledWith(mockResponseData);
    expect(res.status).not.toHaveBeenCalled();
  });

  test('deve retornar 401 se RENDER_API_KEY não estiver definida', async () => {
    process.env.RENDER_API_KEY = undefined;
    
    await CreateStaticSite(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(axios.post).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });

  test('deve retornar 500 se a chamada à API falhar', async () => {
    const mockError = {
      response: {
        data: { message: 'Erro interno do servidor' },
        status: 500,
      },
    };
 
    axios.post.mockRejectedValue(mockError);

    await CreateStaticSite(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).not.toHaveBeenCalled();
  });
});