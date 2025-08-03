const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const CreatePayment = async (req, res) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 10.0, 
            currency: 'usd', 
            payment_method_types: ['card']  
        })

        res.status(200).json({  
            clientSecret: paymentIntent.client_secret,  
        }); 

    } catch (error) {
        console.error('Erro ao criar o PaymentIntent:', error); 
        res.status(500).json({  
            error: 'Ocorreu um erro no servidor.',  
        }); 
    }   
};  

module.exports = {CreatePayment: CreatePayment};