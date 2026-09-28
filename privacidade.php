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
  <title>Política de Privacidade — FileConvert</title>
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
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
          <span>🔒</span> Arquitetura 100% Client-Side • LGPD & GDPR Compliant
        </div>
        <h1 class="text-3xl md:text-4xl font-extrabold text-white">Política de Privacidade</h1>
        <p class="text-white/60 text-sm mt-1">Vigência: 2026 • Ecossistema 4U.IA.BR</p>
      </div>

      <div class="prose prose-invert max-w-none space-y-6 text-slate-300 leading-relaxed text-sm md:text-base">
        
        <section class="bg-indigo-950/40 p-5 rounded-2xl border border-indigo-500/20">
          <h2 class="text-lg font-bold text-indigo-300 mb-2 flex items-center gap-2">
            <span>🛡️</span> Princípio Central: Seus Arquivos Nunca Saem do Seu Dispositivo
          </h2>
          <p>
            Diferente da maioria dos conversores online que obrigam o upload dos seus arquivos para servidores desconhecidos na nuvem, o <strong>FileConvert opera 100% localmente no seu próprio navegador</strong> via WebAssembly, HTML5 Canvas API e Web Audio API. 
            Nenhum documento, áudio, imagem ou vídeo é transmitido pela internet, garantindo sigilo absoluto para uso pessoal, corporativo ou confidencial.
          </p>
        </section>

        <div>
          <h3 class="text-xl font-bold text-white mb-2">1. Dados e Arquivos Processados</h3>
          <p>
            Todos os arquivos selecionados para conversão (imagens, áudios, PDFs, vídeos ou dados) permanecem unicamente na memória volátil (RAM) da sua máquina enquanto a aba estiver aberta. Ao fechar a página ou concluir o download, a memória é imediatamente liberada pelo navegador.
          </p>
        </div>

        <div>
          <h3 class="text-xl font-bold text-white mb-2">2. Ausência de Rastreamento & Cookies Invasivos</h3>
          <p>
            O FileConvert <strong>não utiliza cookies de rastreamento publicitário, scripts de vigilância comportamental ou pixels de terceiros</strong>. O histórico recente de conversões exibido na interface é gravado exclusivamente na memória de sessão do seu navegador e não é compartilhado com ninguém.
          </p>
        </div>

        <div>
          <h3 class="text-xl font-bold text-white mb-2">3. Conformidade com a LGPD e GDPR</h3>
          <p>
            Nossa plataforma segue rigorosamente a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 - LGPD) do Brasil e o General Data Protection Regulation (GDPR) da União Europeia. Por adotarmos o princípio de <em>Privacy by Design</em> e retenção zero, seus dados pessoais e arquivos estão plenamente resguardados.
          </p>
        </div>

        <div>
          <h3 class="text-xl font-bold text-white mb-2">4. Contato</h3>
          <p>
            Em caso de dúvidas sobre nossa arquitetura de privacidade ou para enviar sugestões de novos formatos de conversão, utilize nossa <a href="suporte.php" class="text-indigo-400 hover:text-indigo-300 underline font-semibold">Central de Suporte</a> ou acesse <a href="https://4u.ia.br" class="text-indigo-400 hover:text-indigo-300 underline font-semibold">4u.ia.br</a>.
          </p>
        </div>

      </div>

      <div class="pt-6 border-t border-white/10 flex flex-wrap gap-4 justify-between items-center text-xs text-white/50">
        <span>&copy; 2026 4U.IA.BR. Todos os direitos reservados.</span>
        <div class="flex gap-4">
          <a href="termos.php" class="hover:text-white transition">Termos de Uso</a>
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
