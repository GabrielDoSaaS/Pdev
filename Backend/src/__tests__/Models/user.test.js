const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const User = require('../../Models/User');

process.env.JWT_SECRET = 'segredodeteste';
process.env.JWT_EXPIRES_IN = '90d';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('User Model', () => {
  describe('Validação de campos', () => {
    it('deve criar um usuário com dados válidos', async () => {
      const userData = {
        fullName: 'João Silva',
        email: 'joao@example.com',
        password: 'senha123',
        passwordConfirm: 'senha123',
        agreeTerms: true
      };

      const user = await User.create(userData);

      expect(user).toHaveProperty('_id');
      expect(user.fullName).toBe(userData.fullName);
      expect(user.email).toBe(userData.email.toLowerCase());
      expect(user.password).not.toBe(userData.password);
      expect(user.passwordConfirm).toBeUndefined();
      expect(user.agreeTerms).toBe(true);
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('deve falhar sem nome completo', async () => {
      const userData = {
        email: 'joao@example.com',
        password: 'senha123',
        passwordConfirm: 'senha123',
        agreeTerms: true
      };

      await expect(User.create(userData)).rejects.toThrow('Nome completo é obrigatório');
    });

    it('deve falhar com nome muito curto', async () => {
      const userData = {
        fullName: 'Jo',
        email: 'joao@example.com',
        password: 'senha123',
        passwordConfirm: 'senha123',
        agreeTerms: true
      };

      await expect(User.create(userData)).rejects.toThrow('Nome deve ter pelo menos 3 caracteres');
    });

    it('deve falhar com nome muito longo', async () => {
      const longName = 'a'.repeat(51);
      const userData = {
        fullName: longName,
        email: 'joao@example.com',
        password: 'senha123',
        passwordConfirm: 'senha123',
        agreeTerms: true
      };

      await expect(User.create(userData)).rejects.toThrow('Nome muito longo');
    });

    it('deve falhar sem email', async () => {
      const userData = {
        fullName: 'João Silva',
        password: 'senha123',
        passwordConfirm: 'senha123',
        agreeTerms: true
      };

      await expect(User.create(userData)).rejects.toThrow('E-mail é obrigatório');
    });

    it('deve falhar com email inválido', async () => {
      const userData = {
        fullName: 'João Silva',
        email: 'emailinvalido',
        password: 'senha123',
        passwordConfirm: 'senha123',
        agreeTerms: true
      };

      await expect(User.create(userData)).rejects.toThrow('E-mail inválido');
    });

    it('deve converter email para lowercase', async () => {
      const userData = {
        fullName: 'João Silva',
        email: 'JoAo@Example.COM',
        password: 'senha123',
        passwordConfirm: 'senha123',
        agreeTerms: true
      };

      const user = await User.create(userData);
      expect(user.email).toBe('joao@example.com');
    });

    it('deve falhar com email duplicado', async () => {
      const userData = {
        fullName: 'João Silva',
        email: 'joao@example.com',
        password: 'senha123',
        passwordConfirm: 'senha123',
        agreeTerms: true
      };

      await User.create(userData);
      await expect(User.create(userData)).rejects.toThrow(/duplicate key error/);
    });

    it('deve falhar sem senha', async () => {
      const userData = {
        fullName: 'João Silva',
        email: 'joao@example.com',
        passwordConfirm: 'senha123',
        agreeTerms: true
      };

      await expect(User.create(userData)).rejects.toThrow('Senha é obrigatória');
    });

    it('deve falhar com senha muito curta', async () => {
      const userData = {
        fullName: 'João Silva',
        email: 'joao@example.com',
        password: '12345',
        passwordConfirm: '12345',
        agreeTerms: true
      };

      await expect(User.create(userData)).rejects.toThrow('Senha deve ter pelo menos 6 caracteres');
    });

    it('deve falhar com senha muito longa', async () => {
      const longPassword = 'a'.repeat(51);
      const userData = {
        fullName: 'João Silva',
        email: 'joao@example.com',
        password: longPassword,
        passwordConfirm: longPassword,
        agreeTerms: true
      };

      await expect(User.create(userData)).rejects.toThrow('Senha muito longa');
    });

    it('deve falhar sem confirmação de senha', async () => {
      const userData = {
        fullName: 'João Silva',
        email: 'joao@example.com',
        password: 'senha123',
        agreeTerms: true
      };

      await expect(User.create(userData)).rejects.toThrow('Por favor, confirme sua senha');
    });

    it('deve falhar quando senhas não coincidem', async () => {
      const userData = {
        fullName: 'João Silva',
        email: 'joao@example.com',
        password: 'senha123',
        passwordConfirm: 'senhadiferente',
        agreeTerms: true
      };

      await expect(User.create(userData)).rejects.toThrow('As senhas não coincidem');
    });

    it('deve falhar sem aceitar os termos', async () => {
      const userData = {
        fullName: 'João Silva',
        email: 'joao@example.com',
        password: 'senha123',
        passwordConfirm: 'senha123',
        agreeTerms: false
      };

      await expect(User.create(userData)).rejects.toThrow('Você deve aceitar os termos');
    });

    it('deve falhar quando agreeTerms não é fornecido', async () => {
      const userData = {
        fullName: 'João Silva',
        email: 'joao@example.com',
        password: 'senha123',
        passwordConfirm: 'senha123'
      };

      await expect(User.create(userData)).rejects.toThrow('Você deve aceitar os termos');
    });
  });

  describe('Pré-save hooks', () => {
    it('deve hash a senha antes de salvar', async () => {
      const userData = {
        fullName: 'João Silva',
        email: 'joao@example.com',
        password: 'senha123',
        passwordConfirm: 'senha123',
        agreeTerms: true
      };

      const user = await User.create(userData);
      expect(user.password).not.toBe(userData.password);
      expect(user.password).toMatch(/^\$2[ayb]\$.{56}$/);
    });

    it('deve remover passwordConfirm após salvar', async () => {
      const userData = {
        fullName: 'João Silva',
        email: 'joao@example.com',
        password: 'senha123',
        passwordConfirm: 'senha123',
        agreeTerms: true
      };

      const user = await User.create(userData);
      expect(user.passwordConfirm).toBeUndefined();
    });

    it('não deve hash a senha se não foi modificada', async () => {
      const userData = {
        fullName: 'João Silva',
        email: 'joao@example.com',
        password: 'senha123',
        passwordConfirm: 'senha123',
        agreeTerms: true
      };

      const user = await User.create(userData);
      const originalPassword = user.password;

      await User.findByIdAndUpdate(user._id, { fullName: 'João da Silva' }, { runValidators: false });
      const updatedUser = await User.findById(user._id).select('+password');

      expect(updatedUser.password).toBe(originalPassword);
    });
  });

  describe('Métodos de instância', () => {
    describe('correctPassword', () => {
      it('deve retornar true para senha correta', async () => {
        const userData = {
          fullName: 'João Silva',
          email: 'joao@example.com',
          password: 'senha123',
          passwordConfirm: 'senha123',
          agreeTerms: true
        };

        const user = await User.create(userData);
        const isCorrect = await user.correctPassword('senha123', user.password);
        expect(isCorrect).toBe(true);
      });

      it('deve retornar false para senha incorreta', async () => {
        const userData = {
          fullName: 'João Silva',
          email: 'joao@example.com',
          password: 'senha123',
          passwordConfirm: 'senha123',
          agreeTerms: true
        };

        const user = await User.create(userData);
        const isCorrect = await user.correctPassword('senhaerrada', user.password);
        expect(isCorrect).toBe(false);
      });
    });

    describe('createAuthToken', () => {
      it('deve criar um token JWT válido', () => {
        const user = new User({
          fullName: 'João Silva',
          email: 'joao@example.com',
          password: 'senha123',
          passwordConfirm: 'senha123',
          agreeTerms: true
        });

        const token = user.createAuthToken();
        expect(token).toBeDefined();

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        expect(decoded.id).toEqual(user._id.toString());
      });
    });
  });

  describe('Configuração do schema', () => {
    it('deve ter password select false por padrão', async () => {
      const userData = {
        fullName: 'João Silva',
        email: 'joao@example.com',
        password: 'senha123',
        passwordConfirm: 'senha123',
        agreeTerms: true
      };

      const user = await User.create(userData);
      const foundUser = await User.findById(user._id);
      expect(foundUser.password).toBeUndefined();

      const foundUserWithPassword = await User.findById(user._id).select('+password');
      expect(foundUserWithPassword.password).toBeDefined();
    });
  });
});