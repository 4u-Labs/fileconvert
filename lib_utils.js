/**
 * FileConvert - lib_utils.js
 * Utilitários, gerenciamento de downloads e histórico de sessão
 */

window.utils = {
    historyItems: [],

    formatBytes: function (bytes, decimals = 1) {
        if (!bytes || bytes === 0) return '0 B';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },

    downloadBlob: function (blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
    },

    setupDropZone: function (id, inputId, callback, isMultiple = false) {
        const zone = document.getElementById(id);
        const input = document.getElementById(inputId);

        if (!zone || !input) return;

        zone.onclick = () => input.click();

        zone.ondragover = (e) => {
            e.preventDefault();
            zone.classList.add('dragover');
        };

        zone.ondragleave = () => {
            zone.classList.remove('dragover');
        };

        zone.ondrop = (e) => {
            e.preventDefault();
            zone.classList.remove('dragover');
            if (e.dataTransfer.files.length) {
                if (isMultiple) {
                    callback(Array.from(e.dataTransfer.files));
                } else {
                    callback(e.dataTransfer.files[0]);
                }
            }
        };

        input.onchange = (e) => {
            if (e.target.files.length) {
                if (isMultiple) {
                    callback(Array.from(e.target.files));
                } else {
                    callback(e.target.files[0]);
                }
            }
        };
    },

    // Adiciona arquivo ao histórico de sessão
    addToHistory: function (item) {
        // item: { name, fromType, toType, originalSize, finalSize, blob, url }
        item.id = 'hist_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        item.timestamp = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        this.historyItems.unshift(item);
        this.renderHistory();
    },

    renderHistory: function () {
        const container = document.getElementById('session-history-container');
        const list = document.getElementById('session-history-list');
        const countBadge = document.getElementById('history-count');

        if (!container || !list) return;

        if (this.historyItems.length === 0) {
            container.classList.add('hidden');
            return;
        }

        container.classList.remove('hidden');
        countBadge.textContent = this.historyItems.length;
        list.innerHTML = '';

        this.historyItems.forEach((item, index) => {
            const savings = item.originalSize && item.finalSize 
                ? Math.round(((item.originalSize - item.finalSize) / item.originalSize) * 100)
                : null;

            const div = document.createElement('div');
            div.className = 'flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-xs';
            div.innerHTML = `
                <div class="flex items-center gap-3 overflow-hidden">
                    <span class="text-lg">${item.icon || '📄'}</span>
                    <div class="truncate">
                        <p class="font-bold text-white truncate max-w-[200px] sm:max-w-xs">${item.name}</p>
                        <p class="text-white/40 text-[11px]">
                            ${item.fromType.toUpperCase()} ➔ ${item.toType.toUpperCase()} • 
                            ${this.formatBytes(item.finalSize || item.blob?.size || 0)}
                            ${savings !== null && savings > 0 ? `<span class="text-emerald-400 font-bold ml-1">(-${savings}%)</span>` : ''}
                        </p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="utils.downloadHistoryItem(${index})" class="px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 font-bold transition flex items-center gap-1">
                        <span>⬇️</span> <span class="hidden sm:inline">Baixar</span>
                    </button>
                </div>
            `;
            list.appendChild(div);
        });
    },

    downloadHistoryItem: function (index) {
        const item = this.historyItems[index];
        if (item && item.blob) {
            this.downloadBlob(item.blob, item.name);
        }
    },

    downloadAllHistoryZip: async function () {
        if (!this.historyItems.length) return;
        if (typeof JSZip === 'undefined') {
            alert('Biblioteca JSZip não carregada.');
            return;
        }

        app.showLoader('Empacotando todos os arquivos em ZIP...');
        try {
            const zip = new JSZip();
            this.historyItems.forEach(item => {
                if (item.blob) {
                    zip.file(item.name, item.blob);
                }
            });

            const content = await zip.generateAsync({ type: 'blob' });
            app.hideLoader();
            this.downloadBlob(content, `FileConvert_Lote_${Date.now()}.zip`);
            app.showToast('Pacote ZIP baixado com sucesso! 📦');
        } catch (e) {
            app.hideLoader();
            app.showToast('Erro ao criar ZIP: ' + e.message, '⚠️');
        }
    },

    clearHistory: function () {
        this.historyItems = [];
        this.renderHistory();
        app.showToast('Histórico da sessão limpo!');
    }
};
