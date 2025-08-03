const stripe = require('stripe');
const { CreatePayment } = require('../../Controllers/StripeController');

jest.mock('stripe', () => {
  const mStripe = {
    paymentIntents: {
      create: jest.fn()
    }
  };
  return jest.fn(() => mStripe);
});


process.env.STRIPE_SECRET_KEY = 'Stripe-api-key';

describe('CreatePayment Controller', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('deve criar um PaymentIntent com sucesso e retornar client_secret', async () => {
    const mockPaymentIntent = {
      client_secret: 'test_client_secret_123'
    };
    stripe().paymentIntents.create.mockResolvedValue(mockPaymentIntent);

    await CreatePayment(req, res);

    expect(stripe().paymentIntents.create).toHaveBeenCalledWith({
      amount: 10.0,
      currency: 'usd',
      payment_method_types: ['card']
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      clientSecret: mockPaymentIntent.client_secret
    });
  });

  it('deve retornar erro 500 quando o Stripe falhar', async () => {

    const mockError = new Error('Erro no Stripe');
    stripe().paymentIntents.create.mockRejectedValue(mockError);

    console.error = jest.fn();

    await CreatePayment(req, res);

    expect(console.error).toHaveBeenCalledWith('Erro ao criar o PaymentIntent:', mockError);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Ocorreu um erro no servidor.'
    });
  });

  it('deve usar o valor correto de amount em centavos', async () => {
    await CreatePayment(req, res);
    expect(stripe().paymentIntents.create).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 10.0,
      })
    );
  });
});