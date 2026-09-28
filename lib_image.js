/**
 * FileConvert - lib_image.js
 * Conversão de imagens em lote, redimensionamento, remoção de EXIF e gerador de Favicon
 */

window.imageConverter = {
    files: [], // Array de arquivos selecionados
    convertedList: [],

    render: function () {
        return `
            <div class="glass-card p-6 md:p-8 animate-in fade-in duration-300 space-y-6">
                <!-- Header -->
                <div class="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 bg-cyan-500/20 text-cyan-300 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/10">
                            🖼️
                        </div>
                        <div>
                            <h2 class="text-xl md:text-2xl font-black text-white">Conversor de Imagens & Fotos</h2>
                            <p class="text-slate-400 text-xs">Conversão em lote, WebP, compressão, limpeza de EXIF e favicons.</p>
                        </div>
                    </div>
                    
                    <button type="button" onclick="imageConverter.openFaviconTool()" class="text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5">
                        <span>⭐</span> Gerar Pacote Favicon
                    </button>
                </div>

                <!-- Dropzone Múltiplo -->
                <div id="image-drop-zone" class="drop-zone p-8 md:p-12 mb-6">
                    <div class="text-4xl md:text-5xl mb-3">📸</div>
                    <p class="text-base md:text-lg font-bold text-white">Arraste uma ou mais imagens aqui</p>
                    <p class="text-slate-400 text-xs mt-1">Suporta JPG, PNG, WebP, GIF, BMP, SVG e AVIF (Processamento em Lote)</p>
                    <input type="file" id="image-input" accept="image/*" multiple class="hidden">
                </div>

                <!-- Preview Area / Lista de Arquivos -->
                <div id="image-files-area" class="hidden space-y-4">
                    <div class="flex justify-between items-center text-xs text-slate-300 pb-2 border-b border-white/10">
                        <span class="font-bold"><span id="image-count">0</span> imagem(ns) selecionada(s)</span>
                        <button type="button" onclick="imageConverter.clearFiles()" class="text-rose-400 hover:text-rose-300 font-bold">Limpar Seleção</button>
                    </div>

                    <!-- Miniaturas em Grid -->
                    <div id="image-thumbnails-grid" class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-48 overflow-y-auto p-2 bg-white/5 rounded-xl border border-white/10">
                        <!-- Thumbs injetadas via JS -->
                    </div>

                    <!-- Configurações de Saída -->
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                        <div>
                            <label class="block text-xs font-bold text-slate-300 mb-1">Formato de Saída</label>
                            <select id="image-format" class="w-full text-xs">
                                <option value="webp" selected>WebP (Mais leve e moderno)</option>
                                <option value="jpeg">JPEG / JPG (Universal)</option>
                                <option value="png">PNG (Transparência sem perdas)</option>
                                <option value="bmp">BMP (Bitmap padrão)</option>
                            </select>
                        </div>

                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <label class="text-xs font-bold text-slate-300">Qualidade de Compressão</label>
                                <span id="img-quality-val" class="text-xs font-extrabold text-cyan-300">85%</span>
                            </div>
                            <input type="range" id="image-quality" min="10" max="100" value="85" class="w-full accent-cyan-500 cursor-pointer">
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-300 mb-1">Escala / Redimensionamento</label>
                            <select id="image-scale" class="w-full text-xs">
                                <option value="1.0" selected>Manter Tamanho Original (100%)</option>
                                <option value="0.75">Reduzir para 75%</option>
                                <option value="0.50">Reduzir para 50% (Metade)</option>
                                <option value="0.25">Reduzir para 25% (Miniatura)</option>
                                <option value="custom">Dimensões Personalizadas (px)...</option>
                            </select>
                        </div>
                    </div>

                    <!-- Dimensões personalizadas (opcional) -->
                    <div id="custom-dim-box" class="hidden grid grid-cols-2 gap-4 bg-white/5 p-3 rounded-xl border border-white/10">
                        <div>
                            <label class="block text-[11px] font-bold text-slate-400 mb-1">Largura Máx (px)</label>
                            <input type="number" id="custom-w" placeholder="Ex: 1920" class="w-full text-xs">
                        </div>
                        <div>
                            <label class="block text-[11px] font-bold text-slate-400 mb-1">Altura Máx (px)</label>
                            <input type="number" id="custom-h" placeholder="Ex: 1080" class="w-full text-xs">
                        </div>
                    </div>

                    <!-- Opções Extras -->
                    <div class="flex flex-wrap items-center gap-6 pt-1 text-xs">
                        <label class="inline-flex items-center gap-2 cursor-pointer text-slate-300 select-none">
                            <input type="checkbox" id="strip-exif" checked class="w-4 h-4 accent-cyan-500 rounded">
                            <span>🛡️ Limpar metadados EXIF e GPS (Privacidade Total)</span>
                        </label>
                    </div>

                    <!-- Barra de Progresso do Lote -->
                    <div id="image-progress-box" class="hidden space-y-2 pt-2">
                        <div class="flex justify-between text-xs font-bold text-slate-300">
                            <span id="img-progress-text">Processando imagens...</span>
                            <span id="img-progress-percent">0%</span>
                        </div>
                        <div class="progress-bar-container">
                            <div id="img-progress-bar" class="progress-bar-fill" style="width: 0%;"></div>
                        </div>
                    </div>

                    <!-- Botão de Ação -->
                    <div class="pt-4 flex flex-col sm:flex-row gap-3">
                        <button type="button" id="btn-convert-images" onclick="imageConverter.startBatchConversion()" class="btn-primary flex-1 py-3 text-sm flex items-center justify-center gap-2">
                            <span>⚡</span>
                            <span>Converter Agora (100% Local)</span>
                        </button>
                        <button type="button" id="btn-download-all-img-zip" style="display:none;" onclick="imageConverter.downloadBatchZip()" class="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold px-6 py-3 rounded-xl text-sm shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2">
                            <span>📦</span>
                            <span>Baixar Todas (.ZIP)</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    init: function () {
        utils.setupDropZone('image-drop-zone', 'image-input', (files) => this.handleFiles(files), true);

        const qualitySlider = document.getElementById('image-quality');
        const qualityVal = document.getElementById('quality-val');
        if (qualitySlider) {
            qualitySlider.oninput = (e) => {
                document.getElementById('img-quality-val').textContent = e.target.value + '%';
            };
        }

        const scaleSelect = document.getElementById('image-scale');
        if (scaleSelect) {
            scaleSelect.onchange = (e) => {
                const box = document.getElementById('custom-dim-box');
                if (e.target.value === 'custom') {
                    box.classList.remove('hidden');
                } else {
                    box.classList.add('hidden');
                }
            };
        }
    },

    handleFiles: function (files) {
        if (!files || !files.length) return;
        this.files = files;
        this.convertedList = [];

        document.getElementById('image-files-area').classList.remove('hidden');
        document.getElementById('image-count').textContent = files.length;
        document.getElementById('btn-download-all-img-zip').style.display = 'none';

        const grid = document.getElementById('image-thumbnails-grid');
        grid.innerHTML = '';

        files.forEach((file, index) => {
            const div = document.createElement('div');
            div.className = 'relative group aspect-square rounded-lg overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center';

            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.className = 'w-full h-full object-cover';
            div.appendChild(img);

            const badge = document.createElement('span');
            badge.className = 'absolute bottom-1 right-1 text-[9px] bg-slate-950/80 px-1 rounded text-white/70 font-mono';
            badge.textContent = utils.formatBytes(file.size);
            div.appendChild(badge);

            grid.appendChild(div);
        });

        app.showToast(`${files.length} imagem(ns) carregada(s)!`);
    },

    clearFiles: function () {
        this.files = [];
        this.convertedList = [];
        document.getElementById('image-files-area').classList.add('hidden');
        document.getElementById('image-input').value = '';
    },

    startBatchConversion: async function () {
        if (!this.files.length) return;

        const format = document.getElementById('image-format').value;
        const quality = parseInt(document.getElementById('image-quality').value, 10) / 100;
        const scaleVal = document.getElementById('image-scale').value;
        const customW = parseInt(document.getElementById('custom-w')?.value || '0', 10);
        const customH = parseInt(document.getElementById('custom-h')?.value || '0', 10);
        const stripExif = document.getElementById('strip-exif').checked;

        const progressBox = document.getElementById('image-progress-box');
        const progressBar = document.getElementById('img-progress-bar');
        const progressText = document.getElementById('img-progress-text');
        const progressPercent = document.getElementById('img-progress-percent');
        const convertBtn = document.getElementById('btn-convert-images');

        progressBox.classList.remove('hidden');
        convertBtn.disabled = true;

        this.convertedList = [];

        let mimeType = 'image/webp';
        let ext = 'webp';
        if (format === 'jpeg') { mimeType = 'image/jpeg'; ext = 'jpg'; }
        else if (format === 'png') { mimeType = 'image/png'; ext = 'png'; }
        else if (format === 'bmp') { mimeType = 'image/bmp'; ext = 'bmp'; }

        for (let i = 0; i < this.files.length; i++) {
            const file = this.files[i];
            const pct = Math.round(((i + 1) / this.files.length) * 100);
            progressBar.style.width = pct + '%';
            progressPercent.textContent = pct + '%';
            progressText.textContent = `Convertendo ${i + 1} de ${this.files.length}: ${file.name}`;

            try {
                const convertedBlob = await this.processSingleImage(file, mimeType, quality, scaleVal, customW, customH);
                const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                const newName = `${baseName}_4U.${ext}`;

                this.convertedList.push({
                    name: newName,
                    blob: convertedBlob,
                    originalSize: file.size,
                    finalSize: convertedBlob.size
                });

                // Registra no histórico geral da sessão
                utils.addToHistory({
                    name: newName,
                    fromType: file.type.split('/')[1] || 'img',
                    toType: ext,
                    originalSize: file.size,
                    finalSize: convertedBlob.size,
                    blob: convertedBlob,
                    icon: '🖼️'
                });
            } catch (err) {
                console.error('Erro na imagem:', file.name, err);
            }
        }

        convertBtn.disabled = false;
        progressText.textContent = `✓ ${this.convertedList.length} imagem(ns) convertida(s) com sucesso!`;

        // Se houver 1 arquivo, baixa direto
        if (this.convertedList.length === 1) {
            utils.downloadBlob(this.convertedList[0].blob, this.convertedList[0].name);
            app.showToast('Download iniciado! 🖼️');
        } else if (this.convertedList.length > 1) {
            // Se houver múltiplos, exibe o botão de baixar em ZIP
            document.getElementById('btn-download-all-img-zip').style.display = 'inline-flex';
            app.showToast('Lote concluído! Baixe o ZIP completo. 📦');
        }
    },

    processSingleImage: function (file, mimeType, quality, scaleVal, customW, customH) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                let w = img.width;
                let h = img.height;

                if (scaleVal === 'custom' && customW > 0) {
                    const ratio = customH > 0 ? customH / h : customW / w;
                    w = customW;
                    h = customH > 0 ? customH : Math.round(h * ratio);
                } else if (scaleVal !== '1.0' && scaleVal !== 'custom') {
                    const s = parseFloat(scaleVal);
                    w = Math.round(w * s);
                    h = Math.round(h * s);
                }

                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');

                // Fundo branco se for JPEG para não ter fundo preto
                if (mimeType === 'image/jpeg') {
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, w, h);
                }

                ctx.drawImage(img, 0, 0, w, h);

                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Falha ao gerar Blob do canvas'));
                }, mimeType, quality);
            };
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    },

    downloadBatchZip: async function () {
        if (!this.convertedList.length) return;
        if (typeof JSZip === 'undefined') {
            alert('Biblioteca JSZip necessária.');
            return;
        }

        app.showLoader('Criando arquivo ZIP...');
        try {
            const zip = new JSZip();
            this.convertedList.forEach(item => {
                zip.file(item.name, item.blob);
            });
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            app.hideLoader();
            utils.downloadBlob(zipBlob, `Imagens_Convertidas_${Date.now()}.zip`);
            app.showToast('ZIP baixado com sucesso! 📦');
        } catch (e) {
            app.hideLoader();
            app.showToast('Erro ao criar ZIP: ' + e.message, '⚠️');
        }
    },

    // Ferramenta Especial: Gerador de Pacote Favicon
    openFaviconTool: function () {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            app.showLoader('Gerando conjunto de Favicons HD...');
            try {
                const img = new Image();
                img.onload = async () => {
                    const zip = new JSZip();
                    const sizes = [16, 32, 48, 64, 192, 512];

                    for (const s of sizes) {
                        const canvas = document.createElement('canvas');
                        canvas.width = s;
                        canvas.height = s;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, s, s);
                        
                        const blob = await new Promise(r => canvas.toBlob(r, 'image/png'));
                        if (s === 32) zip.file('favicon.ico', blob);
                        zip.file(`favicon-${s}x${s}.png`, blob);
                    }

                    // Gera SVG encapsulado
                    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><image href="${img.src}" width="512" height="512"/></svg>`;
                    zip.file('favicon.svg', svgContent);

                    // Adiciona HTML de exemplo
                    const snippet = `<!-- Favicons gerados por 4U.IA.BR FileConvert -->\n<link rel="icon" type="image/svg+xml" href="favicon.svg">\n<link rel="alternate icon" type="image/png" href="favicon-32x32.png">\n<link rel="apple-touch-icon" href="favicon-192x192.png">`;
                    zip.file('README_COMO_USAR.html', snippet);

                    const zipBlob = await zip.generateAsync({ type: 'blob' });
                    app.hideLoader();
                    utils.downloadBlob(zipBlob, 'Pacote_Favicon_Completo_4U.zip');
                    app.showToast('Pacote de Favicons gerado com sucesso! ⭐');
                };
                img.src = URL.createObjectURL(file);
            } catch (err) {
                app.hideLoader();
                app.showToast('Erro ao criar favicons: ' + err.message, '⚠️');
            }
        };
        input.click();
    }
};

// Sobrescrever render do state para imagem
window.app.renderTabContent = (function (original) {
    return function (tabName) {
        if (tabName === 'image' && window.imageConverter) {
            document.getElementById('tab-content').innerHTML = window.imageConverter.render();
            window.imageConverter.init();
        } else {
            original.call(this, tabName);
        }
    };
})(window.app.renderTabContent);
