/**
 * FileConvert - lib_image.js
 * Conversão de imagens em lote, redimensionamento, remoção de EXIF e gerador de Favicon
 * Padrão Oficial 4U.IA.BR
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
                    
                    <button type="button" onclick="imageConverter.openFaviconTool()" class="text-xs font-bold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5">
                        <span>🌟</span> Gerador de Favicon (.ZIP)
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
                    <div class="flex flex-wrap justify-between items-center text-xs text-slate-300 pb-2 border-b border-white/10 gap-2">
                        <div class="flex items-center gap-2">
                            <span class="font-bold text-white"><span id="image-count">0</span> imagem(ns) selecionada(s)</span>
                            <span id="image-total-size" class="text-[11px] text-slate-400 font-mono">0 KB</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <input type="file" id="image-input-more" accept="image/*" multiple class="hidden">
                            <button type="button" onclick="document.getElementById('image-input-more').click()" class="text-xs font-bold text-indigo-400 hover:text-indigo-300 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 transition flex items-center gap-1">
                                <span>+</span> Adicionar Fotos
                            </button>
                            <button type="button" onclick="imageConverter.clearFiles()" class="text-xs text-rose-400 hover:text-rose-300 font-bold px-2 py-1">
                                Limpar Seleção
                            </button>
                        </div>
                    </div>

                    <!-- Miniaturas / Preview Dinâmico -->
                    <div id="image-thumbnails-wrapper" class="space-y-2">
                        <!-- Injetado via JS -->
                    </div>

                    <!-- Configurações de Saída Padronizadas 4U -->
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                        <!-- Card 1: Formato -->
                        <div class="control-card">
                            <label class="control-label">Formato de Saída</label>
                            <select id="image-format" class="w-full text-xs font-semibold">
                                <option value="webp" selected>WebP (Mais leve e moderno)</option>
                                <option value="jpeg">JPG / JPEG (Universal)</option>
                                <option value="png">PNG (Sem perdas / Transparente)</option>
                                <option value="bmp">BMP (Bitmap padrão)</option>
                            </select>
                        </div>

                        <!-- Card 2: Qualidade -->
                        <div class="control-card">
                            <div class="flex justify-between items-center mb-2">
                                <label class="control-label mb-0">Qualidade de Compressão</label>
                                <span id="img-quality-val" class="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30">85%</span>
                            </div>
                            <div class="flex items-center h-[42px] px-3 bg-slate-900/60 rounded-xl border border-white/10">
                                <input type="range" id="image-quality" min="10" max="100" value="85" class="w-full cursor-pointer">
                            </div>
                        </div>

                        <!-- Card 3: Escala -->
                        <div class="control-card">
                            <label class="control-label">Escala / Dimensão</label>
                            <select id="image-scale" class="w-full text-xs font-semibold">
                                <option value="1.0" selected>Original (100%)</option>
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
                            <input type="checkbox" id="strip-exif" checked class="w-4 h-4 accent-indigo-500 rounded">
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

        // Input para adicionar mais imagens após a seleção inicial
        const addMoreInput = document.getElementById('image-input-more');
        if (addMoreInput) {
            addMoreInput.onchange = (e) => {
                if (e.target.files.length) {
                    this.handleFiles(Array.from(e.target.files));
                    e.target.value = '';
                }
            };
        }

        const qualitySlider = document.getElementById('image-quality');
        if (qualitySlider) {
            qualitySlider.oninput = (e) => {
                const valEl = document.getElementById('img-quality-val');
                if (valEl) valEl.textContent = e.target.value + '%';
            };
        }

        const scaleSelect = document.getElementById('image-scale');
        if (scaleSelect) {
            scaleSelect.onchange = (e) => {
                const box = document.getElementById('custom-dim-box');
                if (box) {
                    if (e.target.value === 'custom') {
                        box.classList.remove('hidden');
                    } else {
                        box.classList.add('hidden');
                    }
                }
            };
        }
    },

    handleFiles: function (newFiles) {
        if (!newFiles || !newFiles.length) return;
        const incoming = Array.from(newFiles);
        const existingKeys = new Set(this.files.map(f => f.name + '_' + f.size));
        const filtered = incoming.filter(f => !existingKeys.has(f.name + '_' + f.size));

        this.files = this.files.concat(filtered);
        this.convertedList = [];

        document.getElementById('image-drop-zone').classList.add('hidden');
        document.getElementById('image-files-area').classList.remove('hidden');
        document.getElementById('btn-download-all-img-zip').style.display = 'none';

        this.renderThumbnails();
        app.showToast(`${this.files.length} imagem(ns) carregada(s)!`);
    },

    renderThumbnails: function () {
        const wrapper = document.getElementById('image-thumbnails-wrapper');
        const countEl = document.getElementById('image-count');
        const totalSizeEl = document.getElementById('image-total-size');

        if (!wrapper) return;

        if (this.files.length === 0) {
            this.clearFiles();
            return;
        }

        countEl.textContent = this.files.length;
        const totalBytes = this.files.reduce((acc, f) => acc + f.size, 0);
        totalSizeEl.textContent = `• Total: ${utils.formatBytes(totalBytes)}`;

        wrapper.innerHTML = '';

        if (this.files.length === 1) {
            // Layout Hero para 1 imagem (Sem caixa preta vazia)
            const file = this.files[0];
            const div = document.createElement('div');
            div.className = 'flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/10';

            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.className = 'w-16 h-16 object-cover rounded-xl border border-white/10 shrink-0';
            div.appendChild(img);

            const infoDiv = document.createElement('div');
            infoDiv.className = 'truncate flex-1';
            infoDiv.innerHTML = `
                <h4 class="text-sm font-bold text-white truncate max-w-sm sm:max-w-md">${file.name}</h4>
                <p class="text-xs text-slate-400 font-mono mt-0.5">${utils.formatBytes(file.size)} • ${file.type || 'Imagem'}</p>
            `;
            div.appendChild(infoDiv);

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.onclick = () => imageConverter.removeFile(0);
            removeBtn.className = 'p-2 text-slate-400 hover:text-rose-400 transition';
            removeBtn.title = 'Remover imagem';
            removeBtn.innerHTML = '✕';
            div.appendChild(removeBtn);

            wrapper.appendChild(div);
        } else {
            // Grid responsivo e balanceado para múltiplas imagens
            const grid = document.createElement('div');
            grid.className = 'grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-56 overflow-y-auto p-2 bg-black/20 rounded-xl border border-white/5';

            this.files.forEach((file, index) => {
                const div = document.createElement('div');
                div.className = 'relative group aspect-square rounded-xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center';

                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                img.className = 'w-full h-full object-cover';
                div.appendChild(img);

                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.onclick = (e) => {
                    e.stopPropagation();
                    imageConverter.removeFile(index);
                };
                removeBtn.className = 'absolute top-1 right-1 bg-black/70 hover:bg-rose-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] transition';
                removeBtn.innerHTML = '✕';
                div.appendChild(removeBtn);

                const badge = document.createElement('span');
                badge.className = 'absolute bottom-1 inset-x-1 text-[9px] bg-black/70 px-1 py-0.5 rounded text-white/80 font-mono text-center truncate';
                badge.textContent = utils.formatBytes(file.size);
                div.appendChild(badge);

                grid.appendChild(div);
            });

            wrapper.appendChild(grid);
        }
    },

    removeFile: function (index) {
        this.files.splice(index, 1);
        if (this.files.length === 0) {
            this.clearFiles();
        } else {
            this.renderThumbnails();
        }
    },

    clearFiles: function () {
        this.files = [];
        this.convertedList = [];
        document.getElementById('image-files-area').classList.add('hidden');
        document.getElementById('image-drop-zone').classList.remove('hidden');
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
