const LoginController = require('../../Controllers/LoginController');
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');

jest.mock('../../Models/User', () => ({
  findOne: jest.fn(),
}));

jest.mock('../../utils/catchAsync', () => fn => fn);

describe('LoginController', () => {
  let req, res, next;

  const mockUser = {
    _id: 'mockUserId',
    email: 'test@example.com',
    password: 'hashedPassword',
    correctPassword: jest.fn(),
    createAuthToken: jest.fn(() => 'mockAuthToken'),
  };

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: 'Password123',
      },
    };

    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    next = jest.fn();

    const findOneChain = {
      select: jest.fn().mockResolvedValue(mockUser),
    };
    require('../../Models/User').findOne.mockReturnValue(findOneChain);

    require('../../Models/User').findOne.mockClear();
    findOneChain.select.mockClear();
    mockUser.correctPassword.mockClear();
    mockUser.createAuthToken.mockClear();
    next.mockClear();
  });

  test('deve logar com sucesso e retornar um token', async () => { 
    mockUser.correctPassword.mockResolvedValueOnce(true);

    await LoginController().login(req, res, next);
    expect(require('../../Models/User').findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(require('../../Models/User').findOne().select).toHaveBeenCalledWith('+password');
    expect(mockUser.correctPassword).toHaveBeenCalledWith(req.body.password, 'hashedPassword');
    expect(mockUser.createAuthToken).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'success',
        message: 'Login realizado com sucesso!',
        token: 'mockAuthToken',
        data: {
          user: expect.objectContaining({
            email: 'test@example.com',
          }),
        },
      })
    );
    
    const jsonResponse = res.json.mock.calls[0][0];
    expect(jsonResponse.data.user.password).toBeUndefined();
  });

  test('deve chamar o next com AppError se o e-mail ou a senha estiverem faltando', async () => {
    req.body.email = undefined;
    await LoginController().login(req, res, next);
    expect(next).toHaveBeenCalledWith(new AppError('Por favor, forneça e-mail e senha', 400));
    next.mockClear();

    req.body.email = 'test@example.com';
    req.body.password = undefined;
    await LoginController().login(req, res, next);
    expect(next).toHaveBeenCalledWith(new AppError('Por favor, forneça e-mail e senha', 400));
  });

  test('deve chamar o next com AppError para e-mail incorreto', async () => {
    require('../../Models/User').findOne().select.mockResolvedValueOnce(null);
    await LoginController().login(req, res, next);
    expect(next).toHaveBeenCalledWith(new AppError('E-mail ou senha incorretos', 401));

    expect(mockUser.correctPassword).not.toHaveBeenCalled();
    expect(mockUser.createAuthToken).not.toHaveBeenCalled();
  });

  test('deve chamar o next com AppError para senha incorreta', async () => {
    mockUser.correctPassword.mockResolvedValueOnce(false);

    await LoginController().login(req, res, next);

    expect(next).toHaveBeenCalledWith(new AppError('E-mail ou senha incorretos', 401));
    expect(mockUser.correctPassword).toHaveBeenCalled();
    expect(mockUser.createAuthToken).not.toHaveBeenCalled();
  });
});
