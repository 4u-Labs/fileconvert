/**
 * FileConvert - lib_audio.js
 * Conversão de áudio local com lamejs, recorte de áudio (trimmer) e gravador de voz
 */

window.audioConverter = {
    file: null,
    audioBuffer: null,
    mediaRecorder: null,
    audioChunks: [],
    isRecording: false,

    render: function () {
        return `
            <div class="glass-card p-6 md:p-8 animate-in fade-in duration-300 space-y-6">
                <!-- Header -->
                <div class="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 bg-indigo-500/20 text-indigo-300 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/10">
                            🎵
                        </div>
                        <div>
                            <h2 class="text-xl md:text-2xl font-black text-white">Conversor de Áudio & Recorte</h2>
                            <p class="text-slate-400 text-xs">Converta WAV, MP3, OGG, FLAC, M4A, corte trechos ou grave do microfone.</p>
                        </div>
                    </div>

                    <!-- Botão Gravador -->
                    <button type="button" id="btn-record-mic" onclick="audioConverter.toggleRecord()" class="text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5">
                        <span id="mic-icon">🎙️</span>
                        <span id="mic-label">Gravar Microfone</span>
                    </button>
                </div>

                <!-- Dropzone de Áudio -->
                <div id="audio-drop-zone" class="drop-zone p-8 md:p-12 mb-6">
                    <div class="text-4xl md:text-5xl mb-3">🎧</div>
                    <p class="text-base md:text-lg font-bold text-white">Arraste seu arquivo de áudio aqui</p>
                    <p class="text-slate-400 text-xs mt-1">MP3, WAV, OGG, FLAC, AAC, M4A ou WMA</p>
                    <input type="file" id="audio-input" accept="audio/*,.m4a,.aac,.flac,.ogg,.wav,.mp3" class="hidden">
                </div>

                <!-- Player e Painel de Recorte -->
                <div id="audio-preview-area" class="hidden space-y-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div class="flex justify-between items-center text-xs">
                        <div class="flex items-center gap-2">
                            <span class="text-lg">🎼</span>
                            <span id="audio-filename" class="font-bold text-white truncate max-w-[200px] sm:max-w-md">arquivo.mp3</span>
                        </div>
                        <span id="audio-filesize" class="text-slate-400 font-mono">0 MB</span>
                    </div>

                    <audio id="audio-player" controls class="w-full h-10 rounded-lg"></audio>

                    <!-- Ferramenta de Recorte (Trimmer) -->
                    <div class="p-3 bg-slate-900/60 rounded-xl border border-white/10 space-y-2">
                        <div class="flex justify-between items-center text-xs">
                            <span class="font-bold text-amber-300 flex items-center gap-1">✂️ Recortar Trecho (Opcional)</span>
                            <span id="audio-duration-label" class="text-slate-400 font-mono text-[11px]">Duração: 00:00</span>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-[11px] font-bold text-slate-400 mb-1">Início (segundos)</label>
                                <input type="number" id="audio-trim-start" min="0" step="0.5" value="0" class="w-full text-xs">
                            </div>
                            <div>
                                <label class="block text-[11px] font-bold text-slate-400 mb-1">Fim (segundos)</label>
                                <input type="number" id="audio-trim-end" min="0" step="0.5" value="0" class="w-full text-xs">
                            </div>
                        </div>
                    </div>

                    <!-- Configurações de Saída -->
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                        <div>
                            <label class="block text-xs font-bold text-slate-300 mb-1">Formato de Saída</label>
                            <select id="audio-output-format" class="w-full text-xs">
                                <option value="mp3" selected>MP3 (Universal e Leve)</option>
                                <option value="wav">WAV (Lossless Sem Perdas)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-300 mb-1">Taxa de Bits (Bitrate)</label>
                            <select id="audio-bitrate" class="w-full text-xs">
                                <option value="128">128 kbps (Econômico)</option>
                                <option value="192" selected>192 kbps (Padrão Alta Definição)</option>
                                <option value="320">320 kbps (Estúdio / Audiófilo)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-300 mb-1">Canais</label>
                            <select id="audio-channels" class="w-full text-xs">
                                <option value="2" selected>Estéreo (2 Canais)</option>
                                <option value="1">Mono (1 Canal)</option>
                            </select>
                        </div>
                    </div>

                    <!-- Barra de Progresso -->
                    <div id="audio-progress-container" class="hidden space-y-2 pt-2">
                        <div class="flex justify-between text-xs font-bold text-slate-300">
                            <span id="audio-progress-text">Processando áudio...</span>
                            <span id="audio-progress-percent">0%</span>
                        </div>
                        <div class="progress-bar-container">
                            <div id="audio-progress-bar" class="progress-bar-fill" style="width: 0%;"></div>
                        </div>
                    </div>

                    <!-- Botão de Ação -->
                    <div class="pt-2">
                        <button type="button" id="audio-convert-btn" onclick="audioConverter.startConversion()" class="btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2">
                            <span>⚡</span>
                            <span>Converter Áudio (100% Local)</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    init: function () {
        utils.setupDropZone('audio-drop-zone', 'audio-input', (file) => this.handleFile(file));
    },

    handleFile: function (file) {
        this.file = file;
        const player = document.getElementById('audio-player');
        const preview = document.getElementById('audio-preview-area');

        player.src = URL.createObjectURL(file);
        document.getElementById('audio-filename').textContent = file.name;
        document.getElementById('audio-filesize').textContent = utils.formatBytes(file.size);

        player.onloadedmetadata = () => {
            const dur = Math.round(player.duration);
            document.getElementById('audio-duration-label').textContent = `Duração: ${this.formatTime(dur)}`;
            document.getElementById('audio-trim-end').value = dur;
            document.getElementById('audio-trim-start').value = 0;
        };

        preview.classList.remove('hidden');
        app.showToast('Áudio pronto para converter! 🎧');
    },

    formatTime: function (secs) {
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    },

    toggleRecord: async function () {
        if (this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            document.getElementById('mic-label').textContent = 'Gravar Microfone';
            document.getElementById('mic-icon').textContent = '🎙️';
            document.getElementById('btn-record-mic').classList.remove('animate-pulse', 'bg-rose-600');
            app.showToast('Gravação finalizada! Processando...');
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];

            this.mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) this.audioChunks.push(e.data);
            };

            this.mediaRecorder.onstop = () => {
                const recordedBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                const recordedFile = new File([recordedBlob], `Gravacao_${Date.now()}.webm`, { type: 'audio/webm' });
                this.handleFile(recordedFile);
                stream.getTracks().forEach(track => track.stop());
            };

            this.mediaRecorder.start();
            this.isRecording = true;
            document.getElementById('mic-label').textContent = 'Parar Gravação';
            document.getElementById('mic-icon').textContent = '⏹️';
            document.getElementById('btn-record-mic').classList.add('animate-pulse', 'bg-rose-600');
            app.showToast('Gravando áudio do microfone...');
        } catch (err) {
            alert('Permissão de microfone negada ou indisponível: ' + err.message);
        }
    },

    startConversion: async function () {
        if (!this.file) return;

        const btn = document.getElementById('audio-convert-btn');
        const progressCont = document.getElementById('audio-progress-container');
        const progressBar = document.getElementById('audio-progress-bar');
        const progressText = document.getElementById('audio-progress-text');
        const progressPercent = document.getElementById('audio-progress-percent');

        btn.disabled = true;
        progressCont.classList.remove('hidden');
        app.showLoader('Decodificando áudio localmente...');

        try {
            const arrayBuffer = await this.file.arrayBuffer();
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContextClass();
            let fullBuffer = await audioContext.decodeAudioData(arrayBuffer);

            // Aplica Trim se configurado
            const tStart = parseFloat(document.getElementById('audio-trim-start').value || '0');
            const tEnd = parseFloat(document.getElementById('audio-trim-end').value || fullBuffer.duration);

            if (tStart > 0 || tEnd < fullBuffer.duration) {
                const sRate = fullBuffer.sampleRate;
                const startSample = Math.floor(Math.max(0, tStart) * sRate);
                const endSample = Math.floor(Math.min(fullBuffer.duration, tEnd) * sRate);
                const frameCount = Math.max(1, endSample - startSample);

                const trimmedBuffer = audioContext.createBuffer(fullBuffer.numberOfChannels, frameCount, sRate);
                for (let i = 0; i < fullBuffer.numberOfChannels; i++) {
                    const srcData = fullBuffer.getChannelData(i);
                    const destData = trimmedBuffer.getChannelData(i);
                    for (let j = 0; j < frameCount; j++) {
                        destData[j] = srcData[startSample + j];
                    }
                }
                this.audioBuffer = trimmedBuffer;
            } else {
                this.audioBuffer = fullBuffer;
            }

            app.hideLoader();
            const format = document.getElementById('audio-output-format').value;

            if (format === 'mp3') {
                await this.convertToMp3(progressBar, progressText, progressPercent);
            } else {
                await this.convertToWav(progressBar, progressText, progressPercent);
            }
        } catch (e) {
            console.error(e);
            app.hideLoader();
            alert('Erro na decodificação do áudio: ' + e.message);
        } finally {
            btn.disabled = false;
        }
    },

    convertToMp3: async function (bar, text, percentText) {
        const bitrate = parseInt(document.getElementById('audio-bitrate').value, 10);
        const channels = parseInt(document.getElementById('audio-channels').value, 10);
        const sampleRate = this.audioBuffer.sampleRate;

        const encoder = new lamejs.Mp3Encoder(channels, sampleRate, bitrate);
        const mp3Data = [];
        const blockSize = 1152;

        const left = this.audioBuffer.getChannelData(0);
        const right = channels === 2 && this.audioBuffer.numberOfChannels > 1 ? this.audioBuffer.getChannelData(1) : left;

        for (let i = 0; i < left.length; i += blockSize) {
            const lChunk = this.convertFloat32ToInt16(left.subarray(i, i + blockSize));
            const rChunk = channels === 2 ? this.convertFloat32ToInt16(right.subarray(i, i + blockSize)) : null;

            const buf = channels === 2 ? encoder.encodeBuffer(lChunk, rChunk) : encoder.encodeBuffer(lChunk);
            if (buf.length > 0) mp3Data.push(buf);

            if (i % (blockSize * 40) === 0) {
                const p = Math.round((i / left.length) * 100);
                bar.style.width = p + '%';
                if (percentText) percentText.textContent = p + '%';
                text.textContent = `Codificando MP3: ${p}%`;
                await new Promise(r => setTimeout(r, 0));
            }
        }

        const final = encoder.flush();
        if (final.length > 0) mp3Data.push(final);

        const blob = new Blob(mp3Data, { type: 'audio/mp3' });
        const baseName = this.file.name.substring(0, this.file.name.lastIndexOf('.')) || this.file.name;
        const newName = `${baseName}_4U.mp3`;

        utils.downloadBlob(blob, newName);

        utils.addToHistory({
            name: newName,
            fromType: this.file.name.split('.').pop() || 'audio',
            toType: 'mp3',
            originalSize: this.file.size,
            finalSize: blob.size,
            blob: blob,
            icon: '🎵'
        });

        bar.style.width = '100%';
        if (percentText) percentText.textContent = '100%';
        text.textContent = '✓ Concluído com sucesso!';
        app.showToast('MP3 gerado e baixado! 🎵');
    },

    convertToWav: async function (bar, text, percentText) {
        const numChannels = this.audioBuffer.numberOfChannels;
        const sampleRate = this.audioBuffer.sampleRate;
        const length = this.audioBuffer.length * numChannels * 2;
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
        for (let i = 0; i < numChannels; i++) channels.push(this.audioBuffer.getChannelData(i));

        let offset = 44;
        for (let i = 0; i < this.audioBuffer.length; i++) {
            for (let ch = 0; ch < numChannels; ch++) {
                const s = Math.max(-1, Math.min(1, channels[ch][i]));
                view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
                offset += 2;
            }
            if (i % 60000 === 0) {
                const p = Math.round((i / this.audioBuffer.length) * 100);
                bar.style.width = p + '%';
                if (percentText) percentText.textContent = p + '%';
                text.textContent = `Empacotando WAV: ${p}%`;
                await new Promise(r => setTimeout(r, 0));
            }
        }

        const blob = new Blob([buffer], { type: 'audio/wav' });
        const baseName = this.file.name.substring(0, this.file.name.lastIndexOf('.')) || this.file.name;
        const newName = `${baseName}_4U.wav`;

        utils.downloadBlob(blob, newName);

        utils.addToHistory({
            name: newName,
            fromType: this.file.name.split('.').pop() || 'audio',
            toType: 'wav',
            originalSize: this.file.size,
            finalSize: blob.size,
            blob: blob,
            icon: '🎵'
        });

        bar.style.width = '100%';
        if (percentText) percentText.textContent = '100%';
        text.textContent = '✓ Concluído com sucesso!';
        app.showToast('WAV lossless gerado e baixado! 🎵');
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
        if (tabName === 'audio' && window.audioConverter) {
            document.getElementById('tab-content').innerHTML = window.audioConverter.render();
            window.audioConverter.init();
        } else {
            original.call(this, tabName);
        }
    };
})(window.app.renderTabContent);
