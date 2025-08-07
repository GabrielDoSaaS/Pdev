const RegisterController = require('../../Controllers/RegisterController');
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');

jest.mock('../../Models/User', () => ({
  findOne: jest.fn(() => null),
  create: jest.fn(data => ({
    ...data,
    _id: 'mockUserId',
    password: data.password,
    passwordConfirm: undefined,
    save: jest.fn(),
  })),
}));


jest.mock('../../utils/catchAsync', () => fn => fn);

describe('RegisterController', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
        passwordConfirm: 'Password123',
        agreeTerms: true,
      },
    };

    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    next = jest.fn();

    require('../../Models/User').findOne.mockClear();
    require('../../Models/User').create.mockClear();
  });

  test('deve criar um novo usuário e retornar um status 201', async () => {
    
    await RegisterController().register(req, res, next);

    expect(require('../../Models/User').findOne).toHaveBeenCalledWith({ email: req.body.email });

    expect(require('../../Models/User').create).toHaveBeenCalledWith(req.body);

    expect(res.status).toHaveBeenCalledWith(201);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'success',
        message: 'Cadastro realizado com sucesso!',
        data: {
          user: expect.objectContaining({
            fullName: 'Test User',
            email: 'test@example.com',
          }),
        },
      })
    );

    const jsonResponse = res.json.mock.calls[0][0];
    expect(jsonResponse.data.user.password).toBeUndefined();
  });

  test('deve chamar o next com AppError se o fullName estiver faltando', async () => {
    req.body.fullName = undefined;

    await RegisterController().register(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].message).toBe('Por favor, preencha todos os campos');
  });

  test('deve chamar o next com AppError se o email estiver faltando', async () => {
    req.body.email = undefined;

    await RegisterController().register(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].message).toBe('Por favor, preencha todos os campos');
  });

  test('deve chamar o next com AppError se as senhas não coincidirem', async () => {
    req.body.passwordConfirm = 'differentPassword';

    await RegisterController().register(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].message).toBe('As senhas não coincidem');
  });

  test('deve chamar o next com AppError se agreeTerms for false', async () => {
    req.body.agreeTerms = false;

    await RegisterController().register(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].message).toBe('Você deve aceitar os termos');
  });

  test('deve chamar o next com AppError se a senha não tiver uma letra maiúscula', async () => {
    req.body.password = 'password123';
    req.body.passwordConfirm = 'password123';

    await RegisterController().register(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].message).toBe('A senha deve conter pelo menos uma letra maiúscula e um número');
  });

  test('deve chamar o next com AppError se a senha não tiver um número', async () => {
    req.body.password = 'Password';
    req.body.passwordConfirm = 'Password';

    await RegisterController().register(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].message).toBe('A senha deve conter pelo menos uma letra maiúscula e um número');
  });

  test('deve chamar o next com AppError se o e-mail já estiver em uso', async () => {
    require('../../Models/User').findOne.mockImplementationOnce(() => ({ _id: 'existingUserId' }));

    await RegisterController().register(req, res, next);

    expect(require('../../Models/User').findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].message).toBe('Este e-mail já está em uso');
    expect(require('../../Models/User').create).not.toHaveBeenCalled();
  });
});
