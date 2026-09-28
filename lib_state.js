/**
 * FileConvert - lib_state.js
 * Gerenciamento de estado global (window.appState)
 */

window.appState = {
    currentTab: 'audio',
    isProcessing: false,
    history: [],
    settings: {
        theme: 'dark'
    }
};

window.app = {
    init: function() {
        console.log('FileConvert Iniciado 🚀');
        this.setupTabs();
        this.loadTab('audio'); // Tab inicial
        this.initParticles();
    },

    setupTabs: function() {
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });
    },

    switchTab: function(tabName) {
        if (appState.currentTab === tabName) return;
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
        });

        appState.currentTab = tabName;
        this.loadTab(tabName);
    },

    loadTab: async function(tabName) {
        const contentArea = document.getElementById('tab-content');
        const loader = document.getElementById('tab-loading');
        
        contentArea.classList.add('opacity-0');
        loader.classList.remove('hidden');
        
        // Simulação de carregamento de módulo/componente
        // Na prática, como temos tudo em arquivos lib_*.js, vamos apenas limpar e injetar o HTML
        setTimeout(() => {
            this.renderTabContent(tabName);
            loader.classList.add('hidden');
            contentArea.classList.remove('opacity-0');
            contentArea.classList.add('transition-opacity', 'duration-500');
        }, 300);
    },

    renderTabContent: function(tabName) {
        const contentArea = document.getElementById('tab-content');
        if (!contentArea) return;
        
        const modules = {
            audio: window.audioConverter,
            image: window.imageConverter,
            document: window.docsConverter,
            video: window.videoConverter,
            other: window.toolsConverter
        };
        
        const mod = modules[tabName];
        if (mod && typeof mod.render === 'function') {
            contentArea.innerHTML = mod.render();
            if (typeof mod.init === 'function') {
                try {
                    mod.init();
                } catch (e) {
                    console.error(`Erro ao inicializar módulo ${tabName}:`, e);
                }
            }
        } else {
            contentArea.innerHTML = `<div class="glass-card p-12 text-center">
                <h2 class="text-2xl font-bold mb-4">Módulo ${tabName} em desenvolvimento</h2>
                <p class="text-gray-400">Estamos preparando as melhores ferramentas para você.</p>
            </div>`;
        }
    },

    // UI Helpers
    showToast: function(message, icon = '✨') {
        const toast = document.getElementById('app-toast');
        const msgEl = document.getElementById('toast-message');
        const iconEl = document.getElementById('toast-icon');
        
        msgEl.textContent = message;
        iconEl.textContent = icon;
        
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    },

    showLoader: function(text = 'Processando...') {
        const loader = document.getElementById('global-loader');
        const textEl = document.getElementById('loader-text');
        textEl.textContent = text;
        loader.classList.remove('hidden');
        loader.classList.add('flex');
    },

    hideLoader: function() {
        const loader = document.getElementById('global-loader');
        loader.classList.add('hidden');
        loader.classList.remove('flex');
    },

    initParticles: function() {
        // Lógica para micro-interações pode ser adicionada aqui
    }
};
