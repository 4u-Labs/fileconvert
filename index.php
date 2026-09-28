<?php
/**
 * FileConvert - Conversor Universal 100% Local
 * 4U.IA.BR
 */

header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN");
header("X-XSS-Protection: 1; mode=block");

// Função para anti-cache
function version($file) {
    if (file_exists($file)) {
        return "?v=" . filemtime($file);
    }
    return "";
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FileConvert — Conversor Universal de Arquivos (100% Local)</title>
    <meta name="description" content="Converta áudios, imagens em lote, manipule PDFs, extraia áudio de vídeos e use utilitários rápidos com privacidade total: 100% no seu navegador.">
    
    <!-- Favicon & Icons -->
    <link rel="icon" type="image/svg+xml" href="favicon.svg">
    <link rel="alternate icon" type="image/png" href="favicon-32x32.png">
    <link rel="apple-touch-icon" href="icon-192.png">

    <!-- Bibliotecas Externas -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lamejs/1.2.1/lame.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

    <!-- PWA -->
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#4f46e5">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="FileConvert">

    <!-- Estilos Customizados -->
    <link rel="stylesheet" href="style_main.css<?php echo version('style_main.css'); ?>">
</head>
<body class="area">
    <!-- Fundo Animado -->
    <ul class="circles">
        <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>
    </ul>

    <div id="app" class="min-h-screen flex flex-col justify-between">
        <?php include 'ui_header.php'; ?>
        
        <main class="flex-grow container mx-auto px-4 py-6 md:py-10">
            <div class="max-w-4xl mx-auto space-y-6">
                
                <!-- Abas Superiores -->
                <?php include 'ui_tabs.php'; ?>
                
                <!-- Área do Conteúdo da Aba -->
                <div id="tab-content" class="mt-2">
                    <!-- Conteúdo dinâmico aqui -->
                </div>

                <!-- Histórico de Conversões da Sessão -->
                <div id="session-history-container" class="glass-card p-6 rounded-2xl hidden transition-all">
                    <div class="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                        <div class="flex items-center gap-2">
                            <span class="text-xl">🕒</span>
                            <h3 class="text-base font-bold text-white">Arquivos Processados nesta Sessão</h3>
                            <span id="history-count" class="text-xs bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full font-bold">0</span>
                        </div>
                        <div class="flex gap-2">
                            <button id="btn-download-all-zip" onclick="utils.downloadAllHistoryZip()" class="text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5">
                                <span>📦</span> Baixar Todos (.ZIP)
                            </button>
                            <button onclick="utils.clearHistory()" class="text-xs text-white/40 hover:text-white/80 px-2 py-1 transition">
                                Limpar
                            </button>
                        </div>
                    </div>
                    <div id="session-history-list" class="space-y-2 max-h-60 overflow-y-auto pr-1">
                        <!-- Itens do histórico -->
                    </div>
                </div>

            </div>
        </main>

        <?php include 'ui_footer.php'; ?>
    </div>

    <?php include 'ui_components.php'; ?>

    <!-- Scripts -->
    <script src="lib_state.js<?php echo version('lib_state.js'); ?>"></script>
    <script src="lib_utils.js<?php echo version('lib_utils.js'); ?>"></script>
    <script src="lib_audio.js<?php echo version('lib_audio.js'); ?>"></script>
    <script src="lib_image.js<?php echo version('lib_image.js'); ?>"></script>
    <script src="lib_docs.js<?php echo version('lib_docs.js'); ?>"></script>
    <script src="lib_video.js<?php echo version('lib_video.js'); ?>"></script>
    <script src="lib_tools.js<?php echo version('lib_tools.js'); ?>"></script>
    <script>
        // Inicialização do App
        document.addEventListener('DOMContentLoaded', () => {
            if (window.app && typeof window.app.init === 'function') {
                window.app.init();
            }

            // PWA Install Prompt Handler
            let deferredPrompt = null;
            window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;
                const btn = document.getElementById('btnInstallPwa');
                if (btn) btn.style.display = 'inline-flex';
            });

            window.app.installPwa = function() {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then((choiceResult) => {
                        if (choiceResult.outcome === 'accepted') {
                            const btn = document.getElementById('btnInstallPwa');
                            if (btn) btn.style.display = 'none';
                        }
                        deferredPrompt = null;
                    });
                }
            };

            // Registrar Service Worker para PWA
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('sw.js').catch(err => {
                    console.log('SW registration error:', err);
                });
            }
        });
    </script>
</body>
</html>
