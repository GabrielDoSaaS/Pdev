const User = require('../Models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const RegisterController = () => {
  const register = catchAsync(async (req, res, next) => {
    
    if (!req.body.fullName || !req.body.email || !req.body.password || !req.body.passwordConfirm) {
      return next(new AppError('Por favor, preencha todos os campos', 400));
    }

    if (req.body.password !== req.body.passwordConfirm) {
      return next(new AppError('As senhas não coincidem', 400));
    }

    if (!req.body.agreeTerms) {
      return next(new AppError('Você deve aceitar os termos', 400));
    }

   
    if (!/[A-Z]/.test(req.body.password) || !/[0-9]/.test(req.body.password)) {
      return next(
        new AppError('A senha deve conter pelo menos uma letra maiúscula e um número', 400)
      );
    }

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return next(new AppError('Este e-mail já está em uso', 400));
    }

    const newUser = await User.create({
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      agreeTerms: req.body.agreeTerms
    });

    newUser.password = undefined;

    res.status(201).json({
      status: 'success',
      message: 'Cadastro realizado com sucesso!',
      data: {
        user: newUser
      }
    });
  });

  return {
    register
  };
};

module.exports = RegisterController;