const User = require('../Models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');


const LoginController = () => {
  const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return next(new AppError('Por favor, forneça e-mail e senha', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('E-mail ou senha incorretos', 401));
    }

    const token = user.createAuthToken();

    user.password = undefined;

    res.status(200).json({
      status: 'success',
      message: 'Login realizado com sucesso!',
      token,
      data: {
        user
      }
    });
  });

  return {
    login
  };
};

module.exports = LoginController;