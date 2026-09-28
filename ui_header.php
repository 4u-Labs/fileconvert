<header class="glass-nav sticky top-0 z-50">
    <div class="container mx-auto px-4 md:px-6 py-3 flex justify-between items-center gap-3">
        <!-- Logo -->
        <a href="index.php" class="flex items-center gap-3 group">
            <div class="w-10 h-10 bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                🔄
            </div>
            <div>
                <span class="text-xl md:text-2xl font-black tracking-tight bg-gradient-to-r from-white via-indigo-100 to-cyan-300 bg-clip-text text-transparent block leading-none">
                    FileConvert
                </span>
                <span class="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">4U.IA.BR</span>
            </div>
        </a>

        <!-- Status & Actions -->
        <div class="flex items-center gap-2 md:gap-3">
            <span class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>100% Local • Zero-Upload</span>
            </span>

            <!-- Install PWA Button -->
            <button id="btnInstallPwa" onclick="app.installPwa()" style="display:none;" class="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs shadow-lg shadow-emerald-500/30 transition transform hover:scale-105 active:scale-95 flex items-center gap-1.5">
                <span>📲</span>
                <span>Instalar App</span>
            </button>

            <!-- Link Loja 4U -->
            <a href="https://4u.ia.br" target="_blank" class="hidden md:inline-flex text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl transition border border-white/10 items-center gap-1">
                <span>←</span> Loja 4U
            </a>
        </div>
    </div>
</header>
