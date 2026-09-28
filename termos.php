<?php
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN");
header("X-XSS-Protection: 1; mode=block");
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Termos de Uso — FileConvert</title>
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="alternate icon" type="image/png" href="favicon-32x32.png">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: 'Inter', sans-serif; }
    .glass-card {
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.12);
    }
  </style>
</head>
<body class="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">

  <!-- Header -->
  <header class="border-b border-white/10 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
    <div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
      <a href="index.php" class="flex items-center gap-3 group">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
          <span class="text-xl">🔄</span>
        </div>
        <div>
          <span class="text-xl font-black tracking-tight text-white block leading-none">FileConvert</span>
          <span class="text-xs text-indigo-400 font-bold uppercase tracking-wider">4U.IA.BR</span>
        </div>
      </a>
      <div class="flex items-center gap-3">
        <a href="index.php" class="text-xs md:text-sm font-bold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl transition border border-white/10">
          ← Voltar ao Conversor
        </a>
      </div>
    </div>
  </header>

  <!-- Content -->
  <main class="max-w-4xl mx-auto px-4 py-12 flex-1 w-full">
    <div class="glass-card rounded-3xl p-6 md:p-10 shadow-2xl space-y-8">
      
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3">
          <span>📜</span> Termos de Serviço • Uso Livre e Ilimitado
        </div>
        <h1 class="text-3xl md:text-4xl font-extrabold text-white">Termos de Uso</h1>
        <p class="text-white/60 text-sm mt-1">Vigência: 2026 • Plataforma 4U.IA.BR</p>
      </div>

      <div class="prose prose-invert max-w-none space-y-6 text-slate-300 leading-relaxed text-sm md:text-base">
        
        <div>
          <h3 class="text-xl font-bold text-white mb-2">1. Aceitação Geral</h3>
          <p>
            Ao utilizar o <strong>FileConvert</strong>, você concorda com as condições aqui expostas. A ferramenta é fornecida gratuitamente pelo laboratório <strong>4U-Labs</strong> para apoiar criadores, estudantes, designers e empresas em suas necessidades cotidianas de conversão de arquivos.
          </p>
        </div>

        <div>
          <h3 class="text-xl font-bold text-white mb-2">2. Gratuidade e Sem Limites Ocultos</h3>
          <p>
            O FileConvert é <strong>100% gratuito</strong>. Não há cobranças por arquivos excedentes, limites artificiais de conversões diárias ou exigência de cartões de crédito. A velocidade e a capacidade de processamento dependem diretamente do hardware do dispositivo em que você executa a aplicação.
          </p>
        </div>

        <div>
          <h3 class="text-xl font-bold text-white mb-2">3. Responsabilidade Sobre o Conteúdo</h3>
          <p>
            Como os arquivos são processados estritamente na sua máquina local sem qualquer intermediação de servidores nossos, você é o único e exclusivo responsável pelo conteúdo dos arquivos processados, respeitando leis de direitos autorais e normas de propriedade intelectual aplicáveis.
          </p>
        </div>

        <div>
          <h3 class="text-xl font-bold text-white mb-2">4. Código Aberto e Direitos</h3>
          <p>
            O FileConvert é um projeto aberto e mantido com orgulho pela organização <strong>4u-Labs</strong> no GitHub. Encorajamos o uso, sugestões e contribuições da comunidade de desenvolvedores.
          </p>
        </div>

      </div>

      <div class="pt-6 border-t border-white/10 flex flex-wrap gap-4 justify-between items-center text-xs text-white/50">
        <span>&copy; 2026 4U.IA.BR. Todos os direitos reservados.</span>
        <div class="flex gap-4">
          <a href="privacidade.php" class="hover:text-white transition">Política de Privacidade</a>
          <a href="suporte.php" class="hover:text-white transition">Suporte & FAQ</a>
        </div>
      </div>

    </div>
  </main>

  <!-- Footer -->
  <footer class="border-t border-white/10 bg-slate-950/80 py-8 text-center text-xs text-slate-400">
    <div class="max-w-5xl mx-auto px-4 space-y-3">
      <div class="flex justify-center items-center gap-6">
        <a href="https://4u.ia.br" class="hover:text-indigo-400 transition font-bold">4U.IA.BR</a>
        <a href="https://github.com/4u-Labs" target="_blank" class="hover:text-white transition">GitHub 4u-Labs</a>
        <a href="https://www.paypal.com/ncp/payment/L7YRCS984T33N" target="_blank" class="text-amber-400 hover:text-amber-300 font-bold transition">Apoiar Projeto (PayPal)</a>
      </div>
    </div>
  </footer>

</body>
</html>
