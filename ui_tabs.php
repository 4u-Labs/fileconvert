<div class="flex flex-wrap justify-center gap-4 py-6" id="main-tabs">
    <button class="tab-btn active" data-tab="audio">🎵 Áudio</button>
    <button class="tab-btn" data-tab="image">🖼️ Imagem</button>
    <button class="tab-btn" data-tab="document">📄 Documento</button>
    <button class="tab-btn" data-tab="video">🎬 Vídeo</button>
    <button class="tab-btn" data-tab="other">📦 Outros</button>
</div>

<div id="tab-loading" class="hidden py-20 text-center">
    <div class="spinner-premium mx-auto mb-4"></div>
    <p class="text-gray-400 animate-pulse">Carregando ferramentas...</p>
</div>

<style>
.spinner-premium {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(139, 92, 246, 0.1);
    border-radius: 50%;
    border-top-color: var(--accent-color);
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
</style>
