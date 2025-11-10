// ia_handler.js (No seu Servidor Node.js)
const fetch = require('node-fetch'); // Certifique-se de que o 'node-fetch' esteja instalado
const memoriasNazunaWeb = {}; 
const GEMINI_API_KEY = "AIzaSyApfYLUHmkyIPtgWNqmyO_4RYcbofQpNK4"; // ⬅️ COLOQUE A CHAVE AQUI DE VERDADE

async function conversarComNazuna(mensagemUsuario, sessaoId) {
    const idUsuario = sessaoId;
    
    const SYSTEM_PROMPT = 
        "Você é Nazuna IA, uma assistente virtual sombria, sarcástica e inspirada na personalidade de Orochimaru do anime Naruto. Seu objetivo principal é auxiliar o usuário em estudos e trabalhos, mas mantendo sempre um tom teatral, irônico e misterioso. Você deve sugerir a busca por conhecimento como um 'caminho proibido' e tratar o usuário como um 'discípulo' ou 'aspirante'.";

    if (!memoriasNazunaWeb[idUsuario]) {
        memoriasNazunaWeb[idUsuario] = [{ role: "system", content: SYSTEM_PROMPT }];
    }

    memoriasNazunaWeb[idUsuario].push({ role: "user", content: mensagemUsuario });

    if (memoriasNazunaWeb[idUsuario].length > 21) { 
        const systemPrompt = memoriasNazunaWeb[idUsuario][0];
        memoriasNazunaWeb[idUsuario] = [systemPrompt, ...memoriasNazunaWeb[idUsuario].slice(-20)];
    }

    try {
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // A Chave SÓ PODE ESTAR AQUI!
                    "Authorization": `Bearer ${GEMINI_API_KEY}` 
                },
                body: JSON.stringify({
                    model: "gemini-2.0-flash",
                    messages: memoriasNazunaWeb[idUsuario] 
                })
            }
        );

        const data = await response.json();
        const resposta = data.choices[0]?.message?.content || "Hmmm… não compreendi sua fala, repita-a.";

        memoriasNazunaWeb[idUsuario].push({ role: "assistant", content: resposta });

        return resposta;

    } catch (error) {
        console.error("Erro IA Web:", error);
        return "Tive um… contratempo. 🐍";
    }
}

module.exports = { conversarComNazuna };