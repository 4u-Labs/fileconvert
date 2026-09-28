<!-- Toast Notification -->
<div id="app-toast" class="toast">
    <div class="flex items-center gap-3">
        <span id="toast-icon">✨</span>
        <span id="toast-message">Mensagem aqui</span>
    </div>
</div>

<!-- Global Spinner/Loader Overlay -->
<div id="global-loader" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] hidden flex-col items-center justify-center">
    <div class="relative">
        <div class="w-16 h-16 border-4 border-white/5 rounded-full"></div>
        <div class="w-16 h-16 border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin absolute top-0 left-0"></div>
    </div>
    <p id="loader-text" class="mt-6 text-white font-medium tracking-wide">Processando Arquivo...</p>
</div>

<!-- Modal Template (Vazio para uso via JS) -->
<div id="app-modal" class="fixed inset-0 z-[1500] hidden flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/80 backdrop-blur-md" onclick="app.closeModal()"></div>
    <div class="glass-card w-full max-w-xl p-8 relative z-10 animate-in fade-in zoom-in duration-300">
        <div id="modal-content"></div>
    </div>
</div>

<style>
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>
