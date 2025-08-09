const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Nome completo é obrigatório'],
    minlength: [3, 'Nome deve ter pelo menos 3 caracteres'],
    maxlength: [50, 'Nome muito longo'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'E-mail é obrigatório'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'E-mail inválido'],
    maxlength: [100, 'E-mail muito longo']
  },
  password: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'Senha deve ter pelo menos 6 caracteres'],
    maxlength: [50, 'Senha muito longa'],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Por favor, confirme sua senha'],
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'As senhas não coincidem'
    }
  },
  agreeTerms: {
    type: Boolean,
    required: [true, 'Você deve aceitar os termos'],
    validate: {
      validator: function(value) {
        return value === true;
      },
      message: 'Você deve aceitar os termos'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createAuthToken = function() {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;