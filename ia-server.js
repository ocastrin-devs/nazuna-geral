// server.js (No seu Servidor Node.js)
const express = require('express');
const cors = require('cors'); // Para permitir chamadas do seu frontend
const bodyParser = require('body-parser');
const { conversarComNazuna } = require('./ia_handler'); // Importa a lógica da IA

const app = express();
const port = 3000; // Use a porta que você quiser

app.use(cors()); // Configuração de CORS: importante para testar
app.use(bodyParser.json());

// O endpoint que o frontend chama
app.post('/api/chat-nazuna', async (req, res) => {
    const { mensagemUsuario, sessaoId } = req.body;
    
    if (!mensagemUsuario) {
        return res.status(400).json({ success: false, resposta: "A mensagem está vazia." });
    }

    try {
        const respostaIA = await conversarComNazuna(mensagemUsuario, sessaoId);
        
        res.json({ success: true, resposta: respostaIA });

    } catch (error) {
        console.error("Erro na API Web:", error);
        res.status(500).json({ success: false, resposta: "Erro interno do servidor Nazuna. 🐍" });
    }
});

app.listen(port, () => {
    console.log(`Servidor Nazuna rodando em http://localhost:${port}`);
});