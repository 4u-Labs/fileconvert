/**
 * FileConvert - lib_video.js
 * Extração REAL de áudio de vídeos (MP4, WebM, MOV) e captura de quadros (Thumbnails)
 */

window.videoConverter = {
    file: null,

    render: function () {
        return `
            <div class="glass-card p-6 md:p-8 animate-in fade-in duration-300 space-y-6">
                <!-- Header -->
                <div class="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div class="w-12 h-12 bg-rose-500/20 text-rose-300 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-rose-500/10">
                        🎬
                    </div>
                    <div>
                        <h2 class="text-xl md:text-2xl font-black text-white">Processamento de Vídeo</h2>
                        <p class="text-slate-400 text-xs">Extraia áudio de vídeos MP4/WebM/MOV e capture quadros (frames) em alta resolução.</p>
                    </div>
                </div>

                <!-- Dropzone de Vídeo -->
                <div id="video-drop-zone" class="drop-zone p-8 md:p-12 mb-6">
                    <div class="text-4xl md:text-5xl mb-3">🎥</div>
                    <p class="text-base md:text-lg font-bold text-white">Arraste seu arquivo de vídeo aqui</p>
                    <p class="text-slate-400 text-xs mt-1">MP4, WebM, MOV, MKV ou AVI (Processamento 100% no seu computador)</p>
                    <input type="file" id="video-input" accept="video/*,.mp4,.webm,.mov,.mkv,.avi" class="hidden">
                </div>

                <!-- Preview e Ações -->
                <div id="video-preview-area" class="hidden space-y-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div class="flex justify-between items-center text-xs">
                        <span id="video-filename" class="font-bold text-white truncate max-w-[200px] sm:max-w-md">video.mp4</span>
                        <span id="video-filesize" class="text-slate-400 font-mono">0 MB</span>
                    </div>

                    <!-- Player de Vídeo -->
                    <div class="relative bg-black/50 rounded-xl overflow-hidden max-h-[360px] flex items-center justify-center border border-white/10">
                        <video id="video-player" controls class="max-h-[340px] w-full object-contain"></video>
                    </div>

                    <!-- Controles de Ação de Vídeo -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <!-- Extração de Áudio -->
                        <div class="p-4 bg-slate-900/60 rounded-xl border border-white/10 space-y-3">
                            <div class="flex items-center gap-2">
                                <span class="text-lg">🎵</span>
                                <h4 class="text-sm font-bold text-white">Extrair Trilha de Áudio</h4>
                            </div>
                            <p class="text-xs text-slate-400">Extrai a música/fala do vídeo diretamente para MP3 ou WAV.</p>
                            
                            <div class="flex gap-2">
                                <select id="video-audio-format" class="w-1/2 text-xs">
                                    <option value="mp3" selected>MP3 (192 kbps)</option>
                                    <option value="wav">WAV Lossless</option>
                                </select>
                                <button type="button" onclick="videoConverter.extractAudioReal()" class="btn-primary flex-1 py-2 text-xs flex items-center justify-center gap-1.5">
                                    <span>⚡</span> Extrair Áudio
                                </button>
                            </div>
                        </div>

                        <!-- Captura de Quadro / Thumbnail -->
                        <div class="p-4 bg-slate-900/60 rounded-xl border border-white/10 space-y-3">
                            <div class="flex items-center gap-2">
                                <span class="text-lg">📸</span>
                                <h4 class="text-sm font-bold text-white">Capturar Quadro (Screenshot)</h4>
                            </div>
                            <p class="text-xs text-slate-400">Pausa o vídeo no segundo desejado e baixa a foto em alta resolução.</p>
                            
                            <button type="button" onclick="videoConverter.captureFrame()" class="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs shadow-lg transition flex items-center justify-center gap-1.5">
                                <span>📷</span> Baixar Frame Atual (PNG HD)
                            </button>
                        </div>
                    </div>

                    <!-- Progresso -->
                    <div id="video-progress-box" class="hidden space-y-2 pt-2">
                        <div class="flex justify-between text-xs font-bold text-slate-300">
                            <span id="video-progress-text">Processando trilha de áudio...</span>
                            <span id="video-progress-percent">0%</span>
                        </div>
                        <div class="progress-bar-container">
                            <div id="video-progress-bar" class="progress-bar-fill" style="width: 0%;"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    init: function () {
        utils.setupDropZone('video-drop-zone', 'video-input', (file) => this.handleFile(file));
    },

    handleFile: function (file) {
        this.file = file;
        const player = document.getElementById('video-player');
        const preview = document.getElementById('video-preview-area');

        player.src = URL.createObjectURL(file);
        document.getElementById('video-filename').textContent = file.name;
        document.getElementById('video-filesize').textContent = utils.formatBytes(file.size);

        preview.classList.remove('hidden');
        app.showToast('Vídeo carregado com sucesso! 🎬');
    },

    extractAudioReal: async function () {
        if (!this.file) return;

        const format = document.getElementById('video-audio-format').value;
        const progressBox = document.getElementById('video-progress-box');
        const progressBar = document.getElementById('video-progress-bar');
        const progressText = document.getElementById('video-progress-text');
        const progressPercent = document.getElementById('video-progress-percent');

        progressBox.classList.remove('hidden');
        progressBar.style.width = '15%';
        progressPercent.textContent = '15%';
        progressText.textContent = 'Decodificando container de vídeo...';
        app.showLoader('Extraindo trilha sonora do vídeo...');

        try {
            const arrayBuffer = await this.file.arrayBuffer();
            progressBar.style.width = '40%';
            progressPercent.textContent = '40%';
            progressText.textContent = 'Processando fluxo de áudio...';

            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            const audioCtx = new AudioContextClass();
            const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

            app.hideLoader();
            progressBar.style.width = '60%';
            progressPercent.textContent = '60%';
            progressText.textContent = `Codificando em ${format.toUpperCase()}...`;

            const baseName = this.file.name.substring(0, this.file.name.lastIndexOf('.')) || this.file.name;

            if (format === 'mp3') {
                const bitrate = 192;
                const channels = Math.min(2, audioBuffer.numberOfChannels);
                const sampleRate = audioBuffer.sampleRate;
                const encoder = new lamejs.Mp3Encoder(channels, sampleRate, bitrate);
                const mp3Data = [];
                const blockSize = 1152;

                const left = audioBuffer.getChannelData(0);
                const right = channels === 2 && audioBuffer.numberOfChannels > 1 ? audioBuffer.getChannelData(1) : left;

                for (let i = 0; i < left.length; i += blockSize) {
                    const lChunk = this.convertFloat32ToInt16(left.subarray(i, i + blockSize));
                    const rChunk = channels === 2 ? this.convertFloat32ToInt16(right.subarray(i, i + blockSize)) : null;

                    const buf = channels === 2 ? encoder.encodeBuffer(lChunk, rChunk) : encoder.encodeBuffer(lChunk);
                    if (buf.length > 0) mp3Data.push(buf);

                    if (i % (blockSize * 40) === 0) {
                        const p = Math.round(60 + ((i / left.length) * 38));
                        progressBar.style.width = p + '%';
                        progressPercent.textContent = p + '%';
                        await new Promise(r => setTimeout(r, 0));
                    }
                }

                const final = encoder.flush();
                if (final.length > 0) mp3Data.push(final);

                const blob = new Blob(mp3Data, { type: 'audio/mp3' });
                const newName = `${baseName}_audio.mp3`;
                utils.downloadBlob(blob, newName);

                utils.addToHistory({
                    name: newName,
                    fromType: 'video',
                    toType: 'mp3',
                    originalSize: this.file.size,
                    finalSize: blob.size,
                    blob: blob,
                    icon: '🎵'
                });
            } else {
                // WAV Lossless
                const numChannels = audioBuffer.numberOfChannels;
                const sampleRate = audioBuffer.sampleRate;
                const length = audioBuffer.length * numChannels * 2;
                const buffer = new ArrayBuffer(44 + length);
                const view = new DataView(buffer);

                const writeString = (offset, str) => {
                    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
                };

                writeString(0, 'RIFF');
                view.setUint32(4, 36 + length, true);
                writeString(8, 'WAVE');
                writeString(12, 'fmt ');
                view.setUint32(16, 16, true);
                view.setUint16(20, 1, true);
                view.setUint16(22, numChannels, true);
                view.setUint32(24, sampleRate, true);
                view.setUint32(28, sampleRate * numChannels * 2, true);
                view.setUint16(32, numChannels * 2, true);
                view.setUint16(34, 16, true);
                writeString(36, 'data');
                view.setUint32(40, length, true);

                const channels = [];
                for (let i = 0; i < numChannels; i++) channels.push(audioBuffer.getChannelData(i));

                let offset = 44;
                for (let i = 0; i < audioBuffer.length; i++) {
                    for (let ch = 0; ch < numChannels; ch++) {
                        const s = Math.max(-1, Math.min(1, channels[ch][i]));
                        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
                        offset += 2;
                    }
                }

                const blob = new Blob([buffer], { type: 'audio/wav' });
                const newName = `${baseName}_audio.wav`;
                utils.downloadBlob(blob, newName);

                utils.addToHistory({
                    name: newName,
                    fromType: 'video',
                    toType: 'wav',
                    originalSize: this.file.size,
                    finalSize: blob.size,
                    blob: blob,
                    icon: '🎵'
                });
            }

            progressBar.style.width = '100%';
            progressPercent.textContent = '100%';
            progressText.textContent = '✓ Áudio extraído e baixado com sucesso!';
            app.showToast('Trilha de áudio extraída do vídeo! 🎵');
        } catch (err) {
            console.error('Erro na extração de vídeo:', err);
            app.hideLoader();
            alert('Não foi possível extrair o áudio deste formato de vídeo: ' + err.message);
        }
    },

    captureFrame: function () {
        const player = document.getElementById('video-player');
        if (!player || player.readyState < 2) {
            alert('Aguarde o vídeo carregar antes de capturar o quadro.');
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = player.videoWidth || 1280;
        canvas.height = player.videoHeight || 720;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(player, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            if (blob) {
                const sec = Math.floor(player.currentTime);
                const baseName = this.file.name.substring(0, this.file.name.lastIndexOf('.')) || this.file.name;
                const newName = `${baseName}_frame_${sec}s.png`;
                utils.downloadBlob(blob, newName);

                utils.addToHistory({
                    name: newName,
                    fromType: 'video',
                    toType: 'png',
                    originalSize: 0,
                    finalSize: blob.size,
                    blob: blob,
                    icon: '📸'
                });
                app.showToast('Quadro capturado em alta definição! 📸');
            }
        }, 'image/png');
    },

    convertFloat32ToInt16: function (buffer) {
        const l = buffer.length;
        const buf = new Int16Array(l);
        for (let i = 0; i < l; i++) {
            const s = Math.max(-1, Math.min(1, buffer[i]));
            buf[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        return buf;
    }
};

window.app.renderTabContent = (function (original) {
    return function (tabName) {
        if (tabName === 'video' && window.videoConverter) {
            document.getElementById('tab-content').innerHTML = window.videoConverter.render();
            window.videoConverter.init();
        } else {
            original.call(this, tabName);
        }
    };
})(window.app.renderTabContent);
