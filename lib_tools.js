/**
 * FileConvert - lib_tools.js
 * Utilitários Rápidos: QR Code, Compactador/Descompactador ZIP, Base64, Hashes e Cores
 * 4U.IA.BR
 */

window.toolsConverter = {
    currentTool: 'qrcode',
    zipExtractFiles: [],

    render: function () {
        return `
            <div class="glass-card p-6 md:p-8 animate-in fade-in duration-300 space-y-6">
                <!-- Header -->
                <div class="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div class="w-12 h-12 bg-amber-500/20 text-amber-300 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-amber-500/10">
                        📦
                    </div>
                    <div>
                        <h2 class="text-xl md:text-2xl font-black text-white">Utilitários & Ferramentas Rápidas</h2>
                        <p class="text-slate-400 text-xs">QR Code, pacotes ZIP, conversor Base64, verificação de hash e cores.</p>
                    </div>
                </div>

                <!-- Sub-Navegação de Utilitários -->
                <div class="flex flex-wrap gap-2 p-1.5 bg-black/20 rounded-2xl border border-white/5">
                    <button type="button" onclick="toolsConverter.switchTool('qrcode')" id="subtool-btn-qrcode" class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-indigo-600 text-white shadow-lg">
                        <span>📱</span> Gerador QR Code
                    </button>
                    <button type="button" onclick="toolsConverter.switchTool('zip')" id="subtool-btn-zip" class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 text-slate-400 hover:text-white hover:bg-white/5">
                        <span>📦</span> Compactar / Extrair ZIP
                    </button>
                    <button type="button" onclick="toolsConverter.switchTool('base64')" id="subtool-btn-base64" class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 text-slate-400 hover:text-white hover:bg-white/5">
                        <span>🔐</span> Base64 ↔ Arquivo
                    </button>
                    <button type="button" onclick="toolsConverter.switchTool('hash')" id="subtool-btn-hash" class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 text-slate-400 hover:text-white hover:bg-white/5">
                        <span>🔒</span> Hashes & Checksum
                    </button>
                    <button type="button" onclick="toolsConverter.switchTool('color')" id="subtool-btn-color" class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 text-slate-400 hover:text-white hover:bg-white/5">
                        <span>🎨</span> Conversor de Cores
                    </button>
                </div>

                <!-- Painel 1: QR Code -->
                <div id="subtool-content-qrcode" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-300 mb-1">Conteúdo do QR Code:</label>
                                <textarea id="qr-input-text" placeholder="Digite uma URL, chave PIX, rede Wi-Fi ou texto qualquer..." class="w-full h-32 text-xs p-3 bg-black/30 rounded-xl border border-white/10 resize-none text-slate-200" oninput="toolsConverter.generateQrLive()"></textarea>
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-[11px] text-slate-400 mb-1">Tamanho (px):</label>
                                    <select id="qr-size-select" class="w-full text-xs" onchange="toolsConverter.generateQrLive()">
                                        <option value="180">Pequeno (180px)</option>
                                        <option value="256" selected>Médio (256px)</option>
                                        <option value="512">Grande HD (512px)</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-[11px] text-slate-400 mb-1">Nível de Correção:</label>
                                    <select id="qr-correction-select" class="w-full text-xs" onchange="toolsConverter.generateQrLive()">
                                        <option value="L">L (7% recuperação)</option>
                                        <option value="M" selected>M (15% recuperação)</option>
                                        <option value="Q">Q (25% recuperação)</option>
                                        <option value="H">H (30% recuperação)</option>
                                    </select>
                                </div>
                            </div>
                            <div class="flex gap-2 pt-2">
                                <button type="button" onclick="toolsConverter.downloadQrPng()" class="btn-primary flex-1 py-2 text-xs flex items-center justify-center gap-1.5">
                                    <span>📥</span> Baixar QR Code (PNG)
                                </button>
                                <button type="button" onclick="toolsConverter.copyQrImage()" class="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl text-xs font-bold transition">
                                    Copiar
                                </button>
                            </div>
                        </div>

                        <!-- Preview Visual do QR Code -->
                        <div class="flex flex-col items-center justify-center p-6 bg-slate-900/50 rounded-2xl border border-white/10 text-center">
                            <div class="p-4 bg-white rounded-2xl shadow-xl inline-block" id="qr-code-box">
                                <div id="qr-code-result" class="flex items-center justify-center min-w-[180px] min-h-[180px]"></div>
                            </div>
                            <p class="text-[11px] text-slate-400 mt-4">Escaneie com a câmera do celular para testar</p>
                        </div>
                    </div>
                </div>

                <!-- Painel 2: Compactador & Descompactador ZIP -->
                <div id="subtool-content-zip" class="space-y-6 hidden">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Criar ZIP -->
                        <div class="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                            <div class="flex items-center gap-2">
                                <span class="text-xl">🗜️</span>
                                <h3 class="text-sm font-bold text-white">Criar Pacote ZIP</h3>
                            </div>
                            <p class="text-xs text-slate-400">Junte vários arquivos em um único pacote comprimido .ZIP.</p>
                            
                            <div id="zip-pack-dropzone" class="drop-zone p-6 text-center cursor-pointer">
                                <div class="text-3xl mb-1">📦</div>
                                <p class="text-xs font-bold text-white">Arraste múltiplos arquivos aqui</p>
                                <input type="file" id="zip-pack-input" multiple class="hidden">
                            </div>

                            <div id="zip-pack-list-wrap" class="hidden space-y-2">
                                <div class="flex justify-between items-center text-xs">
                                    <span id="zip-pack-count" class="text-indigo-300 font-bold">0 arquivos</span>
                                    <span id="zip-pack-total-size" class="text-slate-400 font-mono">0 KB</span>
                                </div>
                                <div id="zip-pack-list" class="max-h-36 overflow-y-auto space-y-1 text-xs pr-1"></div>
                                <button type="button" onclick="toolsConverter.executeCreateZip()" class="btn-primary w-full py-2 text-xs flex items-center justify-center gap-1.5 mt-2">
                                    <span>⚡</span> Gerar e Baixar .ZIP
                                </button>
                            </div>
                        </div>

                        <!-- Extrair ZIP -->
                        <div class="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                            <div class="flex items-center gap-2">
                                <span class="text-xl">📂</span>
                                <h3 class="text-sm font-bold text-white">Descompactar / Inspecionar ZIP</h3>
                            </div>
                            <p class="text-xs text-slate-400">Abra qualquer arquivo .ZIP no navegador sem instalar descompactador.</p>

                            <div id="zip-extract-dropzone" class="drop-zone p-6 text-center cursor-pointer">
                                <div class="text-3xl mb-1">🗂️</div>
                                <p class="text-xs font-bold text-white">Arraste seu arquivo .ZIP aqui</p>
                                <input type="file" id="zip-extract-input" accept=".zip,application/zip" class="hidden">
                            </div>

                            <div id="zip-extract-list-wrap" class="hidden space-y-2">
                                <div class="flex justify-between items-center text-xs">
                                    <span id="zip-extract-count" class="text-emerald-300 font-bold">0 arquivos no pacote</span>
                                    <button type="button" onclick="toolsConverter.downloadAllExtracted()" class="text-indigo-400 hover:text-indigo-300 font-bold">Baixar Todos</button>
                                </div>
                                <div id="zip-extract-list" class="max-h-36 overflow-y-auto space-y-1 text-xs pr-1"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Painel 3: Base64 ↔ Arquivo / Texto -->
                <div id="subtool-content-base64" class="space-y-6 hidden">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Arquivo -> Base64 -->
                        <div class="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                            <h3 class="text-xs font-bold text-indigo-300 uppercase tracking-wider">Arquivo → Base64</h3>
                            <div id="b64-file-dropzone" class="drop-zone p-6 text-center cursor-pointer">
                                <div class="text-2xl mb-1">📁</div>
                                <p class="text-xs font-bold text-white">Selecione ou arraste qualquer arquivo</p>
                                <p class="text-[10px] text-slate-400">Imagens, áudios, PDFs, fontes, etc.</p>
                                <input type="file" id="b64-file-input" class="hidden">
                            </div>
                            <div class="flex items-center gap-2 text-xs">
                                <label class="flex items-center gap-1.5 cursor-pointer text-slate-300">
                                    <input type="checkbox" id="b64-include-data-uri" checked class="accent-indigo-500">
                                    <span>Incluir prefixo Data URI (data:...;base64,)</span>
                                </label>
                            </div>
                            <textarea id="b64-output-text" placeholder="O código Base64 aparecerá aqui..." class="w-full h-32 text-xs font-mono p-3 bg-black/30 rounded-xl border border-white/10 resize-none text-slate-200" readonly></textarea>
                            <div class="flex gap-2">
                                <button type="button" onclick="toolsConverter.copyB64Output()" class="btn-primary flex-1 py-2 text-xs">
                                    📋 Copiar Base64
                                </button>
                                <button type="button" onclick="toolsConverter.downloadB64Text()" class="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl text-xs font-bold transition">
                                    Baixar .txt
                                </button>
                            </div>
                        </div>

                        <!-- Base64 -> Arquivo -->
                        <div class="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                            <h3 class="text-xs font-bold text-emerald-300 uppercase tracking-wider">Base64 → Arquivo / Download</h3>
                            <textarea id="b64-input-text" placeholder="Cole aqui o Base64 ou Data URI..." class="w-full h-44 text-xs font-mono p-3 bg-black/30 rounded-xl border border-white/10 resize-none text-slate-200"></textarea>
                            <div class="grid grid-cols-2 gap-2">
                                <div>
                                    <label class="block text-[10px] text-slate-400 mb-1">Nome sugerido:</label>
                                    <input type="text" id="b64-save-name" placeholder="arquivo_decodificado" value="arquivo_decodificado" class="w-full text-xs">
                                </div>
                                <div>
                                    <label class="block text-[10px] text-slate-400 mb-1">Extensão forçada:</label>
                                    <select id="b64-save-ext" class="w-full text-xs">
                                        <option value="auto" selected>Detectar automaticamente</option>
                                        <option value="png">.png (Imagem)</option>
                                        <option value="jpg">.jpg (Imagem)</option>
                                        <option value="pdf">.pdf (Documento)</option>
                                        <option value="mp3">.mp3 (Áudio)</option>
                                        <option value="txt">.txt (Texto)</option>
                                    </select>
                                </div>
                            </div>
                            <button type="button" onclick="toolsConverter.decodeBase64ToFile()" class="btn-primary w-full py-2 text-xs flex items-center justify-center gap-1.5" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%)">
                                <span>📥</span> Decodificar e Baixar Arquivo
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Painel 4: Hashes & Verificador de Integridade -->
                <div id="subtool-content-hash" class="space-y-6 hidden">
                    <div class="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                        <div class="flex justify-between items-center">
                            <h3 class="text-xs font-bold text-indigo-300 uppercase tracking-wider">Gerar Hashes Criptográficos</h3>
                            <div class="flex gap-2">
                                <button type="button" onclick="toolsConverter.setHashMode('text')" id="hash-mode-btn-text" class="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white">Texto</button>
                                <button type="button" onclick="toolsConverter.setHashMode('file')" id="hash-mode-btn-file" class="px-3 py-1 rounded-lg text-xs font-bold text-slate-400 hover:text-white bg-white/5">Arquivo</button>
                            </div>
                        </div>

                        <!-- Entrada Texto -->
                        <div id="hash-input-text-wrap" class="space-y-2">
                            <textarea id="hash-source-text" placeholder="Digite ou cole qualquer texto para calcular seus hashes..." class="w-full h-24 text-xs font-mono p-3 bg-black/30 rounded-xl border border-white/10 resize-none text-slate-200" oninput="toolsConverter.calculateTextHashes()"></textarea>
                        </div>

                        <!-- Entrada Arquivo -->
                        <div id="hash-input-file-wrap" class="space-y-2 hidden">
                            <div id="hash-file-dropzone" class="drop-zone p-6 text-center cursor-pointer">
                                <div class="text-3xl mb-1">💿</div>
                                <p class="text-xs font-bold text-white">Arraste qualquer arquivo para gerar hashes</p>
                                <p class="text-[10px] text-slate-400 mt-1" id="hash-file-name-label">Calcula a assinatura digital exata do arquivo</p>
                                <input type="file" id="hash-file-input" class="hidden">
                            </div>
                        </div>

                        <!-- Resultados de Hashes -->
                        <div class="space-y-3 pt-2">
                            <div>
                                <div class="flex justify-between text-[11px] mb-1">
                                    <span class="font-bold text-indigo-300">SHA-256 (Padrão mais usado)</span>
                                    <button type="button" onclick="toolsConverter.copyHash('sha256')" class="text-indigo-400 hover:text-indigo-300">Copiar</button>
                                </div>
                                <input type="text" id="hash-res-sha256" readonly class="w-full text-xs font-mono bg-black/40 text-slate-300 p-2 rounded-lg border border-white/10">
                            </div>

                            <div>
                                <div class="flex justify-between text-[11px] mb-1">
                                    <span class="font-bold text-indigo-300">MD5 (Checksum legado)</span>
                                    <button type="button" onclick="toolsConverter.copyHash('md5')" class="text-indigo-400 hover:text-indigo-300">Copiar</button>
                                </div>
                                <input type="text" id="hash-res-md5" readonly class="w-full text-xs font-mono bg-black/40 text-slate-300 p-2 rounded-lg border border-white/10">
                            </div>

                            <div>
                                <div class="flex justify-between text-[11px] mb-1">
                                    <span class="font-bold text-indigo-300">SHA-512 (Alta segurança)</span>
                                    <button type="button" onclick="toolsConverter.copyHash('sha512')" class="text-indigo-400 hover:text-indigo-300">Copiar</button>
                                </div>
                                <input type="text" id="hash-res-sha512" readonly class="w-full text-xs font-mono bg-black/40 text-slate-300 p-2 rounded-lg border border-white/10">
                            </div>
                        </div>

                        <!-- Verificador de Checksum -->
                        <div class="pt-4 border-t border-white/10 space-y-2">
                            <label class="block text-xs font-bold text-slate-300">Comparar com Hash Esperado (Verificador de Integridade):</label>
                            <input type="text" id="hash-compare-input" placeholder="Cole aqui o hash que você recebeu do autor para verificar integridade..." class="w-full text-xs font-mono" oninput="toolsConverter.verifyChecksum()">
                            <div id="hash-compare-status" class="hidden text-xs p-2 rounded-lg font-bold"></div>
                        </div>
                    </div>
                </div>

                <!-- Painel 5: Conversor de Cores -->
                <div id="subtool-content-color" class="space-y-6 hidden">
                    <div class="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            <div class="space-y-3">
                                <div>
                                    <label class="block text-[11px] text-slate-400 mb-1">Selecione visualmente:</label>
                                    <input type="color" id="color-picker-input" value="#4f46e5" class="w-full h-10 rounded-xl cursor-pointer bg-transparent border-0" oninput="toolsConverter.handleColorPicker(this.value)">
                                </div>
                                <div>
                                    <label class="block text-[11px] text-slate-400 mb-1">Código HEX:</label>
                                    <input type="text" id="color-hex-input" value="#4F46E5" class="w-full text-xs font-mono" oninput="toolsConverter.handleHexInput(this.value)">
                                </div>
                                <div>
                                    <label class="block text-[11px] text-slate-400 mb-1">Código RGB:</label>
                                    <input type="text" id="color-rgb-input" value="rgb(79, 70, 229)" class="w-full text-xs font-mono" oninput="toolsConverter.handleRgbInput(this.value)">
                                </div>
                                <div>
                                    <label class="block text-[11px] text-slate-400 mb-1">Código HSL:</label>
                                    <input type="text" id="color-hsl-input" value="hsl(243, 75%, 59%)" class="w-full text-xs font-mono" readonly>
                                </div>
                            </div>

                            <!-- Preview da Cor -->
                            <div class="flex flex-col items-center justify-center p-6 bg-slate-900/50 rounded-2xl border border-white/10 space-y-4">
                                <div id="color-preview-box" class="w-36 h-36 rounded-2xl shadow-2xl border-2 border-white/20 transition-colors" style="background-color: #4f46e5;"></div>
                                <div class="text-center">
                                    <span id="color-contrast-label" class="text-xs font-bold text-white px-3 py-1 rounded-full bg-black/40 border border-white/10">Contraste: Excelente</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        `;
    },

    init: function () {
        this.initQr();
        this.initZip();
        this.initBase64();
        this.initHash();
    },

    switchTool: function (toolId) {
        this.currentTool = toolId;
        const all = ['qrcode', 'zip', 'base64', 'hash', 'color'];

        all.forEach(id => {
            const btn = document.getElementById(`subtool-btn-${id}`);
            const content = document.getElementById(`subtool-content-${id}`);
            if (btn && content) {
                if (id === toolId) {
                    btn.className = "px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-indigo-600 text-white shadow-lg";
                    content.classList.remove('hidden');
                } else {
                    btn.className = "px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 text-slate-400 hover:text-white hover:bg-white/5";
                    content.classList.add('hidden');
                }
            }
        });

        if (toolId === 'qrcode') {
            this.generateQrLive();
        }
    },

    // ==========================================
    // 📱 QR CODE
    // ==========================================
    initQr: function () {
        const input = document.getElementById('qr-input-text');
        if (input && !input.value) {
            input.value = 'https://4u.ia.br/app/fileconvert/';
        }
        this.generateQrLive();
    },

    generateQrLive: function () {
        const text = (document.getElementById('qr-input-text')?.value || '').trim();
        const size = parseInt(document.getElementById('qr-size-select')?.value || '256', 10);
        const correctLevel = document.getElementById('qr-correction-select')?.value || 'M';
        const result = document.getElementById('qr-code-result');

        if (!result) return;
        result.innerHTML = '';

        if (!text) {
            result.innerHTML = '<span class="text-xs text-slate-400">Digite um texto para ver o QR Code</span>';
            return;
        }

        if (window.QRCode) {
            const levelMap = {
                'L': window.QRCode.CorrectLevel.L,
                'M': window.QRCode.CorrectLevel.M,
                'Q': window.QRCode.CorrectLevel.Q,
                'H': window.QRCode.CorrectLevel.H
            };
            new QRCode(result, {
                text: text,
                width: size > 256 ? 256 : size,
                height: size > 256 ? 256 : size,
                correctLevel: levelMap[correctLevel] || window.QRCode.CorrectLevel.M
            });
        }
    },

    downloadQrPng: function () {
        const result = document.getElementById('qr-code-result');
        if (!result) return;

        let canvas = result.querySelector('canvas');
        let img = result.querySelector('img');

        if (!canvas && img) {
            canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || 256;
            canvas.height = img.naturalHeight || 256;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
        }

        if (!canvas) return app.showToast('Gere o QR Code primeiro!', '⚠️');

        canvas.toBlob(blob => {
            const name = 'qrcode_' + Date.now().toString().slice(-4) + '.png';
            utils.downloadBlob(blob, name);
            utils.addToHistory(name, blob.size, 'PNG', blob);
            app.showToast('QR Code baixado!', '📱');
        }, 'image/png');
    },

    copyQrImage: function () {
        const result = document.getElementById('qr-code-result');
        const canvas = result?.querySelector('canvas');
        if (!canvas) return app.showToast('Gere o QR Code primeiro!', '⚠️');

        canvas.toBlob(blob => {
            if (navigator.clipboard && navigator.clipboard.write) {
                const item = new ClipboardItem({ 'image/png': blob });
                navigator.clipboard.write([item]).then(() => {
                    app.showToast('Imagem do QR Code copiada!', '📋');
                }).catch(() => {
                    app.showToast('Não foi possível copiar imagem neste navegador.', '⚠️');
                });
            } else {
                app.showToast('Área de transferência indisponível.', '⚠️');
            }
        });
    },

    // ==========================================
    // 📦 ZIP PACK & UNPACK
    // ==========================================
    zipPackFiles: [],

    initZip: function () {
        // Criar ZIP
        const packDrop = document.getElementById('zip-pack-dropzone');
        const packInput = document.getElementById('zip-pack-input');
        if (packDrop && packInput) {
            packDrop.onclick = () => packInput.click();
            packDrop.ondragover = (e) => { e.preventDefault(); packDrop.classList.add('drag-over'); };
            packDrop.ondragleave = () => packDrop.classList.remove('drag-over');
            packDrop.ondrop = (e) => {
                e.preventDefault();
                packDrop.classList.remove('drag-over');
                if (e.dataTransfer.files.length) this.addZipPackFiles(Array.from(e.dataTransfer.files));
            };
            packInput.onchange = () => {
                if (packInput.files.length) {
                    this.addZipPackFiles(Array.from(packInput.files));
                    packInput.value = '';
                }
            };
        }

        // Extrair ZIP
        const extDrop = document.getElementById('zip-extract-dropzone');
        const extInput = document.getElementById('zip-extract-input');
        if (extDrop && extInput) {
            extDrop.onclick = () => extInput.click();
            extDrop.ondragover = (e) => { e.preventDefault(); extDrop.classList.add('drag-over'); };
            extDrop.ondragleave = () => extDrop.classList.remove('drag-over');
            extDrop.ondrop = (e) => {
                e.preventDefault();
                extDrop.classList.remove('drag-over');
                if (e.dataTransfer.files.length) this.loadZipToExtract(e.dataTransfer.files[0]);
            };
            extInput.onchange = () => {
                if (extInput.files.length) {
                    this.loadZipToExtract(extInput.files[0]);
                    extInput.value = '';
                }
            };
        }
    },

    addZipPackFiles: function (files) {
        files.forEach(f => this.zipPackFiles.push(f));
        this.renderZipPackList();
    },

    renderZipPackList: function () {
        const wrap = document.getElementById('zip-pack-list-wrap');
        const list = document.getElementById('zip-pack-list');
        const count = document.getElementById('zip-pack-count');
        const total = document.getElementById('zip-pack-total-size');

        if (!wrap || !list) return;

        if (this.zipPackFiles.length === 0) {
            wrap.classList.add('hidden');
            return;
        }

        wrap.classList.remove('hidden');
        count.textContent = `${this.zipPackFiles.length} arquivos selecionados`;
        const totalBytes = this.zipPackFiles.reduce((acc, f) => acc + f.size, 0);
        total.textContent = utils.formatBytes(totalBytes);

        list.innerHTML = this.zipPackFiles.map((f, i) => `
            <div class="flex items-center justify-between p-2 bg-black/20 rounded-lg border border-white/5">
                <span class="truncate max-w-[200px] text-white">${f.name}</span>
                <div class="flex items-center gap-2">
                    <span class="text-slate-400 font-mono text-[10px]">${utils.formatBytes(f.size)}</span>
                    <button type="button" onclick="toolsConverter.removeZipPackFile(${i})" class="text-slate-500 hover:text-rose-400">✕</button>
                </div>
            </div>
        `).join('');
    },

    removeZipPackFile: function (index) {
        this.zipPackFiles.splice(index, 1);
        this.renderZipPackList();
    },

    executeCreateZip: async function () {
        if (this.zipPackFiles.length === 0) return app.showToast('Nenhum arquivo adicionado!', '⚠️');

        try {
            app.showLoader('Comprimindo arquivos...');
            const zip = new JSZip();
            for (const file of this.zipPackFiles) {
                zip.file(file.name, file);
            }

            const content = await zip.generateAsync({ type: 'blob' });
            const zipName = 'pacote_' + Date.now().toString().slice(-4) + '.zip';
            utils.downloadBlob(content, zipName);
            utils.addToHistory(zipName, content.size, 'ZIP', content);

            app.hideLoader();
            app.showToast('Arquivo ZIP criado com sucesso!', '📦');
        } catch (e) {
            console.error(e);
            app.hideLoader();
            app.showToast('Erro ao criar ZIP: ' + e.message, '❌');
        }
    },

    loadZipToExtract: async function (file) {
        if (!file.name.toLowerCase().endsWith('.zip') && file.type !== 'application/zip') {
            return app.showToast('Selecione um arquivo .ZIP válido!', '⚠️');
        }

        try {
            app.showLoader('Lendo conteúdo do pacote ZIP...');
            const zip = new JSZip();
            const loadedZip = await zip.loadAsync(file);

            this.zipExtractFiles = [];
            const entries = [];

            loadedZip.forEach((relativePath, zipEntry) => {
                if (!zipEntry.dir) {
                    entries.push(zipEntry);
                }
            });

            for (const entry of entries) {
                this.zipExtractFiles.push({
                    name: entry.name,
                    entry: entry,
                    size: entry._data ? (entry._data.uncompressedSize || 0) : 0
                });
            }

            const wrap = document.getElementById('zip-extract-list-wrap');
            const list = document.getElementById('zip-extract-list');
            const count = document.getElementById('zip-extract-count');

            wrap.classList.remove('hidden');
            count.textContent = `${this.zipExtractFiles.length} arquivos encontrados`;

            list.innerHTML = this.zipExtractFiles.map((f, idx) => `
                <div class="flex items-center justify-between p-2 bg-black/20 rounded-lg border border-white/5">
                    <span class="truncate max-w-[200px] text-white">${f.name}</span>
                    <button type="button" onclick="toolsConverter.extractSingleFile(${idx})" class="text-xs text-indigo-400 hover:text-indigo-300 font-bold px-2 py-0.5 rounded bg-indigo-500/10">
                        Extrair
                    </button>
                </div>
            `).join('');

            app.hideLoader();
            app.showToast(`${this.zipExtractFiles.length} arquivos prontos para extração!`, '📂');
        } catch (e) {
            console.error(e);
            app.hideLoader();
            app.showToast('Erro ao ler arquivo ZIP: ' + e.message, '❌');
        }
    },

    extractSingleFile: async function (idx) {
        const item = this.zipExtractFiles[idx];
        if (!item) return;

        try {
            app.showLoader('Extraindo ' + item.name + '...');
            const blob = await item.entry.async('blob');
            const fileName = item.name.split('/').pop() || item.name;
            utils.downloadBlob(blob, fileName);
            utils.addToHistory(fileName, blob.size, 'EXTRACT', blob);
            app.hideLoader();
            app.showToast(`Arquivo "${fileName}" extraído!`, '📥');
        } catch (e) {
            console.error(e);
            app.hideLoader();
            app.showToast('Erro ao extrair arquivo!', '❌');
        }
    },

    downloadAllExtracted: async function () {
        if (this.zipExtractFiles.length === 0) return;
        for (let i = 0; i < this.zipExtractFiles.length; i++) {
            await this.extractSingleFile(i);
        }
    },

    // ==========================================
    // 🔐 BASE64 ↔ ARQUIVO / TEXTO
    // ==========================================
    initBase64: function () {
        const drop = document.getElementById('b64-file-dropzone');
        const input = document.getElementById('b64-file-input');
        if (drop && input) {
            drop.onclick = () => input.click();
            drop.ondragover = (e) => { e.preventDefault(); drop.classList.add('drag-over'); };
            drop.ondragleave = () => drop.classList.remove('drag-over');
            drop.ondrop = (e) => {
                e.preventDefault();
                drop.classList.remove('drag-over');
                if (e.dataTransfer.files.length) this.encodeFileToBase64(e.dataTransfer.files[0]);
            };
            input.onchange = () => {
                if (input.files.length) {
                    this.encodeFileToBase64(input.files[0]);
                    input.value = '';
                }
            };
        }
    },

    encodeFileToBase64: function (file) {
        if (!file) return;
        app.showLoader('Convertendo para Base64...');
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            const includeDataUri = document.getElementById('b64-include-data-uri').checked;
            const output = includeDataUri ? dataUrl : dataUrl.split(',')[1];
            document.getElementById('b64-output-text').value = output;
            app.hideLoader();
            app.showToast('Base64 gerado com sucesso!', '🔐');
        };
        reader.onerror = () => {
            app.hideLoader();
            app.showToast('Erro ao ler arquivo!', '❌');
        };
        reader.readAsDataURL(file);
    },

    copyB64Output: function () {
        const text = document.getElementById('b64-output-text').value;
        if (!text) return app.showToast('Nenhum Base64 para copiar!', '⚠️');
        navigator.clipboard.writeText(text).then(() => {
            app.showToast('Base64 copiado!', '📋');
        });
    },

    downloadB64Text: function () {
        const text = document.getElementById('b64-output-text').value;
        if (!text) return app.showToast('Nenhum Base64 para baixar!', '⚠️');
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        utils.downloadBlob(blob, 'codigo_base64.txt');
    },

    decodeBase64ToFile: function () {
        let raw = document.getElementById('b64-input-text').value.trim();
        if (!raw) return app.showToast('Cole o código Base64 primeiro!', '⚠️');

        let mimeType = 'application/octet-stream';
        let base64Data = raw;

        if (raw.startsWith('data:')) {
            const parts = raw.split(';base64,');
            mimeType = parts[0].replace('data:', '');
            base64Data = parts[1];
        }

        try {
            const byteChars = atob(base64Data.replace(/\s+/g, ''));
            const byteNumbers = new Array(byteChars.length);
            for (let i = 0; i < byteChars.length; i++) {
                byteNumbers[i] = byteChars.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: mimeType });

            let ext = document.getElementById('b64-save-ext').value;
            if (ext === 'auto') {
                if (mimeType.includes('png')) ext = 'png';
                else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpg';
                else if (mimeType.includes('pdf')) ext = 'pdf';
                else if (mimeType.includes('audio/mpeg') || mimeType.includes('mp3')) ext = 'mp3';
                else if (mimeType.includes('text/plain')) ext = 'txt';
                else ext = 'bin';
            }

            const baseName = document.getElementById('b64-save-name').value.trim() || 'arquivo_decodificado';
            const fileName = `${baseName}.${ext}`;

            utils.downloadBlob(blob, fileName);
            utils.addToHistory(fileName, blob.size, ext.toUpperCase(), blob);
            app.showToast(`Arquivo "${fileName}" decodificado e baixado!`, '📥');
        } catch (e) {
            console.error(e);
            app.showToast('Base64 inválido ou corrompido!', '❌');
        }
    },

    // ==========================================
    // 🔒 HASHES & CHECKSUM
    // ==========================================
    initHash: function () {
        const drop = document.getElementById('hash-file-dropzone');
        const input = document.getElementById('hash-file-input');
        if (drop && input) {
            drop.onclick = () => input.click();
            drop.ondragover = (e) => { e.preventDefault(); drop.classList.add('drag-over'); };
            drop.ondragleave = () => drop.classList.remove('drag-over');
            drop.ondrop = (e) => {
                e.preventDefault();
                drop.classList.remove('drag-over');
                if (e.dataTransfer.files.length) this.calculateFileHashes(e.dataTransfer.files[0]);
            };
            input.onchange = () => {
                if (input.files.length) {
                    this.calculateFileHashes(input.files[0]);
                    input.value = '';
                }
            };
        }
    },

    setHashMode: function (mode) {
        const textWrap = document.getElementById('hash-input-text-wrap');
        const fileWrap = document.getElementById('hash-input-file-wrap');
        const btnText = document.getElementById('hash-mode-btn-text');
        const btnFile = document.getElementById('hash-mode-btn-file');

        if (mode === 'text') {
            textWrap.classList.remove('hidden');
            fileWrap.classList.add('hidden');
            btnText.className = "px-3 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white";
            btnFile.className = "px-3 py-1 rounded-lg text-xs font-bold text-slate-400 hover:text-white bg-white/5";
            this.calculateTextHashes();
        } else {
            textWrap.classList.add('hidden');
            fileWrap.classList.remove('hidden');
            btnFile.className = "px-3 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white";
            btnText.className = "px-3 py-1 rounded-lg text-xs font-bold text-slate-400 hover:text-white bg-white/5";
        }
    },

    calculateTextHashes: async function () {
        const text = document.getElementById('hash-source-text')?.value || '';
        if (!text) {
            document.getElementById('hash-res-sha256').value = '';
            document.getElementById('hash-res-md5').value = '';
            document.getElementById('hash-res-sha512').value = '';
            this.verifyChecksum();
            return;
        }

        const encoder = new TextEncoder();
        const data = encoder.encode(text);

        // SHA-256
        const buf256 = await crypto.subtle.digest('SHA-256', data);
        document.getElementById('hash-res-sha256').value = this.bufferToHex(buf256);

        // SHA-512
        const buf512 = await crypto.subtle.digest('SHA-512', data);
        document.getElementById('hash-res-sha512').value = this.bufferToHex(buf512);

        // MD5
        document.getElementById('hash-res-md5').value = this.md5(text);

        this.verifyChecksum();
    },

    calculateFileHashes: async function (file) {
        if (!file) return;

        document.getElementById('hash-file-name-label').textContent = `${file.name} (${utils.formatBytes(file.size)})`;
        app.showLoader('Calculando hashes do arquivo...');

        try {
            const arrayBuffer = await file.arrayBuffer();

            // SHA-256
            const buf256 = await crypto.subtle.digest('SHA-256', arrayBuffer);
            document.getElementById('hash-res-sha256').value = this.bufferToHex(buf256);

            // SHA-512
            const buf512 = await crypto.subtle.digest('SHA-512', arrayBuffer);
            document.getElementById('hash-res-sha512').value = this.bufferToHex(buf512);

            // MD5
            const uint8 = new Uint8Array(arrayBuffer);
            document.getElementById('hash-res-md5').value = this.md5Binary(uint8);

            app.hideLoader();
            app.showToast('Hashes calculados com sucesso!', '🔒');
            this.verifyChecksum();
        } catch (e) {
            console.error(e);
            app.hideLoader();
            app.showToast('Erro ao processar arquivo!', '❌');
        }
    },

    bufferToHex: function (buffer) {
        return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    },

    copyHash: function (type) {
        const val = document.getElementById(`hash-res-${type}`)?.value;
        if (!val) return app.showToast('Nenhum hash gerado!', '⚠️');
        navigator.clipboard.writeText(val).then(() => {
            app.showToast(`${type.toUpperCase()} copiado!`, '📋');
        });
    },

    verifyChecksum: function () {
        const compare = (document.getElementById('hash-compare-input')?.value || '').trim().toLowerCase();
        const statusEl = document.getElementById('hash-compare-status');
        if (!statusEl) return;

        if (!compare) {
            statusEl.classList.add('hidden');
            return;
        }

        const sha256 = (document.getElementById('hash-res-sha256')?.value || '').toLowerCase();
        const md5 = (document.getElementById('hash-res-md5')?.value || '').toLowerCase();
        const sha512 = (document.getElementById('hash-res-sha512')?.value || '').toLowerCase();

        statusEl.classList.remove('hidden');
        if (compare === sha256 || compare === md5 || compare === sha512) {
            statusEl.className = "text-xs p-2 rounded-lg font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
            statusEl.innerHTML = '✓ <strong>Hash Idêntico!</strong> O arquivo é autêntico e não foi alterado.';
        } else {
            statusEl.className = "text-xs p-2 rounded-lg font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30";
            statusEl.innerHTML = '✗ <strong>Hashes Diferentes!</strong> O arquivo pode ter sido modificado ou corrompido.';
        }
    },

    // Algoritmo MD5 Puro JavaScript (Compatível com qualquer navegador)
    md5: function (string) {
        function md5cycle(x, k) {
            var a = x[0], b = x[1], c = x[2], d = x[3];
            a = ff(a, b, c, d, k[0], 7, -680876936);
            d = ff(d, a, b, c, k[1], 12, -389564586);
            c = ff(c, d, a, b, k[2], 17, 606105819);
            b = ff(b, c, d, a, k[3], 22, -1044525330);
            a = ff(a, b, c, d, k[4], 7, -176418897);
            d = ff(d, a, b, c, k[5], 12, 1200080426);
            c = ff(c, d, a, b, k[6], 17, -1473231341);
            b = ff(b, c, d, a, k[7], 22, -45705983);
            a = ff(a, b, c, d, k[8], 7, 1770035416);
            d = ff(d, a, b, c, k[9], 12, -1958414417);
            c = ff(c, d, a, b, k[10], 17, -42063);
            b = ff(b, c, d, a, k[11], 22, -1990404162);
            a = ff(a, b, c, d, k[12], 7, 1804603682);
            d = ff(d, a, b, c, k[13], 12, -40341101);
            c = ff(c, d, a, b, k[14], 17, -1502002290);
            b = ff(b, c, d, a, k[15], 22, 1236535329);

            a = gg(a, b, c, d, k[1], 5, -165796510);
            d = gg(d, a, b, c, k[6], 9, -1069501632);
            c = gg(c, d, a, b, k[11], 14, 643717713);
            b = gg(b, c, d, a, k[0], 20, -373897302);
            a = gg(a, b, c, d, k[5], 5, -701558691);
            d = gg(d, a, b, c, k[10], 9, 38016083);
            c = gg(c, d, a, b, k[15], 14, -660478335);
            b = gg(b, c, d, a, k[4], 20, -405537848);
            a = gg(a, b, c, d, k[9], 5, 568446438);
            d = gg(d, a, b, c, k[14], 9, -1019803690);
            c = gg(c, d, a, b, k[3], 14, -187363961);
            b = gg(b, c, d, a, k[8], 20, 1163531501);
            a = gg(a, b, c, d, k[13], 5, -1444681467);
            d = gg(d, a, b, c, k[2], 9, -51403784);
            c = gg(c, d, a, b, k[7], 14, 1735328473);
            b = gg(b, c, d, a, k[12], 20, -1926607734);

            a = hh(a, b, c, d, k[5], 4, -378558);
            d = hh(d, a, b, c, k[8], 11, -2022574463);
            c = hh(c, d, a, b, k[11], 16, 1839030562);
            b = hh(b, c, d, a, k[14], 23, -35309556);
            a = hh(a, b, c, d, k[1], 4, -1530992060);
            d = hh(d, a, b, c, k[4], 11, 1272893353);
            c = hh(c, d, a, b, k[7], 16, -155497632);
            b = hh(b, c, d, a, k[10], 23, -1094730640);
            a = hh(a, b, c, d, k[13], 4, 681279174);
            d = hh(d, a, b, c, k[0], 11, -358537222);
            c = hh(c, d, a, b, k[3], 16, -722521979);
            b = hh(b, c, d, a, k[6], 23, 76029189);
            a = hh(a, b, c, d, k[9], 4, -640364487);
            d = hh(d, a, b, c, k[12], 11, -421815835);
            c = hh(c, d, a, b, k[15], 16, 530742520);
            b = hh(b, c, d, a, k[2], 23, -995338651);

            a = ii(a, b, c, d, k[0], 6, -198630844);
            d = ii(d, a, b, c, k[7], 10, 1126891415);
            c = ii(c, d, a, b, k[14], 15, -1416354905);
            b = ii(b, c, d, a, k[5], 21, -57434055);
            a = ii(a, b, c, d, k[12], 6, 1700485571);
            d = ii(d, a, b, c, k[3], 10, -1894986606);
            c = ii(c, d, a, b, k[10], 15, -1051523);
            b = ii(b, c, d, a, k[1], 21, -2054922799);
            a = ii(a, b, c, d, k[8], 6, 1873313359);
            d = ii(d, a, b, c, k[15], 10, -30611744);
            c = ii(c, d, a, b, k[6], 15, -1560198380);
            b = ii(b, c, d, a, k[13], 21, 1309151649);
            a = ii(a, b, c, d, k[4], 6, -145523070);
            d = ii(d, a, b, c, k[11], 10, -1120210379);
            c = ii(c, d, a, b, k[2], 15, 718787259);
            b = ii(b, c, d, a, k[9], 21, -343485551);

            x[0] = add32(a, x[0]);
            x[1] = add32(b, x[1]);
            x[2] = add32(c, x[2]);
            x[3] = add32(d, x[3]);
        }

        function cmn(q, a, b, x, s, t) {
            a = add32(add32(a, q), add32(x, t));
            return add32((a << s) | (a >>> (32 - s)), b);
        }
        function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
        function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
        function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
        function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
        function add32(a, b) { return (a + b) & 0xFFFFFFFF; }

        function md51(s) {
            var txt = '';
            var n = s.length, state = [1732584193, -271733879, -1732584194, 271733878], i;
            for (i = 64; i <= s.length; i += 64) {
                md5cycle(state, md5blk(s.substring(i - 64, i)));
            }
            s = s.substring(i - 64);
            var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
            tail[i >> 2] |= 0x80 << ((i % 4) << 3);
            if (i > 55) {
                md5cycle(state, tail);
                for (i = 0; i < 16; i++) tail[i] = 0;
            }
            tail[14] = n * 8;
            md5cycle(state, tail);
            return state;
        }

        function md5blk(s) {
            var md5blks = [], i;
            for (i = 0; i < 64; i += 4) {
                md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
            }
            return md5blks;
        }

        function rhex(n) {
            var s = '', j = 0;
            for (; j < 4; j++) s += ((n >> (j * 8 + 4)) & 0x0F).toString(16) + ((n >> (j * 8)) & 0x0F).toString(16);
            return s;
        }

        var res = md51(string);
        return rhex(res[0]) + rhex(res[1]) + rhex(res[2]) + rhex(res[3]);
    },

    md5Binary: function (uint8) {
        let binary = '';
        const len = uint8.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(uint8[i]);
        }
        return this.md5(binary);
    },

    // ==========================================
    // 🎨 CONVERSOR DE CORES
    // ==========================================
    handleColorPicker: function (hex) {
        document.getElementById('color-hex-input').value = hex.toUpperCase();
        this.updateColorValues(hex);
    },

    handleHexInput: function (hex) {
        if (/^#[0-9A-F]{6}$/i.test(hex)) {
            document.getElementById('color-picker-input').value = hex;
            this.updateColorValues(hex);
        }
    },

    handleRgbInput: function (rgbStr) {
        const m = rgbStr.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
        if (m) {
            const r = parseInt(m[1], 10);
            const g = parseInt(m[2], 10);
            const b = parseInt(m[3], 10);
            if (r <= 255 && g <= 255 && b <= 255) {
                const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
                document.getElementById('color-picker-input').value = hex;
                document.getElementById('color-hex-input').value = hex.toUpperCase();
                this.updateColorValues(hex);
            }
        }
    },

    updateColorValues: function (hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        document.getElementById('color-rgb-input').value = `rgb(${r}, ${g}, ${b})`;
        document.getElementById('color-preview-box').style.backgroundColor = hex;

        // HSL
        const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
        const max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
                case gNorm: h = (bNorm - rNorm) / d + 2; break;
                case bNorm: h = (rNorm - gNorm) / d + 4; break;
            }
            h /= 6;
        }
        document.getElementById('color-hsl-input').value = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;

        // Contraste Luminância
        const lum = (0.299 * r + 0.587 * g + 0.114 * b);
        const label = document.getElementById('color-contrast-label');
        if (lum > 140) {
            label.textContent = "Contraste: Claro (use texto preto)";
            label.className = "text-xs font-bold text-slate-900 px-3 py-1 rounded-full bg-white/80 border border-black/10";
        } else {
            label.textContent = "Contraste: Escuro (use texto branco)";
            label.className = "text-xs font-bold text-white px-3 py-1 rounded-full bg-black/60 border border-white/10";
        }
    }
};
