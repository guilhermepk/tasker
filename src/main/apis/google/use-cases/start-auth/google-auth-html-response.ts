export const googleAuthHtmlResponse = `
  <!DOCTYPE html>
  <html lang="pt-br">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tasker - Autenticação do Google concluída</title>
      <link rel="icon" href="https://www.google.com/favicon.ico" type="image/x-icon">
      
      <style>
          /* Reset básico */
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }

          body {
              font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              /* Fundo gradiente escuro profundo, similar à imagem */
              background: linear-gradient(135deg, #020024 0%, #090979 35%, #00d4ff 100%); 
              /* Ajustando para ficar mais próximo do tom "Dark Navy" da sua imagem */
              background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              color: #ffffff;
              overflow: hidden; /* Evita rolagens desnecessárias */
          }

          /* Container do cartão estilo "Glassmorphism" */
          .card {
              /* Fundo semi-transparente escuro */
              background: rgba(30, 41, 59, 0.6); 
              /* Desfoque do fundo para o efeito de vidro */
              backdrop-filter: blur(12px);
              -webkit-backdrop-filter: blur(12px);
              
              padding: 40px;
              border-radius: 16px;
              
              /* Borda sutil e translúcida */
              border: 1px solid rgba(255, 255, 255, 0.1);
              
              /* Sombra suave para dar profundidade */
              box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
              
              text-align: center;
              max-width: 420px;
              width: 90%;
              animation: fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1);
          }

          /* Ícone de Sucesso */
          .icon-container {
              width: 80px;
              height: 80px;
              /* Fundo do ícone levemente mais claro que o card */
              background-color: rgba(34, 197, 94, 0.2); 
              border-radius: 50%;
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 0 auto 24px auto;
              border: 1px solid rgba(34, 197, 94, 0.3);
          }

          .checkmark {
              color: #4ade80; /* Verde neon vibrante */
              font-size: 36px;
              user-select: none;
          }

          /* Tipografia */
          h1 {
              font-size: 24px;
              margin-bottom: 12px;
              font-weight: 600;
              color: #ffffff;
              letter-spacing: 0.5px;
          }

          p {
              font-size: 16px;
              color: #cbd5e1; /* Cinza claro azulado */
              line-height: 1.6;
              margin-bottom: 32px;
          }

          /* Animação de entrada suave */
          @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
          }
      </style>
  </head>
  <body>

      <div class="card">
          <div class="icon-container">
              <span class="checkmark">&#10004;</span>
          </div>

          <h1>Autenticação Concluída!</h1>
          <p>O Tasker foi vinculado à sua conta do Google com sucesso.<br>Você já pode fechar esta janela.</p>
      </div>

  </body>
  </html>
`;

// const whiteTheme = `
//   <!DOCTYPE html>
// <html lang="pt-br">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Tasker - Autenticação do Google concluída</title>
//     <style>
//         /* Reset básico */
//         * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//         }

//         body {
//             font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
//             background-color: #f0f2f5; /* Cor de fundo suave */
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             height: 100vh;
//             color: #333;
//         }

//         /* Container do cartão */
//         .card {
//             background-color: #ffffff;
//             padding: 40px;
//             border-radius: 12px;
//             box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
//             text-align: center;
//             max-width: 400px;
//             width: 90%;
//             animation: fadeIn 0.5s ease-out;
//         }

//         /* Ícone de Sucesso */
//         .icon-container {
//             width: 80px;
//             height: 80px;
//             background-color: #e6f4ea;
//             border-radius: 50%;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             margin: 0 auto 20px auto;
//         }

//         .checkmark {
//             color: #34a853; /* Verde do Google */
//             font-size: 40px;
//         }

//         /* Tipografia */
//         h1 {
//             font-size: 22px;
//             margin-bottom: 10px;
//             color: #202124;
//         }

//         p {
//             font-size: 16px;
//             color: #5f6368;
//             line-height: 1.5;
//             margin-bottom: 20px;
//         }

//         /* Animação de entrada */
//         @keyframes fadeIn {
//             from { opacity: 0; transform: translateY(10px); }
//             to { opacity: 1; transform: translateY(0); }
//         }
//     </style>
// </head>
// <body>

//     <div class="card">
//         <div class="icon-container">
//             <span class="checkmark">&#10004;</span>
//         </div>

//         <h1>Autenticação Concluída!</h1>
//         <p>O Tasker foi vinculado à sua conta do Google com sucesso. Você já pode fechar esta janela.</p>
//     </div>

// </body>
// </html>
// `;