const mongoose = require('mongoose');

async function ConnectToDb(uri) {
    try {
        await mongoose.connect(uri);
        console.log('Conectado ao MongoDB com sucesso!');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        throw error;
    }
};

module.exports = ConnectToDb;