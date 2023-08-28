const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;
module.exports = app;

// Middleware para analisar dados JSON
app.use(express.json({ limit: '10mb' }));

// Função para enviar o email
async function sendEmail(destinatario, assunto, texto, anexoBase64, formato) {
  try {
    // Configuração do email
    const emailData = {
      personalizations: [
        {
          to: [{ email: destinatario }],
          subject: assunto,
        },
      ],
      from: { email: 'email de onde esta enviando' },
      content: [{ type: 'text/plain', value: texto }],
    };

    if (anexoBase64) { // Verifique se há anexoBase64
      emailData.attachments = [
        {
          content: anexoBase64,
          filename: `anexo.${formato}`,
        },
      ];
    }

    const headers = {
      Authorization: `Bearer KEY_AQUI`,
      'Content-Type': 'application/json',
    };

    const response = await axios.post('https://api.sendgrid.com/v3/mail/send', emailData, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

// Rota para enviar email com anexo em base64
app.post('/sendEmail', async (req, res) => {
  try {
    const { destinatario, assunto, texto, anexoBase64, formato } = req.body;

    if (!destinatario || !assunto || !texto) {
      return res.status(400).json({ error: 'Campos destinatario, assunto e texto são obrigatórios.' });
    }

    const sendgridResponse = await sendEmail(destinatario, assunto, texto, anexoBase64, formato);

    res.status(200).json({ message: 'Email enviado com sucesso!', sendgridResponse });
  } catch (error) {
    console.error('Erro ao enviar email:', error.message);

    if (error.response && error.response.data && error.response.data.errors) {
      res.status(500).json({ error: 'Erro ao enviar o email.', sendgridErrors: error.response.data.errors });
    } else {
      res.status(500).json({ error: 'Erro desconhecido ao enviar o email.' });
    }
  }
});


app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
