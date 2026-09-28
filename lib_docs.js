/**
 * FileConvert - lib_docs.js
 * Suíte de Manipulação de PDFs, Planilhas e Documentos (100% Local)
 * 4U.IA.BR
 */

window.docsConverter = {
    currentSubTab: 'pdf-merge',
    mergeFiles: [],
    splitFile: null,
    imagesToPdfFiles: [],

    render: function () {
        return `
            <div class="glass-card p-6 md:p-8 animate-in fade-in duration-300 space-y-6">
                <!-- Cabeçalho -->
                <div class="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div class="w-12 h-12 bg-indigo-500/20 text-indigo-300 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/10">
                        📄
                    </div>
                    <div>
                        <h2 class="text-xl md:text-2xl font-black text-white">Documentos & PDF</h2>
                        <p class="text-slate-400 text-xs">Junte, divida, crie PDFs a partir de imagens e converta dados com privacidade absoluta.</p>
                    </div>
                </div>

                <!-- Sub-Navegação de Ferramentas de Documentos -->
                <div class="flex flex-wrap gap-2 p-1.5 bg-black/20 rounded-2xl border border-white/5">
                    <button type="button" onclick="docsConverter.switchSubTab('pdf-merge')" id="subtab-btn-pdf-merge" class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-indigo-600 text-white shadow-lg">
                        <span>📑</span> Juntar PDFs
                    </button>
                    <button type="button" onclick="docsConverter.switchSubTab('pdf-split')" id="subtab-btn-pdf-split" class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 text-slate-400 hover:text-white hover:bg-white/5">
                        <span>✂️</span> Dividir PDF
                    </button>
                    <button type="button" onclick="docsConverter.switchSubTab('images-to-pdf')" id="subtab-btn-images-to-pdf" class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 text-slate-400 hover:text-white hover:bg-white/5">
                        <span>🖼️</span> Imagens → PDF
                    </button>
                    <button type="button" onclick="docsConverter.switchSubTab('csv-json')" id="subtab-btn-csv-json" class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 text-slate-400 hover:text-white hover:bg-white/5">
                        <span>📊</span> CSV ↔ JSON
                    </button>
                    <button type="button" onclick="docsConverter.switchSubTab('code-format')" id="subtab-btn-code-format" class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 text-slate-400 hover:text-white hover:bg-white/5">
                        <span>💻</span> Formatador
                    </button>
                    <button type="button" onclick="docsConverter.switchSubTab('md-text')" id="subtab-btn-md-text" class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 text-slate-400 hover:text-white hover:bg-white/5">
                        <span>📝</span> Markdown / Texto
                    </button>
                </div>

                <!-- Painel 1: Juntar PDFs (Merge) -->
                <div id="subtab-content-pdf-merge" class="space-y-4">
                    <div id="merge-drop-zone" class="drop-zone p-8 text-center cursor-pointer">
                        <div class="text-4xl mb-2">📑</div>
                        <p class="text-sm font-bold text-white">Arraste múltiplos arquivos PDF aqui</p>
                        <p class="text-xs text-slate-400 mt-1">Eles serão unidos na ordem selecionada num único documento</p>
                        <input type="file" id="merge-file-input" accept="application/pdf,.pdf" multiple class="hidden">
                    </div>

                    <div id="merge-files-list-container" class="hidden space-y-3">
                        <div class="flex items-center justify-between text-xs">
                            <span class="font-bold text-white flex items-center gap-1">
                                <span>Arquivos selecionados:</span>
                                <span id="merge-files-count" class="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold">0</span>
                            </span>
                            <button type="button" onclick="docsConverter.clearMergeFiles()" class="text-rose-400 hover:text-rose-300 font-medium">Limpar lista</button>
                        </div>
                        <div id="merge-files-list" class="space-y-2 max-h-60 overflow-y-auto pr-1"></div>
                        <div class="flex justify-end pt-2">
                            <button type="button" onclick="docsConverter.mergePdfs()" id="btn-merge-action" class="btn-primary py-2.5 px-6 text-sm flex items-center gap-2">
                                <span>⚡</span> Unir e Baixar PDF Único
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Painel 2: Dividir PDF (Split) -->
                <div id="subtab-content-pdf-split" class="space-y-4 hidden">
                    <div id="split-drop-zone" class="drop-zone p-8 text-center cursor-pointer">
                        <div class="text-4xl mb-2">✂️</div>
                        <p class="text-sm font-bold text-white">Arraste o arquivo PDF para dividir</p>
                        <p class="text-xs text-slate-400 mt-1">Extraia páginas específicas ou separe em múltiplos arquivos</p>
                        <input type="file" id="split-file-input" accept="application/pdf,.pdf" class="hidden">
                    </div>

                    <div id="split-controls-container" class="hidden space-y-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div class="flex flex-wrap justify-between items-center text-xs pb-3 border-b border-white/10">
                            <div>
                                <span class="font-bold text-white text-sm" id="split-doc-name">documento.pdf</span>
                                <span class="text-slate-400 block text-xs" id="split-doc-info">Total de páginas: 0</span>
                            </div>
                            <button type="button" onclick="docsConverter.clearSplitFile()" class="text-rose-400 hover:text-rose-300">Trocar arquivo</button>
                        </div>

                        <div class="space-y-3">
                            <label class="block text-xs font-semibold text-slate-300">Modo de Extração:</label>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <label class="flex items-center gap-2 p-3 rounded-xl bg-black/20 border border-white/5 cursor-pointer">
                                    <input type="radio" name="split-mode" value="range" checked onchange="docsConverter.toggleSplitMode()" class="accent-indigo-500">
                                    <div>
                                        <div class="text-xs font-bold text-white">Intervalo Personalizado</div>
                                        <div class="text-[10px] text-slate-400">Ex: 1-3, 5, 8-10</div>
                                    </div>
                                </label>
                                <label class="flex items-center gap-2 p-3 rounded-xl bg-black/20 border border-white/5 cursor-pointer">
                                    <input type="radio" name="split-mode" value="all" onchange="docsConverter.toggleSplitMode()" class="accent-indigo-500">
                                    <div>
                                        <div class="text-xs font-bold text-white">Todas as Páginas em Separado</div>
                                        <div class="text-[10px] text-slate-400">Gera um pacote .ZIP com 1 PDF por página</div>
                                    </div>
                                </label>
                            </div>

                            <div id="split-range-input-wrapper" class="space-y-1 pt-1">
                                <label class="block text-xs font-medium text-slate-300">Páginas a extrair (1-indexado):</label>
                                <input type="text" id="split-range-input" placeholder="Exemplo: 1-3, 5" value="1" class="w-full text-xs">
                                <p class="text-[10px] text-slate-400">Use hífens para intervalos e vírgulas para separar páginas específicas.</p>
                            </div>

                            <div class="pt-2 flex justify-end">
                                <button type="button" onclick="docsConverter.executeSplit()" class="btn-primary py-2.5 px-6 text-sm flex items-center gap-2">
                                    <span>✂️</span> Extrair Páginas
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Painel 3: Imagens para PDF -->
                <div id="subtab-content-images-to-pdf" class="space-y-4 hidden">
                    <div id="img2pdf-drop-zone" class="drop-zone p-8 text-center cursor-pointer">
                        <div class="text-4xl mb-2">🖼️</div>
                        <p class="text-sm font-bold text-white">Arraste fotos ou digitalizações (JPG, PNG, WebP)</p>
                        <p class="text-xs text-slate-400 mt-1">Transforme suas imagens num documento PDF consolidado e paginado</p>
                        <input type="file" id="img2pdf-file-input" accept="image/*" multiple class="hidden">
                    </div>

                    <div id="img2pdf-container" class="hidden space-y-4">
                        <div class="flex items-center justify-between text-xs">
                            <span class="font-bold text-white flex items-center gap-1">
                                <span>Imagens prontas:</span>
                                <span id="img2pdf-count" class="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold">0</span>
                            </span>
                            <button type="button" onclick="docsConverter.clearImagesToPdf()" class="text-rose-400 hover:text-rose-300 font-medium">Limpar</button>
                        </div>
                        <div id="img2pdf-grid" class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-60 overflow-y-auto p-2 bg-black/20 rounded-xl border border-white/5"></div>
                        
                        <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
                            <div class="flex items-center gap-2 text-xs">
                                <span class="text-slate-400">Formato da página:</span>
                                <select id="img2pdf-page-format" class="text-xs py-1.5 px-3">
                                    <option value="fit" selected>Ajustar ao tamanho da imagem</option>
                                    <option value="a4_portrait">Padrão A4 Retrato</option>
                                    <option value="a4_landscape">Padrão A4 Paisagem</option>
                                </select>
                            </div>
                            <button type="button" onclick="docsConverter.convertImagesToPdf()" class="btn-primary py-2.5 px-6 text-sm flex items-center gap-2">
                                <span>📑</span> Gerar Arquivo PDF
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Painel 4: CSV ↔ JSON -->
                <div id="subtab-content-csv-json" class="space-y-4 hidden">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Lado CSV -->
                        <div class="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                            <div class="flex justify-between items-center">
                                <h3 class="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                                    <span>📑</span> Tabela CSV
                                </h3>
                                <div class="flex gap-2">
                                    <label class="text-[11px] text-indigo-400 hover:text-indigo-300 cursor-pointer font-bold">
                                        Importar CSV
                                        <input type="file" id="csv-input-file" accept=".csv,text/csv" class="hidden" onchange="docsConverter.handleCsvFile(this)">
                                    </label>
                                </div>
                            </div>
                            <textarea id="csv-text-area" placeholder="nome,idade,cidade\nAna,28,São Paulo\nCarlos,35,Curitiba" class="w-full h-44 text-xs font-mono p-3 bg-black/30 rounded-xl border border-white/10 resize-none text-slate-200"></textarea>
                            <div class="flex gap-2">
                                <button type="button" onclick="docsConverter.csvToJson()" class="btn-primary flex-1 py-2 text-xs flex items-center justify-center gap-1.5">
                                    <span>➡️</span> Converter para JSON
                                </button>
                                <button type="button" onclick="docsConverter.downloadCsv()" class="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl text-xs font-bold transition">
                                    Baixar .CSV
                                </button>
                            </div>
                        </div>

                        <!-- Lado JSON -->
                        <div class="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                            <div class="flex justify-between items-center">
                                <h3 class="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                                    <span>🌲</span> Dados JSON
                                </h3>
                                <div class="flex gap-2">
                                    <label class="text-[11px] text-emerald-400 hover:text-emerald-300 cursor-pointer font-bold">
                                        Importar JSON
                                        <input type="file" id="json-input-file" accept=".json,application/json" class="hidden" onchange="docsConverter.handleJsonFile(this)">
                                    </label>
                                </div>
                            </div>
                            <textarea id="json-text-area" placeholder='[\n  {"nome": "Ana", "idade": 28, "cidade": "São Paulo"}\n]' class="w-full h-44 text-xs font-mono p-3 bg-black/30 rounded-xl border border-white/10 resize-none text-slate-200"></textarea>
                            <div class="flex gap-2">
                                <button type="button" onclick="docsConverter.jsonToCsv()" class="btn-primary flex-1 py-2 text-xs flex items-center justify-center gap-1.5" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%)">
                                    <span>⬅️</span> Converter para CSV
                                </button>
                                <button type="button" onclick="docsConverter.downloadJson()" class="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl text-xs font-bold transition">
                                    Baixar .JSON
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Painel 5: Formatador de Código -->
                <div id="subtab-content-code-format" class="space-y-4 hidden">
                    <div class="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                        <div class="flex flex-wrap justify-between items-center gap-2">
                            <div class="flex items-center gap-2">
                                <span class="text-xs text-slate-400">Linguagem:</span>
                                <select id="format-language-select" class="text-xs py-1 px-3">
                                    <option value="json">JSON</option>
                                    <option value="xml">XML / HTML</option>
                                    <option value="sql">SQL</option>
                                    <option value="css">CSS</option>
                                </select>
                            </div>
                            <div class="flex gap-2">
                                <button type="button" onclick="docsConverter.beautifyCode()" class="btn-primary py-1.5 px-4 text-xs">
                                    ✨ Formatar / Indentar
                                </button>
                                <button type="button" onclick="docsConverter.minifyCode()" class="bg-white/10 hover:bg-white/20 text-white py-1.5 px-4 rounded-xl text-xs font-bold transition">
                                    🗜️ Minificar
                                </button>
                                <button type="button" onclick="docsConverter.copyFormattedCode()" class="bg-white/10 hover:bg-white/20 text-white py-1.5 px-4 rounded-xl text-xs font-bold transition">
                                    📋 Copiar
                                </button>
                            </div>
                        </div>
                        <textarea id="code-format-input" placeholder="Cole seu código aqui..." class="w-full h-64 text-xs font-mono p-4 bg-black/40 rounded-xl border border-white/10 resize-none text-slate-200"></textarea>
                        <div id="format-error-msg" class="hidden text-xs text-rose-400 font-mono bg-rose-500/10 p-2 rounded-lg border border-rose-500/20"></div>
                    </div>
                </div>

                <!-- Painel 6: Markdown & Texto -->
                <div id="subtab-content-md-text" class="space-y-4 hidden">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                            <div class="flex justify-between items-center">
                                <h3 class="text-xs font-bold text-orange-400 uppercase tracking-wider">Markdown Editor</h3>
                                <button type="button" onclick="docsConverter.insertMdTemplate()" class="text-[11px] text-orange-300 hover:underline">Inserir Exemplo</button>
                            </div>
                            <textarea id="md-source-text" placeholder="# Título do Documento\n\nEscreva em **Markdown** e visualize ou exporte em HTML estilizado..." class="w-full h-64 text-xs font-mono p-3 bg-black/30 rounded-xl border border-white/10 resize-none text-slate-200" oninput="docsConverter.livePreviewMd()"></textarea>
                            <div class="flex gap-2">
                                <button type="button" onclick="docsConverter.downloadMdAsHtml()" class="btn-primary flex-1 py-2 text-xs flex items-center justify-center gap-1.5" style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%)">
                                    <span>🌐</span> Baixar como HTML Estilizado
                                </button>
                                <button type="button" onclick="docsConverter.downloadMdAsPdf()" class="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl text-xs font-bold transition">
                                    <span>📕</span> Gerar PDF
                                </button>
                            </div>
                        </div>

                        <!-- Live Preview -->
                        <div class="p-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-3">
                            <div>
                                <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Pré-visualização em Tempo Real</h3>
                                <div id="md-preview-pane" class="h-64 overflow-y-auto p-4 bg-slate-900/60 rounded-xl border border-white/10 text-xs text-slate-200 prose prose-invert max-w-none">
                                    <p class="text-slate-500 italic">Digite à esquerda para ver a pré-visualização...</p>
                                </div>
                            </div>
                            <div class="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-white/5">
                                <span>Zero envio para servidores externos</span>
                                <span class="text-emerald-400 font-bold">100% Local</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        `;
    },

    init: function () {
        this.setupMergeEvents();
        this.setupSplitEvents();
        this.setupImg2PdfEvents();
    },

    switchSubTab: function (tabId) {
        this.currentSubTab = tabId;
        const allTabs = ['pdf-merge', 'pdf-split', 'images-to-pdf', 'csv-json', 'code-format', 'md-text'];
        
        allTabs.forEach(id => {
            const btn = document.getElementById(`subtab-btn-${id}`);
            const content = document.getElementById(`subtab-content-${id}`);
            if (btn && content) {
                if (id === tabId) {
                    btn.className = "px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-indigo-600 text-white shadow-lg";
                    content.classList.remove('hidden');
                } else {
                    btn.className = "px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 text-slate-400 hover:text-white hover:bg-white/5";
                    content.classList.add('hidden');
                }
            }
        });
    },

    // ==========================================
    // 📑 JUNTAR PDFS (MERGE)
    // ==========================================
    setupMergeEvents: function () {
        const dropZone = document.getElementById('merge-drop-zone');
        const fileInput = document.getElementById('merge-file-input');

        if (!dropZone || !fileInput) return;

        dropZone.onclick = () => fileInput.click();
        dropZone.ondragover = (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); };
        dropZone.ondragleave = () => dropZone.classList.remove('drag-over');
        dropZone.ondrop = (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            if (e.dataTransfer.files.length) {
                this.addMergeFiles(Array.from(e.dataTransfer.files));
            }
        };

        fileInput.onchange = () => {
            if (fileInput.files.length) {
                this.addMergeFiles(Array.from(fileInput.files));
                fileInput.value = '';
            }
        };
    },

    addMergeFiles: async function (files) {
        const pdfFiles = files.filter(f => f.name.toLowerCase().endsWith('.pdf') || f.type === 'application/pdf');
        if (pdfFiles.length === 0) {
            return app.showToast('Selecione arquivos no formato PDF!', '⚠️');
        }

        app.showLoader('Lendo informações dos PDFs...');
        for (const file of pdfFiles) {
            let pageCount = '?';
            try {
                if (window.PDFLib) {
                    const bytes = await file.arrayBuffer();
                    const pdf = await window.PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
                    pageCount = pdf.getPageCount();
                }
            } catch (e) {
                console.warn('Não foi possível ler contagem de páginas do PDF:', file.name, e);
            }

            this.mergeFiles.push({
                id: 'pdf_' + Math.random().toString(36).substr(2, 9),
                file: file,
                name: file.name,
                size: utils.formatBytes(file.size),
                pageCount: pageCount
            });
        }
        app.hideLoader();
        this.renderMergeList();
    },

    renderMergeList: function () {
        const container = document.getElementById('merge-files-list-container');
        const listEl = document.getElementById('merge-files-list');
        const countEl = document.getElementById('merge-files-count');

        if (!container || !listEl) return;

        if (this.mergeFiles.length === 0) {
            container.classList.add('hidden');
            return;
        }

        container.classList.remove('hidden');
        countEl.textContent = this.mergeFiles.length;

        listEl.innerHTML = this.mergeFiles.map((item, index) => `
            <div class="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5 hover:border-white/10 transition text-xs">
                <div class="flex items-center gap-3 truncate">
                    <span class="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-[11px] shrink-0">${index + 1}</span>
                    <div class="truncate">
                        <p class="font-bold text-white truncate max-w-xs sm:max-w-md">${item.name}</p>
                        <p class="text-[10px] text-slate-400 font-mono">${item.size} • ${item.pageCount} ${item.pageCount === 1 ? 'página' : 'páginas'}</p>
                    </div>
                </div>
                <div class="flex items-center gap-1 shrink-0">
                    <button type="button" onclick="docsConverter.moveMergeFile(${index}, -1)" ${index === 0 ? 'disabled class="opacity-20 p-1"' : 'class="p-1 hover:text-indigo-400"'} title="Mover para cima">⬆️</button>
                    <button type="button" onclick="docsConverter.moveMergeFile(${index}, 1)" ${index === this.mergeFiles.length - 1 ? 'disabled class="opacity-20 p-1"' : 'class="p-1 hover:text-indigo-400"'} title="Mover para baixo">⬇️</button>
                    <button type="button" onclick="docsConverter.removeMergeFile(${index})" class="p-1 text-slate-400 hover:text-rose-400 ml-1" title="Remover">✕</button>
                </div>
            </div>
        `).join('');
    },

    moveMergeFile: function (index, delta) {
        const target = index + delta;
        if (target < 0 || target >= this.mergeFiles.length) return;
        const temp = this.mergeFiles[index];
        this.mergeFiles[index] = this.mergeFiles[target];
        this.mergeFiles[target] = temp;
        this.renderMergeList();
    },

    removeMergeFile: function (index) {
        this.mergeFiles.splice(index, 1);
        this.renderMergeList();
    },

    clearMergeFiles: function () {
        this.mergeFiles = [];
        this.renderMergeList();
    },

    mergePdfs: async function () {
        if (this.mergeFiles.length < 2) {
            return app.showToast('Adicione pelo menos 2 arquivos PDF para unir!', '⚠️');
        }

        if (!window.PDFLib) {
            return app.showToast('Biblioteca PDF-Lib não carregada. Verifique sua conexão.', '❌');
        }

        try {
            app.showLoader('Unindo páginas dos PDFs...');
            const { PDFDocument } = window.PDFLib;
            const mergedPdf = await PDFDocument.create();

            let totalPages = 0;
            for (const item of this.mergeFiles) {
                const arrayBuffer = await item.file.arrayBuffer();
                const srcPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
                const pageIndices = srcPdf.getPageIndices();
                const copiedPages = await mergedPdf.copyPages(srcPdf, pageIndices);
                copiedPages.forEach((page) => mergedPdf.addPage(page));
                totalPages += pageIndices.length;
            }

            const mergedBytes = await mergedPdf.save();
            const outputBlob = new Blob([mergedBytes], { type: 'application/pdf' });
            const outputName = 'documentos_unificados_' + Date.now().toString().slice(-4) + '.pdf';

            utils.downloadBlob(outputBlob, outputName);
            utils.addToHistory(outputName, outputBlob.size, 'PDF', outputBlob);

            app.hideLoader();
            app.showToast(`PDF unificado com sucesso! (${totalPages} páginas)`, '📑');
        } catch (e) {
            console.error('Erro ao unir PDFs:', e);
            app.hideLoader();
            app.showToast('Erro ao unir os arquivos PDF: ' + (e.message || ''), '❌');
        }
    },

    // ==========================================
    // ✂️ DIVIDIR PDF (SPLIT)
    // ==========================================
    setupSplitEvents: function () {
        const dropZone = document.getElementById('split-drop-zone');
        const fileInput = document.getElementById('split-file-input');

        if (!dropZone || !fileInput) return;

        dropZone.onclick = () => fileInput.click();
        dropZone.ondragover = (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); };
        dropZone.ondragleave = () => dropZone.classList.remove('drag-over');
        dropZone.ondrop = (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            if (e.dataTransfer.files.length) {
                this.loadSplitFile(e.dataTransfer.files[0]);
            }
        };

        fileInput.onchange = () => {
            if (fileInput.files.length) {
                this.loadSplitFile(fileInput.files[0]);
                fileInput.value = '';
            }
        };
    },

    loadSplitFile: async function (file) {
        if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
            return app.showToast('Por favor, selecione um arquivo PDF válido!', '⚠️');
        }

        if (!window.PDFLib) {
            return app.showToast('Biblioteca PDF-Lib não disponível!', '❌');
        }

        try {
            app.showLoader('Carregando informações do documento...');
            const bytes = await file.arrayBuffer();
            const pdfDoc = await window.PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
            const pageCount = pdfDoc.getPageCount();

            this.splitFile = {
                file: file,
                bytes: bytes,
                name: file.name,
                pageCount: pageCount
            };

            document.getElementById('split-drop-zone').classList.add('hidden');
            const container = document.getElementById('split-controls-container');
            container.classList.remove('hidden');

            document.getElementById('split-doc-name').textContent = file.name;
            document.getElementById('split-doc-info').textContent = `Total de páginas: ${pageCount} (${utils.formatBytes(file.size)})`;
            document.getElementById('split-range-input').placeholder = `Exemplo: 1-${Math.min(3, pageCount)}, ${pageCount}`;
            document.getElementById('split-range-input').value = pageCount > 1 ? `1-${pageCount}` : '1';

            app.hideLoader();
            app.showToast(`Documento carregado! ${pageCount} páginas detectadas.`, '📄');
        } catch (e) {
            console.error('Erro ao ler PDF:', e);
            app.hideLoader();
            app.showToast('Não foi possível ler o PDF (pode estar protegido por senha).', '❌');
        }
    },

    clearSplitFile: function () {
        this.splitFile = null;
        document.getElementById('split-drop-zone').classList.remove('hidden');
        document.getElementById('split-controls-container').classList.add('hidden');
    },

    toggleSplitMode: function () {
        const mode = document.querySelector('input[name="split-mode"]:checked').value;
        const rangeWrapper = document.getElementById('split-range-input-wrapper');
        if (mode === 'all') {
            rangeWrapper.classList.add('hidden');
        } else {
            rangeWrapper.classList.remove('hidden');
        }
    },

    executeSplit: async function () {
        if (!this.splitFile) return app.showToast('Carregue um arquivo PDF primeiro!', '⚠️');

        const mode = document.querySelector('input[name="split-mode"]:checked').value;
        const { PDFDocument } = window.PDFLib;
        const total = this.splitFile.pageCount;

        try {
            app.showLoader('Processando divisão de páginas...');
            const srcDoc = await PDFDocument.load(this.splitFile.bytes);

            if (mode === 'all') {
                // Separar todas as páginas em um pacote ZIP
                const zip = new JSZip();
                for (let i = 0; i < total; i++) {
                    const newDoc = await PDFDocument.create();
                    const [page] = await newDoc.copyPages(srcDoc, [i]);
                    newDoc.addPage(page);
                    const bytes = await newDoc.save();
                    const pad = String(i + 1).padStart(String(total).length, '0');
                    const cleanName = this.splitFile.name.replace(/\.[^/.]+$/, '');
                    zip.file(`${cleanName}_pag_${pad}.pdf`, bytes);
                }

                const zipBlob = await zip.generateAsync({ type: 'blob' });
                const zipName = this.splitFile.name.replace(/\.[^/.]+$/, '') + '_paginas.zip';
                utils.downloadBlob(zipBlob, zipName);
                utils.addToHistory(zipName, zipBlob.size, 'ZIP', zipBlob);
                app.hideLoader();
                app.showToast(`Todas as ${total} páginas foram extraídas em ZIP!`, '📦');
            } else {
                // Intervalo específico
                const rangeStr = document.getElementById('split-range-input').value.trim();
                const pagesToExtract = this.parsePageRanges(rangeStr, total);

                if (pagesToExtract.length === 0) {
                    app.hideLoader();
                    return app.showToast('Nenhuma página válida especificada no intervalo!', '⚠️');
                }

                const newDoc = await PDFDocument.create();
                const indices = pagesToExtract.map(p => p - 1);
                const copiedPages = await newDoc.copyPages(srcDoc, indices);
                copiedPages.forEach(p => newDoc.addPage(p));

                const bytes = await newDoc.save();
                const blob = new Blob([bytes], { type: 'application/pdf' });
                const outName = this.splitFile.name.replace(/\.[^/.]+$/, '') + '_extraido.pdf';

                utils.downloadBlob(blob, outName);
                utils.addToHistory(outName, blob.size, 'PDF', blob);
                app.hideLoader();
                app.showToast(`${pagesToExtract.length} páginas extraídas com sucesso!`, '✂️');
            }
        } catch (e) {
            console.error('Erro na divisão do PDF:', e);
            app.hideLoader();
            app.showToast('Erro ao dividir PDF: ' + (e.message || ''), '❌');
        }
    },

    parsePageRanges: function (str, max) {
        const pages = new Set();
        const parts = str.split(',');
        for (let part of parts) {
            part = part.trim();
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(n => parseInt(n.trim(), 10));
                if (!isNaN(start) && !isNaN(end)) {
                    const minP = Math.max(1, Math.min(start, end));
                    const maxP = Math.min(max, Math.max(start, end));
                    for (let p = minP; p <= maxP; p++) pages.add(p);
                }
            } else {
                const p = parseInt(part, 10);
                if (!isNaN(p) && p >= 1 && p <= max) {
                    pages.add(p);
                }
            }
        }
        return Array.from(pages).sort((a, b) => a - b);
    },

    // ==========================================
    // 🖼️ IMAGENS PARA PDF
    // ==========================================
    setupImg2PdfEvents: function () {
        const dropZone = document.getElementById('img2pdf-drop-zone');
        const fileInput = document.getElementById('img2pdf-file-input');

        if (!dropZone || !fileInput) return;

        dropZone.onclick = () => fileInput.click();
        dropZone.ondragover = (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); };
        dropZone.ondragleave = () => dropZone.classList.remove('drag-over');
        dropZone.ondrop = (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            if (e.dataTransfer.files.length) {
                this.addImagesToPdf(Array.from(e.dataTransfer.files));
            }
        };

        fileInput.onchange = () => {
            if (fileInput.files.length) {
                this.addImagesToPdf(Array.from(fileInput.files));
                fileInput.value = '';
            }
        };
    },

    addImagesToPdf: function (files) {
        const valid = files.filter(f => f.type.startsWith('image/') || /\.(jpe?g|png|webp|gif|bmp)$/i.test(f.name));
        if (valid.length === 0) {
            return app.showToast('Selecione arquivos de imagem válidos!', '⚠️');
        }

        valid.forEach(f => {
            const previewUrl = URL.createObjectURL(f);
            this.imagesToPdfFiles.push({ file: f, url: previewUrl });
        });

        this.renderImagesToPdf();
    },

    renderImagesToPdf: function () {
        const container = document.getElementById('img2pdf-container');
        const grid = document.getElementById('img2pdf-grid');
        const countEl = document.getElementById('img2pdf-count');

        if (!container || !grid) return;

        if (this.imagesToPdfFiles.length === 0) {
            container.classList.add('hidden');
            return;
        }

        container.classList.remove('hidden');
        countEl.textContent = this.imagesToPdfFiles.length;

        grid.innerHTML = this.imagesToPdfFiles.map((item, idx) => `
            <div class="relative group rounded-lg overflow-hidden border border-white/10 aspect-square bg-black/40">
                <img src="${item.url}" class="w-full h-full object-cover">
                <button type="button" onclick="docsConverter.removeImgToPdf(${idx})" class="absolute top-1 right-1 bg-black/70 hover:bg-rose-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] transition">
                    ✕
                </button>
                <div class="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-center text-white py-0.5 truncate px-1">
                    ${idx + 1}. ${item.file.name}
                </div>
            </div>
        `).join('');
    },

    removeImgToPdf: function (idx) {
        if (this.imagesToPdfFiles[idx]?.url) {
            URL.revokeObjectURL(this.imagesToPdfFiles[idx].url);
        }
        this.imagesToPdfFiles.splice(idx, 1);
        this.renderImagesToPdf();
    },

    clearImagesToPdf: function () {
        this.imagesToPdfFiles.forEach(item => {
            if (item.url) URL.revokeObjectURL(item.url);
        });
        this.imagesToPdfFiles = [];
        this.renderImagesToPdf();
    },

    convertImagesToPdf: async function () {
        if (this.imagesToPdfFiles.length === 0) {
            return app.showToast('Nenhuma imagem adicionada!', '⚠️');
        }

        if (!window.PDFLib) {
            return app.showToast('Biblioteca PDF-Lib não disponível!', '❌');
        }

        try {
            app.showLoader('Construindo documento PDF...');
            const { PDFDocument } = window.PDFLib;
            const pdfDoc = await PDFDocument.create();
            const pageFormat = document.getElementById('img2pdf-page-format').value;

            for (const item of this.imagesToPdfFiles) {
                const imgBytes = await this.fileToPngBytes(item.file);
                const embeddedImg = await pdfDoc.embedPng(imgBytes);

                if (pageFormat === 'fit') {
                    // Tamanho exato da imagem
                    const page = pdfDoc.addPage([embeddedImg.width, embeddedImg.height]);
                    page.drawImage(embeddedImg, {
                        x: 0,
                        y: 0,
                        width: embeddedImg.width,
                        height: embeddedImg.height
                    });
                } else {
                    // Padrão A4 (Retrato: 595.28 x 841.89 | Paisagem: 841.89 x 595.28)
                    const isPortrait = pageFormat === 'a4_portrait';
                    const pageWidth = isPortrait ? 595.28 : 841.89;
                    const pageHeight = isPortrait ? 841.89 : 595.28;
                    const page = pdfDoc.addPage([pageWidth, pageHeight]);

                    const margin = 20;
                    const maxW = pageWidth - (margin * 2);
                    const maxH = pageHeight - (margin * 2);
                    const scale = Math.min(maxW / embeddedImg.width, maxH / embeddedImg.height, 1);
                    const drawW = embeddedImg.width * scale;
                    const drawH = embeddedImg.height * scale;
                    const posX = (pageWidth - drawW) / 2;
                    const posY = (pageHeight - drawH) / 2;

                    page.drawImage(embeddedImg, {
                        x: posX,
                        y: posY,
                        width: drawW,
                        height: drawH
                    });
                }
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const docName = 'album_imagens_' + Date.now().toString().slice(-4) + '.pdf';

            utils.downloadBlob(blob, docName);
            utils.addToHistory(docName, blob.size, 'PDF', blob);

            app.hideLoader();
            app.showToast('Documento PDF gerado com sucesso!', '📕');
        } catch (e) {
            console.error('Erro ao converter imagens em PDF:', e);
            app.hideLoader();
            app.showToast('Falha ao gerar PDF a partir das imagens: ' + (e.message || ''), '❌');
        }
    },

    fileToPngBytes: function (file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);
            img.onload = () => {
                URL.revokeObjectURL(url);
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth || img.width;
                canvas.height = img.naturalHeight || img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    blob.arrayBuffer().then(resolve).catch(reject);
                }, 'image/png');
            };
            img.onerror = (err) => {
                URL.revokeObjectURL(url);
                reject(err);
            };
            img.src = url;
        });
    },

    // ==========================================
    // 📊 CSV ↔ JSON
    // ==========================================
    handleCsvFile: function (input) {
        const file = input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('csv-text-area').value = e.target.result;
            app.showToast('CSV importado!', '📑');
        };
        reader.readAsText(file);
    },

    handleJsonFile: function (input) {
        const file = input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('json-text-area').value = e.target.result;
            app.showToast('JSON importado!', '🌲');
        };
        reader.readAsText(file);
    },

    csvToJson: function () {
        const raw = document.getElementById('csv-text-area').value.trim();
        if (!raw) return app.showToast('Cole ou importe o CSV primeiro!', '⚠️');

        try {
            // Detecta delimitador (, ou ; ou \t)
            const firstLine = raw.split(/\r?\n/)[0];
            const delimiter = (firstLine.match(/;/g) || []).length > (firstLine.match(/,/g) || []).length ? ';' : ',';

            const lines = raw.split(/\r?\n/).filter(l => l.trim().length > 0);
            if (lines.length < 2) return app.showToast('O CSV deve conter cabeçalho e pelo menos 1 linha de dados!', '⚠️');

            const headers = this.parseCsvLine(lines[0], delimiter);
            const data = [];

            for (let i = 1; i < lines.length; i++) {
                const values = this.parseCsvLine(lines[i], delimiter);
                const obj = {};
                headers.forEach((h, idx) => {
                    let val = values[idx] !== undefined ? values[idx].trim() : '';
                    if (!isNaN(val) && val !== '') {
                        val = Number(val);
                    } else if (val.toLowerCase() === 'true') {
                        val = true;
                    } else if (val.toLowerCase() === 'false') {
                        val = false;
                    }
                    obj[h] = val;
                });
                data.push(obj);
            }

            const jsonStr = JSON.stringify(data, null, 2);
            document.getElementById('json-text-area').value = jsonStr;
            app.showToast(`${data.length} registros convertidos para JSON!`, '✨');
        } catch (e) {
            console.error(e);
            app.showToast('Erro ao processar CSV: formato inválido.', '❌');
        }
    },

    parseCsvLine: function (line, delimiter) {
        const values = [];
        let current = '';
        let insideQuote = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"' || char === "'") {
                insideQuote = !insideQuote;
            } else if (char === delimiter && !insideQuote) {
                values.push(current.trim().replace(/^["']|["']$/g, ''));
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.trim().replace(/^["']|["']$/g, ''));
        return values;
    },

    jsonToCsv: function () {
        const raw = document.getElementById('json-text-area').value.trim();
        if (!raw) return app.showToast('Cole ou importe o JSON primeiro!', '⚠️');

        try {
            let data = JSON.parse(raw);
            if (!Array.isArray(data)) {
                if (typeof data === 'object') {
                    data = [data];
                } else {
                    return app.showToast('O JSON precisa ser um array de objetos!', '⚠️');
                }
            }

            if (data.length === 0) return app.showToast('O array JSON está vazio!', '⚠️');

            // Extrai cabeçalhos únicos
            const headers = Array.from(new Set(data.flatMap(item => Object.keys(item))));
            const csvRows = [];
            csvRows.push(headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(','));

            for (const row of data) {
                const values = headers.map(h => {
                    const val = row[h] !== undefined && row[h] !== null ? String(row[h]) : '';
                    return `"${val.replace(/"/g, '""')}"`;
                });
                csvRows.push(values.join(','));
            }

            const csvContent = csvRows.join('\n');
            document.getElementById('csv-text-area').value = csvContent;
            app.showToast(`${data.length} registros convertidos para CSV!`, '✨');
        } catch (e) {
            console.error(e);
            app.showToast('JSON inválido! Verifique a sintaxe.', '❌');
        }
    },

    downloadCsv: function () {
        const text = document.getElementById('csv-text-area').value.trim();
        if (!text) return app.showToast('Nada para baixar!', '⚠️');
        const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
        utils.downloadBlob(blob, 'dados_exportados.csv');
        utils.addToHistory('dados_exportados.csv', blob.size, 'CSV', blob);
        app.showToast('Download do CSV iniciado!', '📥');
    },

    downloadJson: function () {
        const text = document.getElementById('json-text-area').value.trim();
        if (!text) return app.showToast('Nada para baixar!', '⚠️');
        const blob = new Blob([text], { type: 'application/json;charset=utf-8;' });
        utils.downloadBlob(blob, 'dados_exportados.json');
        utils.addToHistory('dados_exportados.json', blob.size, 'JSON', blob);
        app.showToast('Download do JSON iniciado!', '📥');
    },

    // ==========================================
    // 💻 FORMATADOR & EMBELEZADOR DE CÓDIGO
    // ==========================================
    beautifyCode: function () {
        const lang = document.getElementById('format-language-select').value;
        const input = document.getElementById('code-format-input');
        const errEl = document.getElementById('format-error-msg');
        errEl.classList.add('hidden');

        const val = input.value.trim();
        if (!val) return app.showToast('Cole o código antes de formatar!', '⚠️');

        try {
            if (lang === 'json') {
                const parsed = JSON.parse(val);
                input.value = JSON.stringify(parsed, null, 2);
            } else if (lang === 'xml') {
                input.value = this.formatXml(val);
            } else if (lang === 'sql') {
                input.value = this.formatSql(val);
            } else if (lang === 'css') {
                input.value = this.formatCss(val);
            }
            app.showToast('Código formatado!', '✨');
        } catch (e) {
            errEl.textContent = `Erro de formatação (${lang.toUpperCase()}): ${e.message}`;
            errEl.classList.remove('hidden');
            app.showToast('Erro de sintaxe no código!', '❌');
        }
    },

    minifyCode: function () {
        const lang = document.getElementById('format-language-select').value;
        const input = document.getElementById('code-format-input');
        const errEl = document.getElementById('format-error-msg');
        errEl.classList.add('hidden');

        const val = input.value.trim();
        if (!val) return;

        try {
            if (lang === 'json') {
                input.value = JSON.stringify(JSON.parse(val));
            } else if (lang === 'xml' || lang === 'css' || lang === 'sql') {
                input.value = val.replace(/\s+/g, ' ').replace(/\s*([\{\};:,>])\s*/g, '$1').trim();
            }
            app.showToast('Código minificado!', '🗜️');
        } catch (e) {
            errEl.textContent = `Erro ao minificar: ${e.message}`;
            errEl.classList.remove('hidden');
        }
    },

    copyFormattedCode: function () {
        const input = document.getElementById('code-format-input');
        if (!input.value.trim()) return;
        navigator.clipboard.writeText(input.value).then(() => {
            app.showToast('Copiado para a área de transferência!', '📋');
        });
    },

    formatXml: function (xml) {
        let formatted = '';
        let indent = '';
        const tab = '  ';
        xml.split(/>\s*</).forEach(node => {
            if (node.match(/^\/\w/)) indent = indent.substring(tab.length);
            formatted += indent + '<' + node + '>\r\n';
            if (node.match(/^<?\w[^>]*[^\/]$/)) indent += tab;
        });
        return formatted.substring(1, formatted.length - 3);
    },

    formatSql: function (sql) {
        const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM'];
        let res = sql.replace(/\s+/g, ' ');
        keywords.forEach(kw => {
            const reg = new RegExp(`\\b${kw}\\b`, 'gi');
            res = res.replace(reg, `\n${kw}`);
        });
        return res.trim();
    },

    formatCss: function (css) {
        return css
            .replace(/\s*\{\s*/g, ' {\n  ')
            .replace(/\s*;\s*/g, ';\n  ')
            .replace(/\s*\}\s*/g, '\n}\n')
            .replace(/\n\s*\n/g, '\n')
            .trim();
    },

    // ==========================================
    // 📝 MARKDOWN & TEXTO
    // ==========================================
    insertMdTemplate: function () {
        const sample = `# Documento Exemplo FileConvert\n\nEste é um exemplo de conversão de **Markdown** para HTML e PDF.\n\n### Recursos Principais:\n- Processamento 100% no navegador (Client-Side)\n- Sem upload para nenhum servidor\n- Conversão instantânea\n\n> "Privacidade e velocidade sem abrir mão de recursos avançados."\n\n---\n*Criado com [4U.IA.BR](https://4u.ia.br)*`;
        document.getElementById('md-source-text').value = sample;
        this.livePreviewMd();
    },

    livePreviewMd: function () {
        const src = document.getElementById('md-source-text').value;
        const preview = document.getElementById('md-preview-pane');
        if (!src.trim()) {
            preview.innerHTML = '<p class="text-slate-500 italic">Digite à esquerda para ver a pré-visualização...</p>';
            return;
        }

        let html = src
            .replace(/^# (.*$)/gim, '<h1 class="text-lg font-bold text-white mb-2 pb-1 border-b border-white/10">$1</h1>')
            .replace(/^## (.*$)/gim, '<h2 class="text-base font-bold text-slate-200 mt-3 mb-1">$1</h2>')
            .replace(/^### (.*$)/gim, '<h3 class="text-sm font-bold text-slate-300 mt-2 mb-1">$1</h3>')
            .replace(/^\> (.*$)/gim, '<blockquote class="border-l-2 border-indigo-500 pl-3 italic text-indigo-300 my-2">$1</blockquote>')
            .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/gim, '<em>$1</em>')
            .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" class="text-indigo-400 underline">$1</a>')
            .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
            .replace(/\n\n/gim, '<br/><br/>');

        preview.innerHTML = html;
    },

    downloadMdAsHtml: function () {
        const src = document.getElementById('md-source-text').value;
        if (!src.trim()) return app.showToast('Escreva algo em Markdown primeiro!', '⚠️');

        const previewContent = document.getElementById('md-preview-pane').innerHTML;
        const htmlDoc = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documento Exportado — FileConvert</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 800px; margin: 40px auto; padding: 0 20px; }
        h1 { border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; color: #0f172a; }
        blockquote { border-left: 4px solid #6366f1; padding-left: 16px; color: #475569; font-style: italic; margin: 16px 0; }
        a { color: #4f46e5; text-decoration: none; }
        a:hover { text-decoration: underline; }
        hr { border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0; }
        footer { margin-top: 40px; font-size: 12px; color: #94a3b8; text-align: center; }
    </style>
</head>
<body>
    ${previewContent}
    <footer>Gerado 100% localmente com FileConvert • 4U.IA.BR</footer>
</body>
</html>`;

        const blob = new Blob([htmlDoc], { type: 'text/html;charset=utf-8' });
        utils.downloadBlob(blob, 'documento_markdown.html');
        utils.addToHistory('documento_markdown.html', blob.size, 'HTML', blob);
        app.showToast('HTML exportado com sucesso!', '🌐');
    },

    downloadMdAsPdf: function () {
        const text = document.getElementById('md-source-text').value;
        if (!text.trim()) return app.showToast('Escreva algo em Markdown primeiro!', '⚠️');

        try {
            if (window.jspdf) {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                const splitText = doc.splitTextToSize(text, 180);
                doc.setFontSize(11);
                doc.text(splitText, 15, 20);
                doc.save('documento_texto.pdf');
                app.showToast('PDF gerado!', '📕');
            } else {
                app.showToast('jsPDF indisponível.', '❌');
            }
        } catch (e) {
            console.error(e);
            app.showToast('Erro ao criar PDF', '❌');
        }
    }
};
