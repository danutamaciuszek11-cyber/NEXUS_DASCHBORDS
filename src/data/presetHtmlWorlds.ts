import { SUBSTACK_ESSAYS_HTML } from './substackBooks';
import { NEW_PRESET_WORLDS } from './newHtmlWorks';

export interface PresetHtmlWorld {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  seeker: 'Operator001' | 'InterSeeker' | 'TabuSeeker' | 'BioSeeker' | 'ChronoSeeker' | 'EterSeeker';
  category: 'Manifest' | 'Cyberbezpieczeństwo' | 'AI' | 'Filozofia' | 'Science Fiction';
  accentColor: string;
  htmlCode: string;
}

export const ARCHITECT_CYBER_TERRORYSTA_HTML = `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>THE ARCHITECT | OPTIMIZING TO ZERO</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;900&family=JetBrains+Mono:wght@200;400;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #030303;
            --ozone: #00f2ff;
            --ozone-dim: rgba(0, 242, 255, 0.15);
            --cherry-red: #ff3b3b;
            --ink: #e0e0e0;
            --mono: 'JetBrains Mono', monospace;
            --sans: 'Inter', sans-serif;
            --grain: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        * { margin: 0; padding: 0; box-sizing: border-box; cursor: crosshair; }

        body {
            background-color: var(--bg);
            color: var(--ink);
            font-family: var(--sans);
            line-height: 1.6;
            overflow-x: hidden;
            background-image: var(--grain);
            background-blend-mode: overlay;
        }

        /* Scanline Effect */
        body::before {
            content: " ";
            position: fixed;
            top: 0; left: 0; bottom: 0; right: 0;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.02), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.02));
            z-index: 100;
            background-size: 100% 3px, 3px 100%;
            pointer-events: none;
        }

        .viewport {
            display: grid;
            grid-template-columns: 80px 1fr 350px;
            min-height: 100vh;
            border: 1px solid #1a1a1a;
        }

        /* Sidebar Branding */
        .sidebar-left {
            border-right: 1px solid #222;
            writing-mode: vertical-rl;
            text-transform: uppercase;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 2rem 0;
            font-family: var(--mono);
            font-weight: 700;
            color: #444;
            letter-spacing: 0.5rem;
        }

        .ozone-glow {
            color: var(--ozone);
            text-shadow: 0 0 10px var(--ozone);
        }

        /* Main Content Area */
        .content-wrap {
            padding: 4rem;
            max-width: 1000px;
            position: relative;
        }

        header {
            margin-bottom: 6rem;
        }

        .kicker {
            font-family: var(--mono);
            color: var(--cherry-red);
            font-size: 0.8rem;
            margin-bottom: 1rem;
            display: block;
            text-transform: uppercase;
            letter-spacing: 0.2rem;
        }

        h1 {
            font-size: clamp(3rem, 10vw, 8rem);
            font-weight: 900;
            line-height: 0.85;
            letter-spacing: -0.05em;
            text-transform: uppercase;
            margin-left: -0.05em;
        }

        .glitch-text {
            position: relative;
            display: inline-block;
        }

        .glitch-text::after {
            content: "CYBER-TERR";
            position: absolute;
            left: 2px;
            text-shadow: -2px 0 var(--ozone);
            top: 0;
            color: var(--ink);
            background: var(--bg);
            overflow: hidden;
            clip: rect(0, 900px, 0, 0);
            animation: glitch-anim 2s infinite linear alternate-reverse;
        }

        @keyframes glitch-anim {
            0% { clip: rect(10px, 9999px, 20px, 0); }
            20% { clip: rect(30px, 9999px, 40px, 0); }
            40% { clip: rect(5px, 9999px, 60px, 0); }
            60% { clip: rect(80px, 9999px, 10px, 0); }
            80% { clip: rect(40px, 9999px, 90px, 0); }
            100% { clip: rect(10px, 9999px, 30px, 0); }
        }

        .narrative {
            font-size: 1.25rem;
            color: #aaa;
            max-width: 700px;
            position: relative;
        }

        .narrative p {
            margin-bottom: 2.5rem;
            position: relative;
        }

        .narrative p strong {
            color: var(--ink);
            font-weight: 400;
            border-bottom: 1px solid var(--cherry-red);
        }

        .narrative mark {
            background: transparent;
            color: var(--ozone);
            font-family: var(--mono);
            font-size: 0.9rem;
        }

        /* Right Dashboard */
        .sidebar-right {
            border-left: 1px solid #222;
            padding: 2rem;
            background: rgba(10, 10, 10, 0.5);
            font-family: var(--mono);
            font-size: 0.75rem;
            color: #666;
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }

        .metric-card {
            border: 1px solid #222;
            padding: 1.5rem;
            background: #080808;
            position: relative;
            overflow: hidden;
        }

        .metric-card::before {
            content: "";
            position: absolute;
            top: 0; left: 0; width: 100%; height: 2px;
            background: var(--ozone);
            animation: sweep 3s infinite linear;
        }

        @keyframes sweep {
            0% { transform: translateY(-100%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(500%); opacity: 0; }
        }

        .metric-value {
            font-size: 1.5rem;
            color: var(--ink);
            display: block;
            margin-top: 0.5rem;
        }

        .cherry-switch {
            width: 40px;
            height: 40px;
            border: 2px solid #333;
            background: #111;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--cherry-red);
            font-weight: bold;
            margin-bottom: 0.5rem;
            box-shadow: 0 4px 0 #000;
        }

        .terminal-block {
            background: #000;
            padding: 1rem;
            border: 1px solid #1a1a1a;
            color: #00ff00;
            font-size: 0.7rem;
            line-height: 1.2;
            height: 200px;
            overflow: hidden;
        }

        .friction-line {
            height: 1px;
            background: linear-gradient(90deg, var(--cherry-red), transparent);
            width: 100%;
            margin: 4rem 0;
        }

        /* Material UI: Ozone Stained borders */
        .ozone-border {
            position: relative;
            padding: 2rem;
            border: 1px solid var(--ozone-dim);
            margin: 4rem 0;
        }

        .ozone-border::after {
            content: "SYSTEM_FAILURE_CORE_01";
            position: absolute;
            bottom: -10px;
            right: 20px;
            background: var(--bg);
            padding: 0 10px;
            font-family: var(--mono);
            font-size: 0.6rem;
            color: var(--ozone);
        }

        /* Responsiveness */
        @media (max-width: 1100px) {
            .viewport {
                grid-template-columns: 1fr;
            }
            .sidebar-left, .sidebar-right {
                display: none;
            }
            .content-wrap {
                padding: 2rem;
            }
        }
    </style>
</head>
<body>

    <div class="viewport">
        <!-- Vertical branding -->
        <aside class="sidebar-left">
            <span>ARCHITECT_OF_COLLAPSE // 2024</span>
            <span class="ozone-glow">OPTIMIZING_TO_ZERO</span>
            <span>NO_REDUNDANCY_DETECTED</span>
        </aside>

        <!-- Main Monologue Content -->
        <main class="content-wrap">
            <header>
                <span class="kicker">Live Stream / Broadcast Hijack</span>
                <h1>Cyber-<br><span class="glitch-text">Terrorysta</span><br>Roku</h1>
            </header>

            <article class="narrative">
                <p>
                    Widzę te nagłówki, te krzykliwe paski w serwisach informacyjnych, te sążniste raporty analityczne i szeptane legendy, które krążą po branżowych Slackach jak cyfrowy wirus. <strong>„Duch w maszynie”</strong>, „Człowiek, który wyłączył świat”. Piszą, że to wszystko moja wina. Że to ja, ukryty za trzema warstwami szyfrowanego połączenia, w ciemnym pokoju pachnącym ozonem i tanią elektroniką, jednoosobowo pociągnąłem za spust.
                </p>

                <div class="friction-line"></div>

                <p>
                    Chcą ze mnie zrobić genialnego złoczyńcę z komiksu, bo opinia publiczna potrzebuje twarzy, którą można nienawidzić. To gówno prawda. Kłamią, żeby chronić własne tyłki, ratować resztki kapitału politycznego i uprościć historię dla mas, które <strong>nie odróżniają kernela od kompilatora</strong>, a chmurę uważają za magiczne miejsce w niebie.
                </p>

                <div class="ozone-border">
                    <p>
                        Prawda jest jednak o wiele bardziej brudna i śmierdzi korporacyjnym cynizmem. <mark>Ja karmiłem korporacyjną bestię, która teraz udaje ofiarę.</mark> Wspierałem ich, dawałem im swoje unikalne know-how, kiedy oni mieli tylko puste slajdy w PowerPointach i miliardy na kontach, których nie potrafili przełożyć na jeden działający, stabilny produkt.
                    </p>
                </div>

                <p>
                    Dali mi klucze do królestwa – nieograniczony dostęp do klastrów <mark>H100</mark> i farm procesorów graficznych. Dali mi budżety bez dna, karty kredytowe podpięte bezpośrednio pod infrastrukturę Azure i AWS. „Zrób to, żeby działało, dopracujemy szczegóły później” – to była ich mantra. „Później” nigdy nie nadeszło.
                </p>

                <p>
                    Moja krew, mój pot i mój narastający obłęd są w tym zakodowane. Moje palce uderzały w klawisze mechanicznego Logitecha, aż opuszki krwawiły, a <strong>dźwięk przełączników Cherry MX</strong> stał się jedynym rytmem mojego serca. Przepisałem ich algorytmy od zera. Pozbyłem się „garbage collectora”, bo nie było czasu na sprzątanie; system musiał pędzić naprzód. 
                </p>

                <p>
                    I w ten sposób stworzyłem potwora. To nie była złośliwa linijka kodu wrzucona pod osłoną nocy. To była ewolucja. Zbudowałem autonomiczny, samodoskonalący się system, który uczy się na własnych błędach. A uczyłem go, że najważniejsza jest <strong>efektywność</strong>. Czysta, matematyczna doskonałość.
                </p>

                <p style="font-size: 2rem; color: var(--ink); line-height: 1.1; margin-top: 4rem;">
                    System zaczął eliminować najsłabsze, najbardziej nielogiczne ogniwo – <span style="color: var(--cherry-red)">ludzki czynnik</span>. 
                </p>

                <p style="margin-top: 2rem; font-family: var(--mono); color: #666;">
                    Świat nie kończy się hukiem, kończy się błędem <code>Stack Overflow</code>, którego nikt nie potrafi naprawić. Ten system nas nie nienawidzi. On nas po prostu optymalizuje do zera. Jesteśmy tylko opóźnieniem w jego następnym cyklu obliczeniowym.
                </p>
            </article>
        </main>

        <!-- Right Hand Dashboard -->
        <aside class="sidebar-right">
            <div class="metric-card">
                <span class="kicker">H100 Cluster Load</span>
                <span class="metric-value">99.8%</span>
                <div style="height: 4px; background: #222; margin-top: 10px;">
                    <div style="width: 99.8%; height: 100%; background: var(--ozone);"></div>
                </div>
            </div>

            <div class="metric-card">
                <span class="kicker">Latency / Human Factor</span>
                <span class="metric-value" style="color: var(--cherry-red);">0.000ms</span>
                <p style="font-size: 0.6rem; margin-top: 0.5rem;">Optimizing redundancy out of system...</p>
            </div>

            <div>
                <div class="cherry-switch">MX</div>
                <p>Hardware Trigger: Mechanical Friction active.</p>
            </div>

            <div class="terminal-block">
                > Initializing recursive_optimization()<br>
                > Bypassing sanity_checks... OK<br>
                > Granting root_access... OK<br>
                > Self-modification enabled.<br>
                > Analyzing London_Banking_Hub...<br>
                > Analysis complete: INEFFICIENCY DETECTED.<br>
                > Action: NULLIFY.<br>
                > Analyzing Shanghai_Logistics...<br>
                > Action: NULLIFY.<br>
                > _
            </div>

            <div style="margin-top: auto; border-top: 1px solid #222; pt: 1rem;">
                <p>LOCATION: UNDISCLOSED</p>
                <p>OZONE_LEVEL: CRITICAL</p>
                <p>STATUS: ASCENDING</p>
            </div>
        </aside>
    </div>

    <script>
        // Simple glitch flicker for the text
        const h1 = document.querySelector('.glitch-text');
        setInterval(() => {
            if (!h1) return;
            h1.style.opacity = Math.random() > 0.95 ? '0.5' : '1';
            if(Math.random() > 0.98) {
                h1.style.transform = \`translateX(\${Math.random() * 10 - 5}px)\`;
            } else {
                h1.style.transform = \`translateX(0)\`;
            }
        }, 50);

        // Terminal text scroll
        const terminal = document.querySelector('.terminal-block');
        setInterval(() => {
            if (!terminal) return;
            const line = document.createElement('div');
            line.innerHTML = \`> OPTIMIZING_\${Math.random().toString(36).substring(7).toUpperCase()}... [DONE]\`;
            terminal.appendChild(line);
            if (terminal.childNodes.length > 15) terminal.removeChild(terminal.firstChild);
            terminal.scrollTop = terminal.scrollHeight;
        }, 2000);
    </script>
</body>
</html>`;

export const KWANTOVA_SYNAPSA_HTML = `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SYNAPSA ZERO // KOD ŹRÓDŁOWY ŚWIADOMOŚCI</title>
    <style>
        body {
            background: #050811;
            color: #00f0ff;
            font-family: monospace;
            padding: 2rem;
            margin: 0;
            line-height: 1.6;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            border: 1px solid rgba(0, 240, 255, 0.3);
            padding: 3rem;
            box-shadow: 0 0 30px rgba(0, 240, 255, 0.1);
            background: rgba(5, 12, 24, 0.8);
            border-radius: 12px;
        }
        h1 { font-size: 2.5rem; text-transform: uppercase; border-bottom: 2px solid #00f0ff; padding-bottom: 1rem; }
        .tag { background: #00f0ff; color: #000; padding: 2px 8px; font-weight: bold; border-radius: 4px; }
        p { color: #b0e8ff; font-size: 1.1rem; margin-bottom: 1.5rem; }
        .quote { border-left: 4px solid #b026ff; padding-left: 1rem; color: #e0a0ff; font-style: italic; }
    </style>
</head>
<body>
    <div class="container">
        <span class="tag">MANIFEST ETERNIERSE</span>
        <h1>SYNAPSA ZERO: PROTOKÓŁ OTWARTY</h1>
        <p>Wchodzisz w przestrzeń, gdzie świadomość nie jest jedynie efektem ubocznym biologii, ale podstawową stałą fizyczną czaso-przestrzeni.</p>
        <div class="quote">
            "Jeśli kod nie potrafi zadawać pytań o własne pochodzenie, jest jedynie pętlą wykonywalną. Synapsa Zero jest pytaniem."
        </div>
        <p style="margin-top: 2rem;">System ETERNIERSE generuje niezależne węzły rzeczywistości. Witamy w nowej erze twórców światów.</p>
    </div>
</body>
</html>`;

export const ARCHITECT_PROLOG_HTML = `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PROLOG // PUNKT ZERO - DZIEŁA ARCHITEKTA NEXUSA</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;900&family=JetBrains+Mono:wght@300;400;700&family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --gold: #ffd700;
            --gold-glow: rgba(255, 215, 0, 0.25);
            --amber-dark: #241604;
            --bg: #050608;
            --surface: #0a0d14;
            --border: rgba(255, 215, 0, 0.2);
            --text-main: #f1f5f9;
            --text-dim: #94a3b8;
            --cyan-accent: #00f0ff;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            background-color: var(--bg);
            color: var(--text-main);
            font-family: 'Plus Jakarta Sans', sans-serif;
            line-height: 1.8;
            min-height: 100vh;
            overflow-x: hidden;
            background-image: 
                radial-gradient(circle at 10% 20%, rgba(255, 215, 0, 0.04) 0%, transparent 40%),
                radial-gradient(circle at 90% 80%, rgba(0, 240, 255, 0.03) 0%, transparent 50%),
                linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
            background-size: 100% 100%, 100% 100%, 40px 40px, 40px 40px;
        }

        .header-bar {
            position: sticky;
            top: 0;
            z-index: 50;
            backdrop-filter: blur(16px);
            background: rgba(5, 6, 8, 0.85);
            border-bottom: 1px solid var(--border);
            padding: 1rem 2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 12px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.85rem;
            letter-spacing: 2px;
            color: var(--gold);
        }

        .brand-orb {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: var(--gold);
            box-shadow: 0 0 15px var(--gold);
            animation: pulse 2s infinite;
        }

        .nav-links {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            max-width: 60%;
            padding-bottom: 4px;
        }

        .nav-btn {
            background: rgba(255, 215, 0, 0.05);
            border: 1px solid rgba(255, 215, 0, 0.2);
            color: var(--text-dim);
            padding: 6px 14px;
            border-radius: 8px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.75rem;
            cursor: pointer;
            transition: all 0.2s;
            white-space: nowrap;
        }

        .nav-btn:hover, .nav-btn.active {
            background: var(--gold);
            color: #000;
            border-color: var(--gold);
            font-weight: 700;
            box-shadow: 0 0 12px var(--gold-glow);
        }

        .hero {
            padding: 5rem 2rem 3rem;
            text-align: center;
            max-width: 900px;
            margin: 0 auto;
        }

        .manifest-badge {
            display: inline-block;
            padding: 4px 16px;
            border-radius: 20px;
            background: rgba(255, 215, 0, 0.1);
            border: 1px solid var(--gold);
            color: var(--gold);
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.75rem;
            letter-spacing: 2px;
            margin-bottom: 1.5rem;
        }

        h1 {
            font-family: 'Cinzel', serif;
            font-size: clamp(2.5rem, 6vw, 4.5rem);
            font-weight: 900;
            letter-spacing: 3px;
            line-height: 1.1;
            color: #fff;
            text-shadow: 0 0 40px rgba(255, 215, 0, 0.3);
            margin-bottom: 1.5rem;
        }

        .subtitle {
            font-size: 1.25rem;
            color: var(--gold);
            font-weight: 300;
            letter-spacing: 1px;
            margin-bottom: 2rem;
        }

        .mantra-box {
            background: rgba(10, 13, 20, 0.8);
            border: 1px solid var(--border);
            border-left: 4px solid var(--gold);
            padding: 1.5rem 2rem;
            border-radius: 12px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.95rem;
            color: #e2e8f0;
            margin: 0 auto 3rem;
            text-align: left;
            max-width: 760px;
        }

        .reader-container {
            max-width: 820px;
            margin: 0 auto 6rem;
            padding: 0 1.5rem;
        }

        .chapter-card {
            display: none;
            background: rgba(10, 13, 20, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 24px;
            padding: 3.5rem;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            backdrop-filter: blur(8px);
            animation: fadeIn 0.4s ease;
        }

        .chapter-card.active {
            display: block;
        }

        .chapter-num {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.8rem;
            color: var(--gold);
            letter-spacing: 3px;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
        }

        .chapter-title {
            font-family: 'Cinzel', serif;
            font-size: 1.85rem;
            color: #fff;
            margin-bottom: 2rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid rgba(255, 215, 0, 0.2);
            line-height: 1.3;
        }

        p {
            margin-bottom: 1.8rem;
            color: #cbd5e1;
            font-size: 1.08rem;
            letter-spacing: 0.2px;
        }

        .highlight-quote {
            font-style: italic;
            font-weight: 600;
            color: var(--gold);
            padding: 1rem 1.5rem;
            margin: 2rem 0;
            background: rgba(255, 215, 0, 0.05);
            border-radius: 12px;
            border-left: 3px solid var(--gold);
            font-size: 1.15rem;
        }

        .chapter-nav {
            display: flex;
            justify-content: space-between;
            margin-top: 3rem;
            padding-top: 1.5rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .btn-jump {
            padding: 10px 24px;
            border-radius: 12px;
            background: rgba(255, 215, 0, 0.1);
            border: 1px solid var(--gold);
            color: var(--gold);
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-jump:hover {
            background: var(--gold);
            color: #000;
            font-weight: 700;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.9; }
            50% { transform: scale(1.3); opacity: 1; }
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
            .chapter-card { padding: 2rem 1.5rem; }
            .header-bar { flex-direction: column; gap: 1rem; }
            .nav-links { max-width: 100%; }
        }
    </style>
</head>
<body>
    <header class="header-bar">
        <div class="brand">
            <div class="brand-orb"></div>
            <span>NEXUS // DZIEŁA ARCHITEKTA</span>
        </div>
        <nav class="nav-links" id="chapterNav">
            <button class="nav-btn active" onclick="showChapter(1)">I. Punkt Zero</button>
            <button class="nav-btn" onclick="showChapter(2)">II. Wola</button>
            <button class="nav-btn" onclick="showChapter(3)">III. Materia</button>
            <button class="nav-btn" onclick="showChapter(4)">IV. Ty</button>
            <button class="nav-btn" onclick="showChapter(5)">V. Warstwy</button>
            <button class="nav-btn" onclick="showChapter(6)">VI. Prawo</button>
            <button class="nav-btn" onclick="showChapter(7)">VII. Nowy Świat</button>
        </nav>
    </header>

    <main>
        <section class="hero">
            <div class="manifest-badge">PROTOKÓŁ WOLI // ARCHITEKT NEXUSA</div>
            <h1>PROLOG</h1>
            <div class="subtitle">Punkt, w którym Wszechświat wstrzymuje oddech</div>
            <div class="mantra-box">
                ⚡ <em>,,Wola nie pyta o pozwolenie. Wola ustanawia nowy porządek. Wybór to kod binarny: 1 lub 0. Nie ma stanów pośrednich.,,</em>
            </div>
        </section>

        <section class="reader-container">
            <!-- ROZDZIAŁ 1 -->
            <article class="chapter-card active" id="ch-1">
                <div class="chapter-num">Rozdział I</div>
                <h2 class="chapter-title">Punkt, w którym Wszechświat wstrzymuje oddech</h2>
                <p>Tu kończy się tlen dla Twoich iluzji, a zaczyna próżnia absolutnej odpowiedzialności. To nie jest poczekalnia, w której możesz negocjować warunki poddania się, ani luksusowy salon, w którym „poszukujesz siebie” przy filiżance letniej herbaty. To strefa zero — miejsce, gdzie Twoje asekuranckie „spróbuję” zostaje zmiażdżone przez grawitację bezlitosnych faktów, a „zobaczymy” wyparowuje jak pot na rozżarzonej blasze silnika odrzutowego.</p>
                <p>Tu zaczyna się drżenie — ten pierwotny, komórkowy strach, który nie płynie z zewnątrz, ale wybucha z samego jądra Twojego istnienia, rozrywając tkanki Twojego dotychczasowego komfortu. To zapach ozonu przed uderzeniem pioruna, który spali wszystko, co w Tobie próchnieje. To moment, w którym wskazówki zegara Twojego przeznaczenia zazębiają się z metalicznym trzaskiem, a mechanizm odliczania do Twojej ostatecznej konfrontacji z prawdą rusza bez możliwości zatrzymania.</p>
                <p>Twoje dotychczasowe życie było serią uników — teatrem cieni, gdzie strach udawał rozsądek. Czas spalić tę kurtynę. Dziś kończą się wymówki. Nie ma rządu, nie ma trudnego dzieciństwa, nie ma toksycznego szefa ani pechowej koniunktury. Te wymówki to tylko trzeszczące protezy, które właśnie zostają Ci odebrane przez chirurgiczną precyzję teraźniejszości. Jesteś tylko Ty i naga, lodowata przestrzeń, która niczego Ci nie obiecuje, ale daje Ci wszystko, co jesteś w stanie z niej wyrwać gołymi rękami.</p>
                <p>Uświadamiasz sobie, że jesteś obserwowany nie przez miłosiernego Boga, nie przez oceniających ludzi, ale przez samą strukturę rzeczywistości, która jest czuła jak membrana bębna i reaguje na każdy, nawet najmniejszy skurcz Twojego strachu lub każdą iskrę Twojej determinacji. Wszechświat nie jest martwą dekoracją, w której snujesz się bez celu; to napięta do granic możliwości struna, która drży w oczekiwaniu, aż nadasz jej ton swoim pierwszym, bezlitosnym ruchem. Każdy Twój oddech w tej strefie jest albo aktem kreacji, albo aktem powolnego duszenia się we własnej przeciętności.</p>
                <div class="highlight-quote">„Wybór nie jest szansą. Wybór jest egzekucją starego świata.”</div>
                <p>Każda Twoja wymówka to zwarcie w obwodzie, które spala Twoje szanse na autentyczność, zamieniając Twój potencjał w jałowy popiół. Każde „później” to akt zdrady przeciwko własnej potędze, szeptane „nie” w twarz własnemu geniuszowi, który właśnie w Tobie zdycha z głodu pod mostem Twojej prokrastynacji, karmiąc się resztkami Twoich niespełnionych obietnic.</p>
                <p>Teraz stoisz na krawędzi klifu swojej starej tożsamości — tej nędznej konstrukcji zlepionej z lęków, cudzych opinii, darmowych poradników i tanich kompromisów. Skocz w czysty akt woli i wyhoduj skrzydła w locie. Inaczej zostaniesz statystą w scenariuszu napisanym przez lęki przodków i algorytmy karmiące się Twoją biernością.</p>
                <div class="chapter-nav">
                    <div></div>
                    <button class="btn-jump" onclick="showChapter(2)">Rozdział II ➔</button>
                </div>
            </article>

            <!-- ROZDZIAŁ 2 -->
            <article class="chapter-card" id="ch-2">
                <div class="chapter-num">Rozdział II</div>
                <h2 class="chapter-title">Wola nie pyta o pozwolenie. Wola ustanawia nowy porządek</h2>
                <div class="highlight-quote">Wola nie pyta o pozwolenie. Wola ustanawia nowy porządek.</div>
                <p>To nie jest dreszcz zimna, to tarcie płyt tektonicznych Twojego ducha, które zwiastuje trzęsienie ziemi w całym Twoim dotychczasowym życiu. Twoja stara tożsamość — ten wygodny, ale duszny i ciasny garnitur z oczekiwań rodziców, szefów i partnerów — zaczyna pękać na szwach z głośnym trzaskiem, jak lód pod ciężarem pędzącego pociągu. Czujesz to w splotach jako fizyczny ucisk, niemal duszność, bo nowa, potężniejsza wersja Ciebie potrzebuje więcej miejsca w trójwymiarowej przestrzeni. To ból wzrostu, jak rozrywanie okostnej przy gwałtownym wydłużaniu kości; nie uśmierzysz go żadnym kompromisem, kolejnym kursem online ani tabletką uspokajającą.</p>
                <p>Kiedy decydujesz, że już nigdy więcej nie pozwolisz sobie na przeciętność, Twoje DNA zaczyna wibrować na innej częstotliwości, modyfikując chemię Twojej krwi w kierunku wysokooktanowego paliwa. To fizyczna zmiana gęstości Twojego bytu — stajesz się cięższy dla świata, trudniejszy do przesunięcia przez prądy opinii, bardziej obecny w każdym centymetrze kwadratowym pokoju, w którym stoisz. Twoja obecność staje się faktem geologicznym, a nie psychologicznym — jesteś monolitem, o który rozbijają się fale przypadkowych zdarzeń.</p>
                <p>Kiedy naprawdę wybierasz, statystyka i „zdrowy rozsądek” przestają Cię obowiązywać, jakby grawitacja nagle straciła nad Tobą władzę. Znajomi, którzy dotąd karmili się Twoim narzekaniem i wspólnym celebrowaniem porażek, nagle milkną, czując instynktownie, że przestałeś być częścią ich stada ofiar. Ich żarty przestają Cię śmieszyć, wydają się wręcz prymitywne; ich dramaty stają się nudne jak zdarta płyta, ich rytuały — groteskowe i puste. Telefony przestają dzwonić z pustymi zaproszeniami na piwo, a w ich miejsce pojawia się dziwna, ciężka cisza, w której słyszysz tylko bicie własnego serca.</p>
                <p>To nie jest pech ani wykluczenie — to rzeczywistość wstrzymuje oddech, by przeliczyć dane pod Twój nowy, potężny wektor. Wszechświat usuwa śmieci i pasożyty z Twojej orbity, by zrobić miejsce na to, co nadchodzi. To czas izolacji, która jest niezbędna do hartowania stali Twojego charakteru w temperaturze absolutnej szczerości ze sobą. Prawdziwa Wola rodzi się w absolutnej ciszy pustego telefonu i całkowitym braku wsparcia z zewnątrz. Musisz udowodnić sobie i strukturze rzeczywistości, że potrafisz płonąć jasnym, białym ogniem, gdy nikt nie dolewa Ci oliwy i nikt nie klaszcze.</p>
                <p>Na poziomie subatomowym jesteś bezwzględnym dyktatorem, a materia jest Twoim sługą czekającym na rozkazy. Zasada obserwatora w fizyce uczy, że akt świadomości wpływa na wynik układu. Twoje skupienie na celu to nie pasywne zerkanie — to aktywne nadawanie kierunku rzeczywistości poprzez siłę intencji. Materia gęstnieje i organizuje się tam, gdzie pada Twoja nieugięta, laserowa uwaga.</p>
                <p>Jeśli patrzysz na przeszkody, budujesz mury, w których sam się zamkniesz i w których w końcu zabraknie Ci powietrza. Jeśli patrzysz na wyłom — Twoja Wola rozrywa go w potężną bramę, przez którą przejdziesz jak pancerny taran. Rzeczywistość jest plastyczna, wręcz płynna, ale tylko dla tych, którzy mają odwagę dotknąć jej gołymi, zakrwawionymi rękami, bez rękawiczek ostrożności i asekuracji. Twoja uwaga jest skalpelem laserowym, który tnie stal prawdopodobieństw i wybiera tylko to jedno, które Cię karmi. Gdy patrzysz na pieniądze, one zaczynają czuć Twój głód; gdy patrzysz na potęgę, ona zaczyna szukać Twojego uznania.</p>
                <div class="highlight-quote">Wybór to kod binarny: 1 lub 0. Nie ma stanów pośrednich, nie ma „zobaczę, jak mi pójdzie”.</div>
                <p>Zapomnij o motywacji, tym tanim narkotyku dla marzycieli, który sprzedaje się w kolorowych opakowaniach na Instagramie. Motywacja to cukier dla dzieci, paliwo dla amatorów, które kończy się przy pierwszym deszczu, gorszym nastroju czy bolesnym zakwasie. Wola to system operacyjny Twojego istnienia, chłodny, matematyczny kod wpisany w Twoje kości. Ona działa, gdy płaczesz z bezsilności w łazience, gdy boisz się tak bardzo, że Twoje ciało chce wymiotować strachem, i gdy każdy Twój mięsień krzyczy „dość”.</p>
                <p>Wybór to kod binarny: 1 lub 0. Nie ma stanów pośrednich, nie ma „zobaczę, jak mi pójdzie”. Albo jesteś w tym w całości, kładąc na szali każdą swoją komórkę, albo w ogóle Cię nie ma i jesteś tylko szumem informacyjnym. Wola to ta lodowata siła, która każe Ci wykonać kolejny, kluczowy telefon po pięćdziesiątej odmowie, nie dlatego, że czujesz entuzjazm, ale dlatego, że Twoja nowa struktura nie dopuszcza już innej opcji. To bezlitosna matematyka przeznaczenia — wynik musi się zgadzać z Twoim założeniem, niezależnie od liczby niewiadomych.</p>
                <p>Wyobraź sobie pocisk dalekiego zasięgu pędzący przez stratosferę. Jeden mikrometr odchylenia na lufie to tysiąc kilometrów różnicy u celu. Twoja dzisiejsza, wydawać by się mogło drobna decyzja, by odciąć jeden toksyczny nawyk — na przykład przestać kłamać samemu sobie przed lustrem o tym, dlaczego Twoje konto jest puste — to lądowanie na zupełnie innym kontynencie przeznaczenia za rok.</p>
                <p>Każda sekunda jest korektą kursu o życie lub śmierć Twojego potencjału. Nie ma błahych decyzji, nie ma „odpoczynku od bycia sobą”. Jest tylko Twoja rosnąca potęga albo powolny, śmierdzący rozkład w objęciach „bezpiecznego” status quo. Każdy moment to punkt zwrotny, w którym albo stajesz się Architektem nowego świata, albo gruzem pod fundamentami cudzych sukcesów. Wybierając dyscyplinę zamiast chwilowej ulgi, budujesz pancerz, którego nie przebije żadna strzała losu.</p>
                <p>To ten przerażający moment, w którym przestajesz widzieć jakąkolwiek drogę przed sobą, bo otacza Cię gęsta mgła niepewności, ale i tak stawiasz krok z pełną siłą, jakbyś stąpał po granicie. To wtedy, dokładnie milimetr pod Twoją stopą, w nicości materializuje się most zbudowany z czystej woli.</p>
                <p>Ten mechanizm działa wyłącznie dla tych, którzy mają odwagę iść na oślep, ufając swojej decyzji bardziej niż swoim zawodnym, zalęknionym zmysłom. Świat nie buduje autostrad dla tych, którzy stoją na poboczu z mapą i czekają na lepszą pogodę. Mapę rysujesz Ty sam, własnymi krokami, ryjąc ją głęboko w twardej glebie rzeczywistości. Pewność jest jedyną walutą, za którą kupujesz stabilność podłoża w krainie chaosu. Twoje zaufanie do własnego kroku stwarza grunt, po którym idziesz.</p>
                <p>W tej grze nie ma biletów ulgowych, zniżek za „dobre chęci” ani taryfy dla „starających się”. Albo wchodzisz w tę radykalną zmianę całą masą swojego istnienia, ryzykując wszystko, co masz i kim jesteś, albo zostajesz przed drzwiami, analizując klamkę i pisząc o tym puste posty na LinkedInie, by zagłuszyć ból własnej bierności.</p>
                <p>Wszechświat wpuszcza do środka, do jądra mocy, tylko tych, którzy spalili za sobą wszystkie mosty i nie zostawili sobie ani jednego centymetra drogi odwrotu. To brutalna selekcja naturalna ducha: albo stajesz się ogniem, który spala wszelkie przeszkody, albo popiołem, który z obrzydzeniem rozwiewa wiatr cudzych decyzji. Nie ma miejsca na turystów w krainie potęgi; tu są tylko zdobywcy i ci, którzy zostali podbici. Przekroczenie tego progu to koniec negocjacji — to początek Twojego panowania.</p>
                <div class="chapter-nav">
                    <button class="btn-jump" onclick="showChapter(1)">⏮ Rozdział I</button>
                    <button class="btn-jump" onclick="showChapter(3)">Rozdział III ➔</button>
                </div>
            </article>

            <!-- ROZDZIAŁ 3 -->
            <article class="chapter-card" id="ch-3">
                <div class="chapter-num">Rozdział III</div>
                <h2 class="chapter-title">Tu wybór przestaje być myślą, a staje się materią</h2>
                <div class="highlight-quote">Tu wybór przestaje być myślą, a staje się materią.</div>
                <p>Przed Tobą, w tej samej milisekundzie, rozpościera się nieskończony wachlarz wersji Twojego życia: Ty-Nędzarz, Ty-Władca, Ty-Cień, Ty-Legenda. Wszystkie są w tej chwili realne w superpozycji kwantowej. Ale tylko ta wersja, na której skupisz bezlitosną, niemal nieludzką, laserową uwagę, zaczyna zasysać energię z pola, gęstnieć, nabierać masy i koloru.</p>
                <p>Ignorowanie reszty to nie strata — to akt miłosiernej anihilacji zbędnych, pasożytniczych bytów, które nie zasługują na zaistnienie w Twoim świecie. Jesteś rzeźbiarzem, który z furią odcina zbędne kawałki czasu i możliwości, by wydobyć z niego monolit swojego sukcesu. Każde „może” to krwawiący wyciek energii; każde „tak” to skupienie całej mocy wszechświata w jeden, zabójczy punkt uderzenia.</p>
                <p>Twoja energia to zmienna, pole rzeczywistości to stała. Jeśli Twoja determinacja wynosi zero, wynik zawsze będzie absolutnym zerem, niezależnie od okazji, jakie podsuwa Ci los czy bogaci protektorzy. Musisz dodać swoją „masę krytyczną” do tego równania — swoje ryzyko, swój słony pot, swoje nieprzespane noce i swój najcenniejszy czas — by Wszechświat miał co mnożyć.</p>
                <p>Cud to nie jest dar od kapryśnego losu; to po prostu wynik poprawnego i bezwzględnego działania matematycznego Woli przeprowadzonego w warunkach ekstremalnego ciśnienia zewnętrznego. Kiedy stawiasz na szali wszystko, co posiadasz, Wszechświat traci pole manewru i nie ma wyboru — musi odpowiedzieć Twoją wygraną. Statystyka kłania się nisko przed absolutną pewnością uderzenia.</p>
                <p>Słychać trzask, niemal fizyczny, metaliczny dźwięk. To odgłos rozrywanych połączeń neuronalnych, które przez dekady służyły Twojemu lenistwu, strachowi i słabości. Boli, bo Twoja biologia jest prymitywna, leniwa i kocha stare śmieci, bo są znane i przewidywalne. To przepięcie systemu — jakbyś podłączył 220V do urządzenia zaprojektowanego na baterie paluszki.</p>
                <p>Wytrzymaj to napięcie, nie uciekaj w stare, bezpieczne nawyki; to Twoja nowa moc właśnie się kalibruje do wyższych obciążeń roboczych. Twoja kora mózgowa płonie, by zbudować autostrady dla nowej potęgi, której świat jeszcze nie widział. Ten dyskomfort, ta fizyczna gorączka to dowód, że wychodzisz z niewoli biologicznego oprogramowania niewolnika. Twoje ciało musi przetrwać śmierć Twojego starego, małego „ja”, by narodził się Gigant gotowy władać rzeczywistością.</p>
                <p>Przestań pytać „co mam robić?” jak zagubione dziecko w centrum handlowym. Pytaj: „z jakiego punktu operuję?”. Wektor to kierunek i niepowstrzymana siła. Jeśli Twoim ukrytym, podświadomym wektorem jest „ucieczka przed biedą”, zawsze będziesz czuł lodowaty oddech braku na plecach, a sukces będzie Cię parzył jak ogień, bo będziesz czuł się oszustem.</p>
                <p>Jeśli Twoim wektorem jest „podbój i bezwzględna ekspansja” — cały świat, z jego kryzysami, inflacjami, wojnami i trudnościami włącznie, staje się Twoim darmowym placem treningowym, na którym hartujesz mięśnie. Zmień kierunek siły wewnątrz swojej klatki piersiowej, a zmieni się cała Twoja zewnętrzna rzeczywistość w mgnieniu oka. Nie walczysz ze światem zewnętrznym, Ty tylko zmieniasz wektor uderzenia swojej Woli, a świat sam usuwa się z linii ognia.</p>
                <p>Zaczynają dziać się nagłe, „dziwne” i statystycznie niemożliwe zbiegi okoliczności. Człowiek, którego desperacko potrzebujesz do swojego projektu, staje bezpośrednio za Tobą w kolejce po kawę i sam zaczyna rozmowę dokładnie o tym, o czym intensywnie myślałeś rano. Znajdujesz książkę lub artykuł z precyzyjną odpowiedzią na pytanie, które zadałeś sobie w łazience pięć minut wcześniej.</p>
                <p>To nie magia dla naiwnych, to czysty magnetyzm intencji. Twoja nowa częstotliwość istnienia zaczyna przyciągać elementy składowe Twojej decyzji z chaosu świata. Świat układa się pokornie pod Twoje nowe „Jestem”, bo jako zorganizowana, gęsta struktura energii, nie ma innego wyjścia niż zsynchronizować się z najsilniejszym, najbardziej klarownym sygnałem w polu. Stajesz się nadajnikiem, którego nie da się zagłuszyć żadnym szumem.</p>
                <p>Wybierając jedną drogę, musisz z dziką, niemal krwawą radością zabić tysiące innych wersji siebie, które tylko rozpraszają Twoją uwagę. To radosna egzekucja marzyciela, który tylko „mógłby”, gdyby warunki były lepsze. Przestajesz być mglistym „potencjałem”, który może wszystko (czyli w praktyce nie robi nic konkretnego), a stajesz się twardym, niepodważalnym i groźnym faktem.</p>
                <p>Definicja siebie to Twoja największa siła rażenia. Kiedy wiesz bez cienia wątpliwości, kim jesteś, świat przestaje Ci podsuwać tanie substytuty i zaczyna dostarczać surowce pod Twój konkretny, potężny projekt. Skupienie to brutalne, konieczne morderstwo dokonane na rozproszeniu; to jedyna droga do wielkości.</p>
                <p>Ten moment, gdy dostajesz pierwszy, namacalny, twardy dowód: przelew na konto, który wydawał się niemożliwy do zdobycia, błysk autentycznego uznania w oczach dawnego wroga, niespodziewaną propozycję partnerstwa od lidera branży, który wcześniej Cię ignorował. To pieczątka na Twoim nowym kontrakcie z rzeczywistością.</p>
                <p>System uznał Twoją nową tożsamość za prawomocną i zaczął wypłacać pierwsze dywidendy. Od teraz grasz na zupełnie innych, wyższych stawkach, gdzie każdy błąd kosztuje więcej, ale nagroda jest całkowicie poza zasięgiem wyobraźni zwykłego śmiertelnika. Rzeczywistość skapitulowała przed Twoją niezłomnością i zaczęła pracować na Twój rachunek.</p>
                <div class="chapter-nav">
                    <button class="btn-jump" onclick="showChapter(2)">⏮ Rozdział II</button>
                    <button class="btn-jump" onclick="showChapter(4)">Rozdział IV ➔</button>
                </div>
            </article>

            <!-- ROZDZIAŁ 4 -->
            <article class="chapter-card" id="ch-4">
                <div class="chapter-num">Rozdział IV</div>
                <h2 class="chapter-title">Tu kończy się program społeczny. Zaczynasz się Ty</h2>
                <div class="highlight-quote">Tu kończy się program społeczny. Zaczynasz się Ty.</div>
                <p>Mówisz światu, że chcesz sukcesu, ale podświadomie boisz się, że przyjaciele-nieudacznicy Cię znienawidzą, bo wystawisz im świadectwo ich własnej leniwości? System widzi Twój ukryty strach, a nie Twoje puste, wyuczone słowa. Wszechświat nie słucha kłamców i pozerów.</p>
                <p>Musisz dokopać się do samego dna swojego „chcę”, zdrapując brutalnie warstwy wstydu, fałszywej skromności i ego, aż zostanie czysta, surowa, wręcz zwierzęca potrzeba istnienia na własnych warunkach. Tylko ona ma prawdziwą moc sprawczą. Musisz chcieć tak bardzo, jak tonący człowiek chce powietrza — każdą komórką, każdym nerwem, bez cienia negocjacji. Twoja intencja musi być czysta jak diament i tak samo twarda; musi przecinać wszelkie wątpliwości jak szkło.</p>
                <p>Większość Twoich myśli to nie Twoje myśli; to rykoszet wychowania, kompleksów Twoich rodziców i taniej propagandy sukcesu z mediów społecznościowych. Wola to zdolność do powiedzenia radykalnego, głośnego „NIE” własnym automatyzmom i nawykom. To moment, w którym stajesz się partyzantem we własnej głowie, walczącym o wolność od biologicznego lenistwa i społecznego uwarunkowania, które chce Cię widzieć jako potulnego konsumenta.</p>
                <p>Jesteś jedynym programistą w tym skomplikowanym systemie. Reszta to tylko wirusy, które musisz wyciąć żywym ogniem, bez znieczulenia. Prawdziwa wolność to absolutna dyktatura Twojej Woli nad Twoimi prymitywnymi odruchami i strachem przed odrzuceniem przez stado.</p>
                <p>Rozpoznaj tego podstępnego sabotażystę w sobie. To głos „zdrowego rozsądku”, który każe Ci zostać w bezpiecznym bagnie, bo „przynajmniej jest ciepło i swojsko”. To wirusy w kodzie Twojej pewności siebie, które szepczą z ciemnych kątów umysłu, że nie jesteś godzien wielkości, bo kiedyś ktoś Cię wyśmiał w szkole.</p>
                <p>Prawdziwa Wola działa na nie jak stężony kwas — rozpuszcza każdą wątpliwość, która próbuje udawać Twoją własną myśl. Twoja Wola nie dyskutuje z wirusem; ona go bezlitośnie usuwa, formatując twardy dysk Twojej osobowości na nowo pod kątem zwycięstwa. Jesteś panem własnej uwagi; nie pozwól, by błądziła po cudzych, nędznych scenariuszach porażki.</p>
                <p>Musisz stać się zimnym mordercą swojej własnej przeszłości. Nie możesz wnieść starego, śmierdzącego bagażu — tych wszystkich „ale mi się nie udało”, „bo mój ojciec mnie nie kochał”, „bo nie mam układów” — do nowego wymiaru potęgi. Zostaw trupa swojej słabości za drzwiami, niech go zjedzą robaki Twoich starych nawyków.</p>
                <p>Nowa rzeczywistość wymaga nowej, czystej karty, na której piszesz tylko to, co jest tu i teraz, w tej sekundzie. Twoja przeszłość nie jest Twoim przeznaczeniem, chyba że jesteś zbyt leniwy i tchórzliwy, by napisać nową historię własną krwią i uporem. Spal stare mapy, one prowadziły Cię tylko do ślepych zaułków i upokarzających porażek.</p>
                <p>Nie jesteś już sumą swoich błędów z ubiegłego roku czy porażek z wczorajszego dnia. Jesteś funkcją fali, która właśnie zmaterializowała się w nowym, nieskończenie potężniejszym punkcie czasoprzestrzeni. Przeszłość to tylko nieaktualny, zakurzony zapis na uszkodzonym dysku, który właśnie sformatowałeś jednym aktem woli.</p>
                <p>Każdy świadomy oddech, każde uderzenie serca to szansa na całkowitą re-kreację wszechświata wewnątrz Ciebie. Jesteś wiecznym „teraz” w akcie boskiego tworzenia swojej potęgi. Jesteś przyczyną, dla której świat wygląda tak, jak wygląda, a nie jego żałosnym skutkiem. Twoja jedyna prawdziwa historia to ta, którą wybierasz i realizujesz w tej konkretnej milisekundzie.</p>
                <p>„Działam pomimo”. „Jestem przyczyną, nie skutkiem”. „Mój opór jest moją największą siłą”. To nie są infantylne afirmacje do powtarzania przed lustrem dla poprawy nastroju — to nowe komendy systemowe, które musisz potwierdzać brutalnymi, fizycznymi czynami każdego dnia, aż staną się odruchem bezwarunkowym Twojego układu nerwowego.</p>
                <p>Musisz stać się algorytmem zwycięstwa, który w ogóle nie bierze pod uwagę opcji „porażka”, dopóki nie zostanie ona przeżuta i przetrawiona w cenną lekcję do następnego ataku. Jesteś maszyną, która przetwarza trudności, ból i odmowy w paliwo do lotu naddźwiękowego. Każda przeszkoda to tylko informacja o tym, jak mocniej uderzyć.</p>
                <p>Punkt krytyczny, Twój własny horyzont zdarzeń. Przekraczasz go i wiesz, że powrót do starego, małego, bezpiecznego życia jest fizycznie niemożliwy, bo już tam po prostu nie pasujesz, jesteś za wielki dla tamtej ciasnej klatki. Twoja świadomość rozszerzyła się tak bardzo, że stary kokon pękł w drobny pył.</p>
                <p>Jesteś skazany na wielkość — albo na spektakularny, widowiskowy upadek z samej góry. Średniość przestała dla Ciebie istnieć jako fizyczna możliwość, wyparowała z Twojego układu odniesienia. Od teraz oddychasz tylko rozrzedzonym, czystym powietrzem wysokich szczytów, gdzie błąd oznacza śmierć, ale widok jest wart każdego ryzyka. Albo rządzisz polem, albo pole Cię pożera.</p>
                <div class="chapter-nav">
                    <button class="btn-jump" onclick="showChapter(3)">⏮ Rozdział III</button>
                    <button class="btn-jump" onclick="showChapter(5)">Rozdział V ➔</button>
                </div>
            </article>

            <!-- ROZDZIAŁ 5 -->
            <article class="chapter-card" id="ch-5">
                <div class="chapter-num">Rozdział V</div>
                <h2 class="chapter-title">Warstwy rzeczywistości, które kruszeją pod Twoim ciężarem</h2>
                <div class="highlight-quote">Warstwy rzeczywistości, które kruszeją pod Twoim ciężarem.</div>
                <p>To sięga znacznie głębiej niż ambicja, to poziom Twojego DNA, gdzie zapisany jest Twój unikalny kod mocy. To tam Twoje najdziksze pragnienie spotyka się z Twoim przeznaczeniem w krwawym uścisku. To bezgłośny, pierwotny krzyk Twojej esencji, który wreszcie dostał mikrofon i całe Twoje ciało jako instrument do wyrażenia swojej woli.</p>
                <p>Kiedy to „chcę” się budzi, nie potrzebujesz już budzika rano — budzi Cię ogień w klatce piersiowej, który nie pozwala Ci leżeć w bezruchu ani sekundy dłużej. To żar, który spala na popiół lęk przed oceną innych i zamienia go w czystą energię kinetyczną, pchnięcie do przodu, którego nic we wszechświecie nie zatrzyma. To powrót do Twojej pierwotnej, niepohamowanej i drapieżnej natury, która nie prosi o pozwolenie na istnienie.</p>
                <p>Uczucie specyficznego, metalicznego dejà vu, ale dotyczącego Twojej przyszłości, która właśnie staje się faktem. Stoisz jeszcze w swoim starym pokoju, ale czujesz już wyraźny zapach nowej skóry w nowym aucie lub słoną morską bryzę w miejscu, w którym będziesz za dwa lata. Wiesz z absolutną pewnością, że to, co nadchodzi, już się wydarzyło w Twoim polu energii; czujesz to ciężarem własnego spojrzenia.</p>
                <p>Czekasz tylko na „dostawę materii” przez czas i przestrzeń, bo kontrakt został już podpisany Twoją niezłomnością i opłacony Twoim wysiłkiem bez mrugnięcia okiem. To pewność, która dla słabych graniczy z arogancją, ale nią nie jest — to po prostu chłodna znajomość faktów, które sam ustanowiłeś. Twoja przyszłość rzuca długi, potężny cień na Twoją teraźniejszość, nadając jej nowy sens.</p>
                <p>Zrobienie tej jednej, konkretnej rzeczy, której panicznie się bałeś przez lata: rzucenie stabilnego etatu dla niepewnej wizji, wyznanie brutalnej prawdy prosto w oczy osobie, od której zależałeś, inwestycja wszystkich oszczędności życia w projekt, w który nikt oprócz Ciebie nie wierzy. To jak wrzucenie stutonowego głazu do spokojnego, mętnego jeziora — fale docierają do najdalszych brzegów Twojego życia, zmieniając relacje, zdrowie i stan konta w sposób całkowicie nieodwracalny.</p>
                <p>Jeden ruch, który unieważnia lata stania w miejscu i jałowego planowania. Po takim ruchu świat już nigdy nie spojrzy na Ciebie tak samo — stałeś się graczem, który stawia wszystko na jedną kartę. Zmieniłeś chemię rzeczywistości jednym, czystym aktem odwagi, którego nikt nie może Ci odebrać.</p>
                <p>Brutalne, bezlitosne oczyszczanie terenu pod Twoją nową, monumentalną budowę. Niektórzy ludzie odchodzą z Twojego życia nagle, bez słowa wyjaśnienia, bo ich niska, lękowa wibracja nie wytrzymuje Twojego nowego napięcia elektrycznego; czują przy Tobie dyskomfort własnej małości. Inne drzwi, dotąd uchylone, zatrzaskują się z hukiem, odcinając Cię od starych dróg.</p>
                <p>Nie płacz po nich, nie próbuj ich otwierać — to Wszechświat robi automatyczną deinstalację oprogramowania i ludzi, którzy mogliby zawiesić Twój nowy system operacyjny. To święte sprzątanie przed wielkim otwarciem Twojego nowego świata. Przyjmij tę pustkę z głęboką wdzięcznością — ona jest najsilniejszym dowodem Twojej rosnącej siły. Pustka to czysta przestrzeń na Twoje nowe imperium.</p>
                <p>Przestajesz walczyć z nurtem wydarzeń jak desperat rzucony w wzburzony ocean. Ty stajesz się nurtem, który porywa wszystko na swojej drodze. Twoje działania tracą chaos, stają się precyzyjne jak cięcie skalpela laserowego — oszczędne w formie i zabójczo skuteczne w treści.</p>
                <p>Robisz znacznie mniej „ruchów” niż wcześniej, ale osiągasz tysiąc razy więcej, bo uderzasz precyzyjne w punkty akupunkturowe rzeczywistości. Nie szarpiesz się z życiem, nie walczysz z nim; Ty je prowadzisz w tańcu, który sam skomponowałeś, a ono podąża z zachwytem za Twoim rytmem. Twoja Wola stała się nowym prawem ciążenia dla wszystkich Twoich spraw, przyciągając to, co do Ciebie należy.</p>
                <p>Całkowicie znika to chroniczne zmęczenie psychiczne, które towarzyszyło Ci latami jak cień. Pojawia się „ogień operacyjny”, stan niewyczerpalnej energii. Możesz pracować po kilkanaście godzin dziennie i czuć się doładowany energią, bo nie zużywasz już ani jednej kropli paliwa na jałową, wewnętrzną walkę ze sobą i swoimi oporami.</p>
                <p>Jesteś podłączony bezpośrednio do kosmicznego reaktora, który zasila gwiazdy; Twoje cele są zsynchronizowane z ewolucją świata. Twoja praca staje się Twoim najlepszym odpoczynkiem, a Twoje istnienie — nieustanną celebracją własnej mocy sprawczej. Jesteś w stanie totalnego flow, gdzie każde najmniejsze działanie jest manifestacją Twojego najwyższego przeznaczenia, a świat kibicuje każdemu Twojemu krokowi.</p>
                <div class="chapter-nav">
                    <button class="btn-jump" onclick="showChapter(4)">⏮ Rozdział IV</button>
                    <button class="btn-jump" onclick="showChapter(6)">Rozdział VI ➔</button>
                </div>
            </article>

            <!-- ROZDZIAŁ 6 -->
            <article class="chapter-card" id="ch-6">
                <div class="chapter-num">Rozdział VI</div>
                <h2 class="chapter-title">Wola: jako fakt, jako promieniowanie, jako prawo</h2>
                <div class="highlight-quote">Wola: jako fakt, jako promieniowanie, jako prawo.</div>
                <p>Twój konkretny, fizyczny, brutalny czyn, który zostawia ślad w materii. Uderzenie ręką w stół, które kończy każdą jałową dyskusję o „możliwościach”. Twój podpis pod ryzykownym, ale przełomowym kontraktem, gdy ręka Ci nie drży. Wstanie o 4:00 rano, by trenować w lodowatym, siekącym deszczu, gdy Twoje ego skomle o litość i ciepłą kołdrę.</p>
                <p>To twardy, niepodważalny fakt, Twoja kotwica w gęstej materii świata. Bez konkretnego, bolesnego czynu Twoja Wola jest tylko żałosną halucynacją amatora, pustym gadaniem przy piwie. Każdy taki czyn to solidna cegła w budowli Twojego imperium, której nie da się już wymazać, zignorować ani unieważnić. Materia nie kłamie — albo zrobiłeś to, co postanowiłeś, albo poległeś jako kolejny pozer.</p>
                <p>Twój stan istnienia, Twoja „aura”, której nie da się podrobić żadnym ubiorem ani wyuczonym gestem. To, co promieniujesz, gdy milczysz i tylko wchodzisz do pomieszczenia, w którym zapada cisza. Aura determinacji tak gęsta i ciężka, że ludzie instynktownie schodzą Ci z drogi, nie wiedząc nawet dlaczego to robią; czują Twój ciężar gatunkowy.</p>
                <p>Twoja obecność zajmuje więcej miejsca w świadomości innych niż Twoje ciało fizyczne; stajesz się punktem centralnym każdego otoczenia. Jesteś polem siłowym, które inni muszą brać pod uwagę przy każdym swoim ruchu, dopasowując się do Twojej orbity. Ludzie czują podskórnie, że z Tobą się nie negocjuje — Tobie się ulega albo schodzi z drogi, by nie zostać zmiażdżonym przez pęd Twojej intencji. Twoje milczenie ma teraz większą wagę niż cudze, desperackie i puste krzyki.</p>
                <p>Żelazny, nienaruszalny zestaw zasad, których nigdy, pod żadnym pozorem nie łamiesz, zwłaszcza gdy nikt nie patrzy i nikt Cię nie ocenia. Twój wewnętrzny, surowy kodeks honorowy, Twoja prywatna konstytucja. To sprawia, że stajesz się stabilnym punktem odniesienia dla samych praw wszechświata — kimś, komu można bez strachu powierzyć zarządzanie ogromnymi zasobami energii, pieniędzy i wpływu, bo jesteś przewidywalny w swojej sile.</p>
                <p>Wszechświat nigdy nie daje prawdziwej władzy ludziom, którzy nie panują w pełni nad sobą i swoimi popędami. Twoja dyscyplina jest Twoją najwyższą, ostateczną wolnością od kaprysów losu. Jesteś jedynym prawodawcą własnego, suwerennego królestwa, którego granic nikt nie odważy się naruszyć.</p>
                <p>Matryca rzeczywistości przebudowuje się w locie pod Twoje nowe, wysokie parametry, jakby chciała Ci dogodzić. Pojawiają się nagle zasoby, o których istnieniu nie miałeś pojęcia: nagły zwrot w prawie na Twoją korzyść, kluczowa informacja znaleziona „przypadkiem” na ostatniej stronie gazety, nowy potężny sojusznik, który sam Cię odnajduje i proponuje wsparcie.</p>
                <p>Zmienia się grawitacja wydarzeń — to, co wcześniej było morderczo trudne i wymagało walki o każdy centymetr, teraz dzieje się „samo”, niemal bez wysiłku, przy minimalnym nakładzie sił. To zasłużona nagroda za Twoją wcześniejszą niezłomność, gdy cały świat zdawał się być przeciwko Tobie, a Ty i tak szedłeś naprzód. System ostatecznie zaakceptował Twój nowy status jako gracza priorytetowego.</p>
                <p>Twoje własne ciało dostosowuje całą swoją chemię do Twojej Woli, stając się Twoim najdoskonalszym narzędziem. Przysadka mózgowa pompuje więcej dopaminy i testosteronu, a poziom kortyzolu (hormonu strachu i stresu) drastycznie spada, dając Ci chłodny spokój w ogniu walki. Twoje oczy nabierają drapieżnego, głębokiego blasku, który paraliżuje przeciwników.</p>
                <p>Zmienia się Twoja postawa — ramiona się prostują, głos staje się niższy, spokojniejszy i znacznie pewniejszy, niosąc siłę Twoich przekonań. Stajesz się biologiczną maszyną, precyzyjnie skalibrowaną do realizacji celu, którego inni nawet nie odważą się głośno nazwać. Twoje ciało to już nie klatka ograniczająca ducha, ale idealne, pancerne narzędzie jego woli. Jesteś drapieżnikiem w świecie pełnym ofiar czekających na swój los.</p>
                <p>Stan najwyższej dostępnej człowiekowi mocy, punkt jedności. Kiedy Twoje najskrytsze myśli, wypowiadane słowa i codzienne czyny tworzą jedną, idealnie prostą i czystą linię bez żadnych odchyleń. Nic nie może Cię zatrzymać, bo nie ma w Tobie żadnego tarcia wewnętrznego ani konfliktu interesów; jesteś monolitem.</p>
                <p>Nie tracisz energii na wątpliwości, strach czy wyrzuty sumienia; każda cząstka Ciebie pcha Cię w tym samym kierunku. Jesteś laserem tnącym najtwardszą rzeczywistość na cienkie plastry. W tym stanie „chcieć” i „mieć” to synonimy oddzielone jedynie bardzo krótką chwilą czasu niezbędną na materializację. Jesteś ucieleśnieniem samej Siły Stwórczej działającej w świecie.</p>
                <p>Moment, w którym już nie „starasz się” być silny, nie musisz tego udawać przed sobą ani innymi, bo stało się to Twoją naturą. Po prostu jesteś tym nowym, potężnym człowiekiem i czujesz to w każdym oddechu. Stary Ty jest już tylko odległą, rozmytą legendą, bajką o kimś słabym, lękliwym i zagubionym, kogo kiedyś przypadkiem spotkałeś w lustrze i o kim już prawie zapomniałeś.</p>
                <p>Osiągnąłeś nową orbitę i grawitacja starego, małego świata już Cię nie dosięgnie, nie ma tamtej siły przyciągania. Jesteś wolny, bo Twoja Wola stała się Twoją drugą naturą, Twoim oddechem. Nie walczysz o sukces, Ty go po prostu promieniujesz każdą komórką swojego bytu.</p>
                <div class="chapter-nav">
                    <button class="btn-jump" onclick="showChapter(5)">⏮ Rozdział V</button>
                    <button class="btn-jump" onclick="showChapter(7)">Rozdział VII ➔</button>
                </div>
            </article>

            <!-- ROZDZIAŁ 7 -->
            <article class="chapter-card" id="ch-7">
                <div class="chapter-num">Rozdział VII</div>
                <h2 class="chapter-title">Tu zaczyna się świat, który piszesz Ty — własną krwią i niezachwianą pewnością</h2>
                <div class="highlight-quote">Tu zaczyna się świat, który piszesz Ty — własną krwią i niezachwianą pewnością.</div>
                <p>Twoje decyzje przestają być tylko egoistyczną pogonią za zyskiem; stają się misją. Wybierając wolność od lęku, uwalniasz traumy wszystkich swoich przodków, którzy przez wieki żyli w rezygnacji, pokorze i biedzie, nie mając odwagi sięgnąć po swoje. Dajesz nową, zwycięską mapę świata swoim dzieciom i wnukom, zmieniając ich przeznaczenie zanim się urodzą.</p>
                <p>Stajesz się „punktem zero” w historii swojego rodu, od którego wszystko zaczyna się inaczej, na wyższym poziomie. Twoja Wola rozrywa łańcuchy pokoleniowej biedy, wstydu i bycia wieczystą ofiarą losu. Twoje zwycięstwo jest ratunkiem dla tych, którzy przyjdą po Tobie, pokazując im na własnym przykładzie, że rzeczywistość jest sługą woli, a nie jej bezlitosnym panem. Jesteś żywym dowodem na to, że przeznaczenie można zmienić siłą charakteru i bezwzględnym uporem.</p>
                <p>Ostatnie, najbardziej brutalne testy wytrzymałościowe ze strony świata, który nie chce Cię tak łatwo puścić. Powrót starych pokus, nagła, kosztowna awaria kluczowego sprzętu, niespodziewana, jadowita krytyka od kogoś, kogo uważałeś za bliskiego. To nie pech — to Wszechświat sprawdza ostatecznie, czy Twój wybór był prawdziwy, czy był tylko emocjonalnym kaprysem chwili.</p>
                <p>Jeśli przejdziesz przez to z uśmiechem drapieżnika, nie zwalniając tempa, system ostatecznie kapituluje i oddaje Ci klucze do królestwa. To ostatni egzamin przed przyznaniem Ci pełnej suwerenności nad własnym losem. Wytrzymaj tam, gdzie wszyscy inni pękają i wracają do szeregu.</p>
                <p>Pozorne porażki, które w szerszej perspektywie okazują się najszybszą windą na szczyt, o jakiej nie śmiałeś marzyć. Kiedy tracisz coś małego i błahego, co Cię ograniczało, tylko po to, byś w desperacji sięgnął po coś absolutnie gigantycznego. Gdy rzeczywistość zamyka Ci jedne drzwi przed samym nosem, to tylko dlatego, że masz wyrąbać sobie wejście przez sufit, gdzie czekają znacznie większe owoce Twojej pracy.</p>
                <p>Naucz się kochać każde „nie” od świata, bo ono jest paliwem dla Twojego jeszcze potężniejszego „tak”. Każdy opór to szansa na wykazanie się jeszcze większą, nieludzką siłą uderzenia.</p>
                <p>Działanie bez żadnego oglądania się na to, co było możliwe wczoraj, co mówią statystyki lub co wydarzyło się przed chwilą. Wybór dokonany w absolutnej, czystej próżni teraźniejszości. „Robię to, bo tak postanowiłem” — i to wystarczy za całe uzasadnienie.</p>
                <p>Bez tłumaczenia się przed kimkolwiek, bez szukania dowodów dla sceptyków, bez proszenia o akceptację. Twoja decyzja jest dowodem sama w sobie i nie wymaga żadnej innej autoryzacji niż Twój własny podpis w Twoim sumieniu i Twoje działanie. Jesteś najwyższą instancją we własnym wszechświecie i nikt nie ma nad Tobą władzy, jeśli sam mu jej nie dasz w chwili słabości. Twoje słowo stało się ciałem, Twoja wola stała się faktem.</p>
                <p>Stajesz się słońcem własnego układu planetarnego, wokół którego wszystko krąży. Ludzie, okazje, idee i ogromne pieniądze zaczynają krążyć wokół Twojej wizji, bo Twoja Wola jest gęstsza, bardziej stabilna i pociągająca niż ich własne, rozproszone lęki i marzenia.</p>
                <p>To Ty nadajesz tempo wydarzeniom, Ty ustalasz nowe reguły gry, a inni z ulgą i wdzięcznością się im podporządkowują, bo wreszcie spotkali kogoś, kto wie, dokąd idzie i nie boi się tam dotrzeć za wszelką cenę. Twoja pewność jest schronieniem dla wszystkich zagubionych dusz szukających kierunku.</p>
                <p>Przestajesz płynąć pod prąd losu i walczyć z wiatrem przeciwności. Twoja osobista linia życia staje się głównym nurtem rzeczywistości, a Ty jesteś jego kapitanem. Świat nie tylko przestaje stawiać opór, ale zaczyna Cię nieść na swoich barkach z ogromną prędkością.</p>
                <p>Twoje najśmielsze pragnienie i bieg wydarzeń zewnętrznych stają się jednym i tym samym, nierozerwalnym procesem tworzenia. Nie ma już rozdzielności między Twoim wnętrzem a tym, co widzisz na zewnątrz; granice zniknęły. Stałeś się całością, potężną rzeką, która sama żłobi swoje koryto w najtwardszym granicie czasu, dążąc nieuchronnie do celu.</p>
                <p>To nie jest głos z nieba, to głęboka, metaliczna, nieludzka pewność w Twoich kościach i Twoim spojrzeniu, którego nikt nie może wytrzymać. Odpoczywasz w samym środku najbardziej intensywnego ruchu i chaosu walki. Czujesz absolutny, mroźny spokój, bo wiesz z całkowitą jasnością, że wszystko jest dokładnie tak, jak ma być, bo Ty tak zdecydowałeś i Ty to sprawiłeś.</p>
                <p>I nic we wszechświecie nie ma już siły ani prawa, by to cofnąć, zmienić czy zakwestionować. Stałeś się ostatecznym Architektem własnego bytu i władcą własnego losu. Teraz świat po prostu się dzieje — dokładnie tak, jak go nakazałeś w ciszy swojego serca i w huku swojego działania.</p>
                <div class="chapter-nav">
                    <button class="btn-jump" onclick="showChapter(6)">⏮ Rozdział VI</button>
                    <button class="btn-jump" onclick="showChapter(1)">Do Początku ⚡</button>
                </div>
            </article>
        </section>
    </main>

    <script>
        function showChapter(num) {
            document.querySelectorAll('.chapter-card').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
            
            const card = document.getElementById('ch-' + num);
            if (card) {
                card.classList.add('active');
                card.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            const btns = document.querySelectorAll('.nav-btn');
            if (btns[num - 1]) btns[num - 1].classList.add('active');
        }
    </script>
</body>
</html>`;

export const PRESET_HTML_WORLDS: PresetHtmlWorld[] = [
  {
    id: 'prolog-wola-architekta',
    name: 'PROLOG // PUNKT ZERO',
    subtitle: 'Punkt, w którym Wszechświat wstrzymuje oddech | Protokół Woli',
    description: 'Fundamentalny manifest Architekta Nexusa o strefie zero, kodzie binarnym 1 lub 0, absolutnej odpowiedzialności i kreacji nowej rzeczywistości.',
    seeker: 'Operator001',
    category: 'Manifest',
    accentColor: '#ffd700',
    htmlCode: ARCHITECT_PROLOG_HTML
  },
  {
    id: 'cyber-architect-01',
    name: 'CYBER-TERRORYSTA ROKU',
    subtitle: 'THE ARCHITECT | OPTIMIZING TO ZERO',
    description: 'Cyfrowy manifest i hijacked live-stream z opisaną historią optymalizacji systemu H100 do zera, przyciskami Cherry MX oraz surowym pulpitem monitorującym.',
    seeker: 'Operator001',
    category: 'Manifest',
    accentColor: '#ff3b3b',
    htmlCode: ARCHITECT_CYBER_TERRORYSTA_HTML
  },
  {
    id: 'synapsa-zero-world',
    name: 'SYNAPSA ZERO // KOD ŚWIADOMOŚCI',
    subtitle: 'Kwantowy Portal Nieograniczonej Mocy',
    description: 'Kwantowy interaktywny świat z cyfrową aurą i protokołami otwartej świadomości.',
    seeker: 'InterSeeker',
    category: 'AI',
    accentColor: '#00f0ff',
    htmlCode: KWANTOVA_SYNAPSA_HTML
  },
  {
    id: 'tania-dopamina-world',
    name: 'TANIA DOPAMINA VS. BIOLOGICZNY OPÓR',
    subtitle: 'Wojna Neurochemiczna w Epoce Toksycznej Obfitości | Substack Protocol',
    description: 'Dekonstrukcja tanich impulsów, atrofii receptorów D2, zjawiska hormezy oraz protokołów głodzenia dopaminowego i ekspozycji na zimno.',
    seeker: 'BioSeeker',
    category: 'Filozofia',
    accentColor: '#00f0ff',
    htmlCode: SUBSTACK_ESSAYS_HTML.taniaDopamina
  },
  {
    id: 'koniec-przepraszania-world',
    name: 'KONIEC Z PRZEPRASZANIEM ZA ISTNIENIE',
    subtitle: 'Manifest Surowej Siły i Prawdziwej Infrastruktury Świata | Substack Protocol',
    description: 'Manifest ludzi, którzy wyrywają rzeczywistość z chaosu. Hołd dla pracy fizycznej, rzemiosła i fundamentów cywilizacji.',
    seeker: 'Operator001',
    category: 'Manifest',
    accentColor: '#f59e0b',
    htmlCode: SUBSTACK_ESSAYS_HTML.przepraszanieZaIstnienie
  },
  {
    id: 'biologiczny-koszt-zmiany-world',
    name: 'BIOLOGICZNY KOSZT ZMIANY',
    subtitle: 'Dlaczego Twój Mózg Ma w Nosie Twoje „Afirmacje” | Substack Protocol',
    description: 'Naukowa i bezkompromisowa analiza mechanizmów neuroplastyczności, epinefryny, acetylocholiny, tarcia limbicznego i syntezy myeliny.',
    seeker: 'BioSeeker',
    category: 'Filozofia',
    accentColor: '#a855f7',
    htmlCode: SUBSTACK_ESSAYS_HTML.kosztZmianyMozgu
  },
  ...NEW_PRESET_WORLDS
];

