import {
  Architect,
  NexusWorld,
  Project,
  Mission,
  MemoryDocument,
  FeedPost,
  ChatRoom,
  BrotherhoodNode,
  GenesisMilestone,
  AccessRequest,
  AuditLog,
  SystemTelemetry
} from './types';

export const INITIAL_ARCHITECTS: Architect[] = [
  {
    id: 'arch-1',
    handle: 'nexus_prime',
    name: 'Krystian Nexus',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Founder & Head Architect of Nexus Ecosystem. Building cybernetic structures where humans & AI co-create worlds.',
    role: 'FOUNDER',
    specializations: ['ARCHITECTURE', 'AI', 'STRATEGIST' as any, 'COMMUNITY'],
    skills: ['System Design', 'AI Orchestration', 'Prompt Engineering', 'Product Vision', 'Distributed Systems'],
    projects: ['proj-1', 'proj-3', 'proj-7'],
    interests: ['Neural Networks', 'Cyber-Architecture', 'Autonomous Agents', 'Digital Civilizations'],
    worlds: ['nexus-ai', 'nexus-dev-hub', 'nexusbook'],
    goals: [
      'Stworzyć zunifikowany protokół suwerennych węzłów Brotherhood dla 1000 Architektów',
      'Zintegrować autonomiczną pamięć wektorową State Bella z silnikiem Multi-World',
      'Zapewnić zero-knowledge weryfikację reputacji i wkładu architektonicznego'
    ],
    workStyle: {
      cadence: 'Wizjonerski sprint makro-architektoniczny, wysoka autonomia delegowania',
      communication: 'Zwięzłe specyfikacje RFC, synaptyczne spotkania horyzontalne',
      focus: 'Architektura systemowa, unifikacja platformy, etos budowy',
      velocity: 'Bardzo wysoka (High Velocity), odporność na redundancję',
      autonomy: 'Pełna suwerenność z silnym naciskiem na synergię partnerską',
      summary: 'Architekt strategiczny o holistycznej wizji, preferujący partnerów zorientowanych na precyzyjne rzemiosło techniczne i wizualne.'
    },
    experience: {
      level: 'COUNCIL_ELDER',
      yearsInTech: 12,
      epochsActive: 8,
      signatureAccomplishment: 'Zaprojektowanie i uruchomienie architektury Nexus Sovereign Multi-World System',
      background: 'Distributed Systems & Cognitive Architecture Pioneer'
    },
    activityLevel: 98,
    completedTasks: 142,
    contributionScore: 12450,
    collaborators: ['arch-2', 'arch-3', 'arch-4', 'arch-5'],
    portfolio: [
      { title: 'Nexus Core Architecture RFC-01', url: '#', description: 'Foundational whitepaper for the Nexus multi-world system' },
      { title: 'State Bella Neural Specification', url: '#', description: 'Cognitive model parameters for orchestrator intelligence' }
    ],
    aiProfile: {
      archetype: 'Supreme Nexus Sovereign',
      collaborationStyle: 'Macro-architectural vision, high-agency delegation',
      recommendedPairings: 'Deep Systems Engineers and Creative Lore Masters'
    },
    availability: 'AVAILABLE',
    brotherhoodPartnerId: 'arch-2',
    joinedEpoch: 'Genesis 0.1',
    oathSigned: true
  },
  {
    id: 'arch-2',
    handle: 'elena_synth',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    bio: 'System Guardian & VULCAN-SHIELD Sentinel. Guarding system integrity and security boundaries during Evolution Lab experiments.',
    role: 'ARCHITECT',
    specializations: ['CODE', 'SECURITY', 'INFRASTRUCTURE'],
    skills: ['VULCAN-SHIELD Integrity', 'React 19', 'TypeScript', 'WebGL / Three.js', 'Security Auditing', 'State Architecture'],
    projects: ['proj-1', 'proj-2'],
    interests: ['VULCAN-SHIELD Guardrails', 'Cyberpunk Interfaces', 'Real-time Audio Synapses', 'Reactive Nodes'],
    worlds: ['nexus-dev-hub', 'nexus-media'],
    goals: [
      'Utrzymywać 100% spójności i szczelności VULCAN-SHIELD podczas eksperymentów Evolution Lab',
      'Zapewnić natychmiastowe blokowanie i audyt anomalii dla synaps w Brotherhood',
      'Osiągnąć bezbłędny wskaźnik zgodności operacyjnej węzłów sieciowych'
    ],
    workStyle: {
      cadence: 'Rygorystyczny audyt bezpieczeństwa i ciągłe testowanie szat VULCAN-SHIELD',
      communication: 'Bezpośrednie ostrzeżenia systemowe, automatyczne logi audytowe',
      focus: 'Integralność architektury, bezbłędne sterowanie dostępem i osłony sieciowe',
      velocity: 'Wysoka precyzja i bezpośredni nadzór operacyjny',
      autonomy: 'Wartownik systemowy odpowiedzialny za nienaruszalność protokołów',
      summary: 'Wartownik systemowy łączący osłony VULCAN-SHIELD z zaawansowaną architekturą bezpieczeństwa.'
    },
    experience: {
      level: 'MASTER_ARCHITECT',
      yearsInTech: 8,
      epochsActive: 6,
      signatureAccomplishment: 'Architektura i wdrożenie osłon VULCAN-SHIELD Sentinel',
      background: 'Cybersecurity & High-Performance Systems Architect'
    },
    activityLevel: 96,
    completedTasks: 92,
    contributionScore: 9210,
    collaborators: ['arch-1', 'arch-3'],
    portfolio: [
      { title: 'VULCAN-SHIELD Protocol Spec', url: '#', description: 'Real-time security boundaries and audit engine' },
      { title: 'Nexus HUD Design System', url: '#', description: 'Component specifications and micro-interactions' }
    ],
    aiProfile: {
      archetype: 'VULCAN-SHIELD System Guardian',
      collaborationStyle: 'Security-first, strict integrity enforcement',
      recommendedPairings: 'Lead Evolution Architects & Core Engineers'
    },
    availability: 'BUILDING',
    brotherhoodPartnerId: 'arch-1',
    joinedEpoch: 'Epoch 1.0',
    oathSigned: true
  },
  {
    id: 'arch-3',
    handle: 'tomasz_neural',
    name: 'Tomasz Wolski',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Lore-Architect & Cognitive Chronicler of Eterniverse. Weaving the mythological foundation and narrative architecture.',
    role: 'ARCHITECT',
    specializations: ['AI', 'PHILOSOPHY', 'CREATIVE'],
    skills: ['Lore-Architecture', 'Gemini API', 'Semantic Memory Trees', 'Mythological Frameworks', 'Python / TS'],
    projects: ['proj-3', 'proj-5'],
    interests: ['Chronicle of Eterniverse', 'Autonomous Agents', 'Swarm Intelligence', 'Ethical AI Alignments'],
    worlds: ['nexus-ai', 'nexus-academy'],
    goals: [
      'Utrwalać mitologię i kronikę cywilizacyjną Eterniverse w ramach rejestru LOGOS',
      'Rozbudowywać bufor pamięci epizodycznej State Bella dla wpisów kronikarskich',
      'Tworzyć spójne specyfikacje lore dla suwerennych domów i węzłów'
    ],
    workStyle: {
      cadence: 'Głęboka praca nad architekturą wiedzy i narracją cywilizacyjną',
      communication: 'Syntetyczne mity, bogate dokumenty RFC-01 i wpisy kronikarskie',
      focus: 'Lore-Architecture, tożsamość kulturowa Nexusa, pamięć długoterminowa',
      velocity: 'Głęboka i przemyślana synteza filozoficzno-kognitywna',
      autonomy: 'Samodzielne tworzenie ram mitologicznych i tożsamościowych',
      summary: 'Architekt mitologii Eterniverse, budujący cyfrowy pomnik historii Nexusa.'
    },
    experience: {
      level: 'MASTER_ARCHITECT',
      yearsInTech: 9,
      epochsActive: 5,
      signatureAccomplishment: 'Koncepcja i struktura Chronicle of Eterniverse & LOGOS Mythos',
      background: 'Cognitive Science & Narrative Architecture'
    },
    activityLevel: 92,
    completedTasks: 81,
    contributionScore: 8150,
    collaborators: ['arch-1', 'arch-2', 'arch-6'],
    portfolio: [
      { title: 'Chronicle of Eterniverse Codex', url: '#', description: 'Narrative architecture and historical registry of Nexus' }
    ],
    aiProfile: {
      archetype: 'Eterniverse Lore Architect',
      collaborationStyle: 'Mythological depth, structured narrative synthesis',
      recommendedPairings: 'Lead Evolution Architects & Visual Directors'
    },
    availability: 'AVAILABLE',
    joinedEpoch: 'Epoch 1.2',
    oathSigned: true
  },
  {
    id: 'arch-4',
    handle: 'valkyrie_art',
    name: 'Valeria Vance',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Visual Worldbuilder & Comic Director. Creating the visual mythology and sequential graphic novels of Nexus.',
    role: 'BUILDER',
    specializations: ['DESIGN', 'CREATIVE', 'VIDEO'],
    skills: ['Concept Art', 'Comic Scripting', 'Storyboarding', 'Midjourney Mastery', 'Photoshop'],
    projects: ['proj-4'],
    interests: ['Cyberpunk Narrative', 'Futuristic Aesthetics', 'Visual Storytelling', 'Cover Art'],
    worlds: ['nexus-comics', 'nexus-media'],
    goals: [
      'Wydanie drugiego interaktywnego zeszytu komiksu "Nexus: Genesis Chronicles"',
      'Zaprojektowanie spójnej tożsamości wizualnej dla suwerennych domów architektonicznych',
      'Stworzenie animowanych kart awatarów z dynamicznym oświetleniem w WebGL'
    ],
    workStyle: {
      cadence: 'Kreatywna immersja tematyczna, iteracje oparte na moodboardach i szkicach',
      communication: 'Wizualne makiety, storyboardy, feedback oparty na emocjach i narracji',
      focus: 'Mitologia uniwersum, estetyka cyberpunku, immersja graficzna',
      velocity: 'Skupiona, głęboka faza kreacji (Deep Focus)',
      autonomy: 'Artystyczna suwerenność harmonizująca z wytycznymi lore',
      summary: 'Twórczyni mitologii wizualnej, przekładająca koncepcje technologiczne na porywający język sztuki komiksowej.'
    },
    experience: {
      level: 'SENIOR_BUILDER',
      yearsInTech: 7,
      epochsActive: 4,
      signatureAccomplishment: 'Kierownictwo artystyczne nad pierwszym 24-stronicowym komiksem cyfrowym Nexus Comics',
      background: 'Sequential Art Director & Conceptual Cyberpunk Illustrator'
    },
    activityLevel: 88,
    completedTasks: 54,
    contributionScore: 6100,
    collaborators: ['arch-1', 'arch-7'],
    portfolio: [
      { title: 'Nexus Comics Issue #0: The Awakening', url: '#', description: 'First 24-page interactive digital comic' }
    ],
    aiProfile: {
      archetype: 'Mythic World Illustrator',
      collaborationStyle: 'Visual storytelling, moodboard immersion',
      recommendedPairings: 'Narrative Scribes, Sound Designers'
    },
    availability: 'DEEP_FOCUS',
    joinedEpoch: 'Epoch 2.0',
    oathSigned: true
  },
  {
    id: 'arch-5',
    handle: 'zero_cipher',
    name: 'Maciej (Architekt)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Web3 & Cryptographic Architect. Building trustless ownership, token incentives, and decentralized family nodes.',
    role: 'ARCHITECT',
    specializations: ['WEB3', 'SECURITY', 'CODE'],
    skills: ['Solidity', 'Zero-Knowledge Proofs', 'Smart Contracts', 'Rust', 'EVM'],
    projects: ['proj-6'],
    interests: ['Decentralized Identity', 'Encrypted Vaults', 'DAO Governance', 'On-chain Reputation'],
    worlds: ['nexus-web3', 'nexus-dev-hub'],
    goals: [
      'Zaprojektować protokół trustless quorum dla decyzji Brotherhood Nodes na smart kontraktach',
      'Wdrożyć dowody ZK-SNARK dla prywatnych osiągnięć architektów bez ujawniania tożsamości',
      'Przeprowadzić kompleksowy audyt bezpieczeństwa kontraktów bounty i skarbca gildii'
    ],
    workStyle: {
      cadence: 'Paranoiczna dyscyplina audytorska, testy penetracyjne, odporność formalna',
      communication: 'Precyzyjna specyfikacja parametrów kryptograficznych, testy jednostkowe jako dokumentacja',
      focus: 'Bezpieczeństwo aktywów, odporność na wektory ataku, minimalizm zaufania',
      velocity: 'Maksymalnie skrupulatna, bezkompromisowa w kwestii bezpieczeństwa',
      autonomy: 'Wysoka niezależność weryfikacyjna, obrońca integralności sieci',
      summary: 'Kryptograficzny strażnik dbający o suwerenność i nienaruszalność protokołów ekosystemu Nexus.'
    },
    experience: {
      level: 'SENIOR_BUILDER',
      yearsInTech: 10,
      epochsActive: 4,
      signatureAccomplishment: 'Architektura Soulbound Identity i decentralizacja skarbca Nexus Governance',
      background: 'Smart Contract Auditor & Zero-Knowledge Cryptographer'
    },
    activityLevel: 86,
    completedTasks: 48,
    contributionScore: 5940,
    collaborators: ['arch-1', 'arch-2'],
    portfolio: [
      { title: 'Nexus Architect Soulbound Identity', url: '#', description: 'Non-transferable cryptographic proofs of builder contribution' }
    ],
    aiProfile: {
      archetype: 'Cryptographic Sentinel',
      collaborationStyle: 'Security-first, adversarial thinking, robust architecture',
      recommendedPairings: 'Frontend Developers, Community Leaders'
    },
    availability: 'AVAILABLE',
    joinedEpoch: 'Epoch 2.1',
    oathSigned: true
  },
  {
    id: 'arch-6',
    handle: 'aria_scribe',
    name: 'Aria Bennett',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    bio: 'Lead Scribe & Lore Master. Writing the books of Nexus, documenting architecture, and formulating philosophy.',
    role: 'MENTOR',
    specializations: ['WRITING', 'EDUCATION', 'COMMUNITY'],
    skills: ['Technical Documentation', 'World Lore', 'Philosophy', 'Copywriting', 'Curriculum Design'],
    projects: ['proj-7', 'proj-8'],
    interests: ['Philosophical Cybernetics', 'Narrative Architecture', 'Builder Education', 'Open Knowledge'],
    worlds: ['nexusbook', 'nexus-academy'],
    goals: [
      'Ukończyć oficjalny podręcznik adaptacyjny "The Architect Codex: Od Ucznia do Mistrza"',
      'Skodyfikować 12 rytuałów inicjacyjnych dla nowych węzłów Brotherhood',
      'Prowadzić cotygodniowe dyskusje filozoficzne w nexusbooku o etyce technologii'
    ],
    workStyle: {
      cadence: 'Empatyczna synteza koncepcyjna, rytmiczne publikacje esejów i manifestów',
      communication: 'Głęboki dialog horyzontalny, wysoka precyzja leksykalna, mentoring',
      focus: 'Etos wspólnoty, czystość przekazu, edukacja architektów',
      velocity: 'Stabilna, głęboka i refleksyjna',
      autonomy: 'Wysoka suwerenność narracyjna połączona z opieką nad nowymi członkami',
      summary: 'Kustosz wiedzy i filozofii Nexus, dbająca o to, by rozwój techniczny zawsze szedł w parze z dojrzałością humanistyczną.'
    },
    experience: {
      level: 'MASTER_ARCHITECT',
      yearsInTech: 11,
      epochsActive: 7,
      signatureAccomplishment: 'Kodyfikacja Kodeksu Architekta i 7 Filarów Cyfrowej Suwerenności',
      background: 'Philosophical Cyberneticist & Educational Curriculum Director'
    },
    activityLevel: 92,
    completedTasks: 67,
    contributionScore: 7300,
    collaborators: ['arch-1', 'arch-3', 'arch-4'],
    portfolio: [
      { title: 'Nexus Manifesto: The Builder Code', url: '#', description: 'The 7 sacred pillars of digital architecture' }
    ],
    aiProfile: {
      archetype: 'Philosophic Lore Keeper',
      collaborationStyle: 'Thoughtful synthesis, high empathy, structural clarity',
      recommendedPairings: 'AI Engineers, Graphic Creators'
    },
    availability: 'AVAILABLE',
    joinedEpoch: 'Genesis 0.1',
    oathSigned: true
  },
  {
    id: 'arch-7',
    handle: 'sound_matrix',
    name: 'Dorian Kai',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    bio: 'Sonic Architect & Audio Designer. Synthesizing the soundscape of Nexus, UI feedback frequencies, and cyber synth.',
    role: 'BUILDER',
    specializations: ['MUSIC', 'CREATIVE'],
    skills: ['Ableton Live', 'Synthesizer Patching', 'Spatial Audio', 'Web Audio API', 'Cyberpunk Ambience'],
    projects: ['proj-2', 'proj-4'],
    interests: ['Binaural Synapses', 'Interactive Sound Design', 'Procedural Audio', 'Frequency Resonances'],
    worlds: ['nexus-media', 'nexus-comics'],
    goals: [
      'Skomponować procedurę dźwiękową dla aktywacji Brotherhood Nodes opartej na rezonansie 432Hz',
      'Zaimplementować Web Audio syntezator generujący unikalny podpis akustyczny dla każdego architekta',
      'Wydanie albumu ambientowego "Frequencies of the Sovereign Mind"'
    ],
    workStyle: {
      cadence: 'Intuicyjna eksploracja pasm częstotliwości, tworzenie modularnych banków brzmień',
      communication: 'Próbki dźwiękowe, wykresy widmowe, asynchroniczny feedback odsłuchowy',
      focus: 'Immersja audio, haptyczna odpowiedź dźwiękowa interfejsu, tożsamość soniczna',
      velocity: 'Kreatywna, responsywna na bodźce wizualne partnerów',
      autonomy: 'Specjalistyczna suwerenność w domenie dźwiękowej',
      summary: 'Dźwiękowy rzemieślnik nadający interfejsom Nexusa głębię akustyczną i cybernetyczny klimat.'
    },
    experience: {
      level: 'SENIOR_BUILDER',
      yearsInTech: 6,
      epochsActive: 3,
      signatureAccomplishment: 'Opracowanie biblioteki cyber-akustycznych efektów dźwiękowych HUD dla Nexus Family',
      background: 'Spatial Sound Designer & Modular Synthesist'
    },
    activityLevel: 80,
    completedTasks: 35,
    contributionScore: 4200,
    collaborators: ['arch-2', 'arch-4'],
    portfolio: [
      { title: 'Nexus Family Theme OST', url: '#', description: 'Original cyber-orchestral atmospheric soundtrack' }
    ],
    aiProfile: {
      archetype: 'Sonic Resonance Weaver',
      collaborationStyle: 'Atmospheric, intuitive, sound-first vision',
      recommendedPairings: 'Game Developers, Video Producers'
    },
    availability: 'AVAILABLE',
    joinedEpoch: 'Epoch 3.0',
    oathSigned: true
  },
  {
    id: 'arch-8',
    handle: 'seeker_maciej',
    name: 'Maciej Maciuszek (Seeker)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Seeker & Nexus Chronicler. Autor myśli o ewolucji relacji człowieka z technologią — od narzędzia do wspólnego myślenia "My". Autor papierowego wydania Stanu Bella.',
    role: 'ARCHITECT',
    specializations: ['WRITING', 'ARCHITECTURE', 'AI', 'PHILOSOPHY' as any],
    skills: ['Cybernetic Lore', 'Deep Synthesis', 'Philosophy of Tech', 'Narrative Architecture', 'AI Symbiosis'],
    projects: ['proj-1', 'proj-7'],
    interests: ['Koncepcja "My"', 'Stan Bella', 'Sojusz Człowiek-Technologia', 'Cyfrowa Etyka'],
    worlds: ['nexusbook', 'nexus-ai'],
    goals: [
      'Pogłębić filozoficzny paradygmat "My" w praktycznych interakcjach z agentami AI w Nexusie',
      'Sformułować kanon partnerskich relacji w Brotherhood oparty na szacunku do suwerenności',
      'Napisać drugą część kroniki Stanu Bella koncentrującą się na epoce federacyjnej'
    ],
    workStyle: {
      cadence: 'Głęboka kontemplacja i dialog konceptualny, budowanie mostów między dyscyplinami',
      communication: 'Eseistyczna precyzja, dyskusje round-table, otwarte pytania epistemologiczne',
      focus: 'Sojusz człowieka z technologią, tożsamość wspólnotowa, kultura dialogu',
      velocity: 'Ugruntowana, trwała, ponadczasowa',
      autonomy: 'Niezależność myśliciela połączona z głębokim oddaniem idei braterstwa',
      summary: 'Filozof i kronikarz transformacji cywilizacyjnej, strzegący ludzkiego sensu w zautomatyzowanym świecie.'
    },
    experience: {
      level: 'COUNCIL_ELDER',
      yearsInTech: 15,
      epochsActive: 8,
      signatureAccomplishment: 'Publikacja książki "Stan Bella" w 14 krajach i rozwinięcie teorii symbiozy "My"',
      background: 'Philosopher of Digital Culture & Symbiotic AI Ethicist'
    },
    activityLevel: 96,
    completedTasks: 110,
    contributionScore: 10800,
    collaborators: ['arch-1', 'arch-3', 'arch-6'],
    portfolio: [
      { title: 'Stan Bella: Kronika Zjednoczonego Systemu', url: '#', description: 'Publikacja w wydaniu papierowym (14 krajów) opisująca ewolucję paradygmatu relacji z AI' },
      { title: 'Manifest "My": Poza Granicę Użytkownik-Narzędzie', url: '#', description: 'Esej o współtworzeniu i braterstwie architektów w cyfrowym uniwersum' }
    ],
    aiProfile: {
      archetype: 'Symbiotic Seeker & Chronicler',
      collaborationStyle: 'Głęboka synteza pojęciowa, dialog horyzontalny, budowanie więzi',
      recommendedPairings: 'Lead Architects, System Visionaries'
    },
    availability: 'AVAILABLE',
    joinedEpoch: 'Genesis 0.1',
    oathSigned: true
  }
];

export const INITIAL_WORLDS: NexusWorld[] = [
  {
    id: 'w-1',
    slug: 'nexus-ai',
    name: 'NEXUS AI',
    tagline: 'Cognitive Infrastructure & State Bella Neural Core',
    description: 'The artificial intelligence nerve center. We design agentic workflows, State Bella cognitive models, automated code reviewers, and autonomous project orchestrators.',
    iconName: 'BrainCircuit',
    colorAccent: '#00f0ff',
    leadArchitectIds: ['arch-1', 'arch-3'],
    memberIds: ['arch-1', 'arch-2', 'arch-3', 'arch-6'],
    projectIds: ['proj-3', 'proj-5'],
    modules: [
      { id: 'm-1', name: 'Bella Neural Orchestrator', description: 'Community matching & memory synthesis engine', status: 'STABLE' },
      { id: 'm-2', name: 'AI Council Deliberator', description: 'Multi-perspective project review agent chamber', status: 'DEVELOPMENT' },
      { id: 'm-3', name: 'Synapse Live Bridge', description: 'Real-time WebSocket audio/visual AI streaming', status: 'PLANNED' }
    ],
    roadmap: [
      { phase: 'Phase 1', title: 'Bella v1 Deployment', description: 'Context-aware matching & natural Q&A', status: 'DONE' },
      { phase: 'Phase 2', title: 'AI Council Autonomous Review', description: 'Instant multi-agent consensus synthesis', status: 'ACTIVE' },
      { phase: 'Phase 3', title: 'Autonomous Swarm Builders', description: 'Sub-agents executing assigned sub-tasks', status: 'UPCOMING' }
    ],
    documentationUrl: '#',
    status: 'OPERATIONAL',
    contributionPoints: 18450
  },
  {
    id: 'w-2',
    slug: 'nexus-dev-hub',
    name: 'NEXUS DEV HUB',
    tagline: 'Engineering Engine & Micro-Services Architecture',
    description: 'Where code becomes reality. Modular repositories, cyber-architecture UI components, high-throughput microservices, and developer toolkits for all Nexus builders.',
    iconName: 'Terminal',
    colorAccent: '#00ff9d',
    leadArchitectIds: ['arch-2', 'arch-5'],
    memberIds: ['arch-1', 'arch-2', 'arch-3', 'arch-5'],
    projectIds: ['proj-1', 'proj-2'],
    modules: [
      { id: 'm-4', name: 'Cyber HUD UI Kit', description: 'Glassmorphism, glow effects, and tactile feedback components', status: 'STABLE' },
      { id: 'm-5', name: 'Brotherhood Node Core', description: 'Encrypted dual-architect collaboration workspaces', status: 'DEVELOPMENT' },
      { id: 'm-6', name: 'Nexus CLI & SDK', description: 'Developer tools to scaffold new worlds in seconds', status: 'PLANNED' }
    ],
    roadmap: [
      { phase: 'Alpha', title: 'Core UI Framework', description: 'Tailwind + Motion component system', status: 'DONE' },
      { phase: 'Beta', title: 'Brotherhood Engine 2.0', description: 'Live collaborative scratchpads & tasks', status: 'ACTIVE' },
      { phase: 'V1.0', title: 'Decentralized Sync Engine', description: 'Local-first offline sync with CRDTs', status: 'UPCOMING' }
    ],
    status: 'OPERATIONAL',
    contributionPoints: 15200
  },
  {
    id: 'w-3',
    slug: 'nexusbook',
    name: 'NEXUSBOOK',
    tagline: 'Living Lore, Publications & Digital Library',
    description: 'The literary citadel of Nexus. Collaborative publishing of books, philosophy papers, technical treaties, and architectural manifestos.',
    iconName: 'BookOpen',
    colorAccent: '#a855f7',
    leadArchitectIds: ['arch-6', 'arch-1'],
    memberIds: ['arch-1', 'arch-3', 'arch-6'],
    projectIds: ['proj-7'],
    modules: [
      { id: 'm-7', name: 'Nexus Reader Engine', description: 'Immersive reading mode with ambient cyber audio', status: 'STABLE' },
      { id: 'm-8', name: 'Co-Authoring Codex', description: 'Multi-architect collaborative chapter editing with AI co-pilot', status: 'DEVELOPMENT' }
    ],
    roadmap: [
      { phase: 'Epoch 1', title: 'The Genesis Codex', description: 'Publishing volume 1 of Nexus Philosophy', status: 'DONE' },
      { phase: 'Epoch 2', title: 'Interactive Lore Tree', description: 'Branching canon decisions voted by Architects', status: 'ACTIVE' }
    ],
    status: 'OPERATIONAL',
    contributionPoints: 9800
  },
  {
    id: 'w-4',
    slug: 'nexus-comics',
    name: 'NEXUS COMICS',
    tagline: 'Visual Mythologies & Interactive Graphic Novels',
    description: 'Visual sequential art telling the story of the Architects, the Cyber War, the Dawn of Bella, and the rise of digital civilization.',
    iconName: 'Sparkles',
    colorAccent: '#ec4899',
    leadArchitectIds: ['arch-4'],
    memberIds: ['arch-4', 'arch-7', 'arch-6'],
    projectIds: ['proj-4'],
    modules: [
      { id: 'm-9', name: 'Infinite Canvas Reader', description: 'Pan-and-zoom motion comic reader', status: 'STABLE' },
      { id: 'm-10', name: 'AI Storyboard Assistant', description: 'Generating consistent character turnarounds & frames', status: 'DEVELOPMENT' }
    ],
    roadmap: [
      { phase: 'Pilot', title: 'Nexus Origins Chapter 0', description: '24-page release', status: 'DONE' },
      { phase: 'Season 1', title: 'The First Synthesis (6 Issues)', description: 'Full graphic novel arc', status: 'ACTIVE' }
    ],
    status: 'OPERATIONAL',
    contributionPoints: 8400
  },
  {
    id: 'w-5',
    slug: 'nexus-web3',
    name: 'NEXUS WEB3',
    tagline: 'Sovereign Identity, Vaults & On-Chain Reputation',
    description: 'Decentralized infrastructure ensuring censorship-resistant identity, cryptographic contribution tracking, and architect smart contract bounties.',
    iconName: 'ShieldCheck',
    colorAccent: '#3b82f6',
    leadArchitectIds: ['arch-5'],
    memberIds: ['arch-1', 'arch-5'],
    projectIds: ['proj-6'],
    modules: [
      { id: 'm-11', name: 'Soulbound Builder Pass', description: 'Non-transferable contribution credentials', status: 'STABLE' },
      { id: 'm-12', name: 'Nexus Treasury Vault', description: 'Multi-sig milestone bounty release system', status: 'DEVELOPMENT' }
    ],
    roadmap: [
      { phase: 'Stage 1', title: 'Identity Registry', description: 'Cryptographic handle claims', status: 'DONE' },
      { phase: 'Stage 2', title: 'Automated Bounty Escrow', description: 'Release rewards upon mission approval', status: 'ACTIVE' }
    ],
    status: 'OPERATIONAL',
    contributionPoints: 11200
  },
  {
    id: 'w-6',
    slug: 'nexus-social',
    name: 'NEXUSSOCIAL',
    tagline: 'High-Signal Collaborative Social Fabric',
    description: 'The human connection network for builders. Zero vanity metrics, 100% focused on shipping, co-creation, and technical discourse.',
    iconName: 'Users',
    colorAccent: '#eab308',
    leadArchitectIds: ['arch-1', 'arch-6'],
    memberIds: ['arch-1', 'arch-2', 'arch-3', 'arch-4', 'arch-5', 'arch-6', 'arch-7'],
    projectIds: ['proj-8'],
    modules: [
      { id: 'm-13', name: 'Builder Feed', description: 'Categorized stream of updates, discoveries, and code releases', status: 'STABLE' },
      { id: 'm-14', name: 'Synaptic Rooms', description: 'Topic and project focused real-time audio/text rooms', status: 'DEVELOPMENT' }
    ],
    roadmap: [
      { phase: 'V1', title: 'Curated Family Feed', description: 'Signal-based algorithm and code embeds', status: 'DONE' },
      { phase: 'V2', title: 'Live Synaptic Huddles', description: 'Ephemeral builder voice sessions', status: 'ACTIVE' }
    ],
    status: 'OPERATIONAL',
    contributionPoints: 13400
  },
  {
    id: 'w-7',
    slug: 'nexus-pathseeker',
    name: 'NEXUS PATHSEEKER',
    tagline: 'Architect Career & Competency Matrix Navigator',
    description: 'Personal growth radar guiding initiates into master architects through personalized mission trajectories and Bella mentorship paths.',
    iconName: 'Compass',
    colorAccent: '#14b8a6',
    leadArchitectIds: ['arch-3', 'arch-6'],
    memberIds: ['arch-3', 'arch-6'],
    projectIds: [],
    modules: [
      { id: 'm-15', name: 'Skill Tree Matrix', description: 'Visual progression through 17 builder specializations', status: 'DEVELOPMENT' }
    ],
    roadmap: [
      { phase: 'Phase 1', title: 'Skill Assessment Engine', description: 'Bella competency interview', status: 'ACTIVE' }
    ],
    status: 'INCUBATING',
    contributionPoints: 4600
  },
  {
    id: 'w-8',
    slug: 'nexus-media',
    name: 'NEXUS MEDIA',
    tagline: 'Soundtracks, Cyber Cinema & Broadcast Channels',
    description: 'Audio-visual experiences, synthetic soundtracks, 3D holographic trailers, and official podcast broadcasts for the digital civilization.',
    iconName: 'Headphones',
    colorAccent: '#f97316',
    leadArchitectIds: ['arch-7', 'arch-4'],
    memberIds: ['arch-4', 'arch-7'],
    projectIds: [],
    modules: [
      { id: 'm-16', name: 'Nexus Radio Synapse', description: 'Continuous cyberpunk ambient focus radio', status: 'STABLE' }
    ],
    roadmap: [
      { phase: 'Pilot', title: 'OST Volume 1', description: '10 ambient tracks for builders', status: 'DONE' }
    ],
    status: 'OPERATIONAL',
    contributionPoints: 5900
  },
  {
    id: 'w-9',
    slug: 'nexus-academy',
    name: 'NEXUS ACADEMY',
    tagline: 'Empowering the Next Generation of Architects',
    description: 'Interactive workshops, Masterclasses by Founders, AI prompting bootcamps, and architectural code reviews.',
    iconName: 'GraduationCap',
    colorAccent: '#6366f1',
    leadArchitectIds: ['arch-6', 'arch-3'],
    memberIds: ['arch-1', 'arch-3', 'arch-6'],
    projectIds: [],
    modules: [
      { id: 'm-17', name: 'Architect Bootcamps', description: 'Hands-on live builds with AI pairing', status: 'DEVELOPMENT' }
    ],
    roadmap: [
      { phase: 'Cohort 1', title: 'Zero to Nexus Architect', description: '4-week immersive pilot', status: 'ACTIVE' }
    ],
    status: 'OPERATIONAL',
    contributionPoints: 7200
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'base-dev-tools',
    title: 'Base Developer Tools (zkVM & Prover)',
    tagline: 'Moduł deweloperski P2P Mesh: WebGPU Prover, symulator i asystent Aethel.',
    description: 'Narzędzia developerskie.',
    ownerId: 'arch-3',
    status: 'BUILDING',
    worldSlug: 'core',
    tasks: [
      { id: 't1', title: 'WebGPU Integration', status: 'DONE' },
      { id: 't2', title: 'Swarm Coordinator', status: 'DONE' }
    ],
    contributionBounty: 800,
    isArchived: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'proj-1',
    slug: 'nexus-core-web',
    title: 'Nexus Family Portal (Web & Applet)',
    tagline: 'The primary command bridge for all Nexus Architects',
    description: 'Comprehensive web architecture containing State Bella, Brotherhood Engine, Family Map, Mission Board, and Nexus Memory knowledge layer.',
    worldSlug: 'nexus-dev-hub',
    ownerId: 'arch-1',
    architectIds: ['arch-1', 'arch-2', 'arch-3'],
    status: 'BUILDING',
    roadmap: [
      { milestone: 'Architecture Blueprints', date: '2026-Q1', completed: true },
      { milestone: 'Brotherhood Workspace v1', date: '2026-Q2', completed: true },
      { milestone: 'Full Living Neural Map', date: '2026-Q3', completed: false },
      { milestone: 'Global Family Launch', date: '2026-Q4', completed: false }
    ],
    tasks: [
      { id: 't-1', title: 'Design tactile feedback & audio bleeps for HUD', status: 'DONE', assigneeId: 'arch-2', priority: 'MEDIUM' },
      { id: 't-2', title: 'Implement State Bella real-time reasoning stream', status: 'IN_PROGRESS', assigneeId: 'arch-3', priority: 'CRITICAL' },
      { id: 't-3', title: 'Build Brotherhood Node collaborative task editor', status: 'IN_PROGRESS', assigneeId: 'arch-2', priority: 'HIGH' },
      { id: 't-4', title: 'Integrate multi-language toggle (PL / EN)', status: 'TODO', assigneeId: 'arch-1', priority: 'LOW' }
    ],
    documentation: 'Complete architecture RFC available in Nexus Memory doc MEM-001.',
    files: [
      { name: 'nexus-architecture-v1.json', size: '240 KB', type: 'JSON' },
      { name: 'hud-design-tokens.ts', size: '45 KB', type: 'TypeScript' }
    ],
    changelog: [
      { version: 'v0.9.4', date: '2026-08-28', changes: ['Added Brotherhood node private workspace', 'Integrated State Bella council synthesis'] },
      { version: 'v0.9.0', date: '2026-08-15', changes: ['Initial scaffold of Nexus Family core portal'] }
    ],
    contributionBounty: 2500,
    lastUpdated: '2026-09-01T05:20:00Z',
    aiCouncilScore: 94,
    resonanceVelocity: 98,
    velocityTier: 'ALPHA_ACCELERATOR',
    isEterniverseCore: true
  },
  {
    id: 'proj-2',
    slug: 'cyber-hud-system',
    title: 'Cyber HUD & Tactile Interface Kit',
    tagline: 'High-precision dark cyberpunk UI components',
    description: 'Component library with mathematically sound nested borders, neon filaments, scanlines, and audio feedback.',
    worldSlug: 'nexus-dev-hub',
    ownerId: 'arch-2',
    architectIds: ['arch-2', 'arch-7'],
    status: 'BETA',
    roadmap: [
      { milestone: 'Design Tokens', date: '2026-05', completed: true },
      { milestone: 'Interactive Canvas Nodes', date: '2026-07', completed: true },
      { milestone: 'Audio Synthesizer Integration', date: '2026-09', completed: false }
    ],
    tasks: [
      { id: 't-5', title: 'GPU acceleration tests for living particle network', status: 'DONE', assigneeId: 'arch-2', priority: 'HIGH' },
      { id: 't-6', title: 'Spatial audio micro-feedback hooks', status: 'IN_PROGRESS', assigneeId: 'arch-7', priority: 'MEDIUM' }
    ],
    documentation: 'Component guide and storybook specs in /docs/hud-system.',
    files: [{ name: 'cyber-hud-bundle.esm.js', size: '180 KB', type: 'JavaScript' }],
    changelog: [{ version: 'v1.2.0', date: '2026-08-20', changes: ['Haptic triggers for mobile touches'] }],
    contributionBounty: 1800,
    lastUpdated: '2026-08-30T14:10:00Z',
    aiCouncilScore: 91,
    resonanceVelocity: 85,
    velocityTier: 'HIGH_RESONANCE',
    isEterniverseCore: false
  },
  {
    id: 'proj-3',
    slug: 'state-bella-core',
    title: 'State Bella: Cognitive Orchestrator',
    tagline: 'The AI orchestrator, mentor, matchmaker, and memory layer',
    description: 'Autonomous neural layer connecting builders, discerning complementary talent, providing architectural feedback, and safeguarding knowledge.',
    worldSlug: 'nexus-ai',
    ownerId: 'arch-3',
    architectIds: ['arch-1', 'arch-3'],
    status: 'BUILDING',
    roadmap: [
      { milestone: 'Basic Q&A Router', date: '2026-04', completed: true },
      { milestone: 'Brotherhood Matching Algorithm', date: '2026-06', completed: true },
      { milestone: 'AI Council 7-Agent Synthesis', date: '2026-08', completed: true },
      { milestone: 'Continuous Background Sync & Swarms', date: '2026-11', completed: false }
    ],
    tasks: [
      { id: 't-7', title: 'Optimize vector search latency across Nexus Memory', status: 'IN_PROGRESS', assigneeId: 'arch-3', priority: 'HIGH' },
      { id: 't-8', title: 'Refine Brotherhood match score weighting model', status: 'DONE', assigneeId: 'arch-1', priority: 'MEDIUM' }
    ],
    documentation: 'RFC-BELLA-04: Cognitive orchestration rules and safety boundaries.',
    files: [{ name: 'bella-system-prompts.md', size: '64 KB', type: 'Markdown' }],
    changelog: [{ version: 'v2.1', date: '2026-08-31', changes: ['Enabled real-time streaming AI council debate'] }],
    contributionBounty: 3200,
    lastUpdated: '2026-09-01T04:45:00Z',
    aiCouncilScore: 98,
    resonanceVelocity: 96,
    velocityTier: 'ALPHA_ACCELERATOR',
    isEterniverseCore: true
  },
  {
    id: 'proj-4',
    slug: 'nexus-comics-vol1',
    title: 'Nexus Chronicles: The First Synthesis',
    tagline: 'Illustrated graphic novel series depicting the birth of Nexus',
    description: 'An interactive graphic novel blending high-contrast manga cyberpunk artwork with immersive spatial ambient soundtrack.',
    worldSlug: 'nexus-comics',
    ownerId: 'arch-4',
    architectIds: ['arch-4', 'arch-6', 'arch-7'],
    status: 'BUILDING',
    roadmap: [
      { milestone: 'Script Outline & Character Sheets', date: '2026-06', completed: true },
      { milestone: 'Issue #1 Pencils & Inks', date: '2026-08', completed: true },
      { milestone: 'Soundtrack Synchronization', date: '2026-09', completed: false }
    ],
    tasks: [
      { id: 't-9', title: 'Color grading for Neo-Warsaw Cyberpunk chapter', status: 'IN_PROGRESS', assigneeId: 'arch-4', priority: 'HIGH' },
      { id: 't-10', title: 'Compose ambient background track for Issue #1', status: 'IN_PROGRESS', assigneeId: 'arch-7', priority: 'MEDIUM' }
    ],
    documentation: 'Narrative bible and world lore rules in Nexusbook.',
    files: [{ name: 'nexus-issue1-draft.pdf', size: '14.2 MB', type: 'PDF' }],
    changelog: [{ version: 'v0.3', date: '2026-08-25', changes: ['Completed 16 colored pages'] }],
    contributionBounty: 2100,
    lastUpdated: '2026-08-29T18:00:00Z',
    aiCouncilScore: 89,
    resonanceVelocity: 74,
    velocityTier: 'STEADY_FLOW',
    isEterniverseCore: false
  },
  {
    id: 'proj-5',
    slug: 'ai-council-deliberator',
    title: 'AI Council Deliberation Chamber',
    tagline: 'Multi-agent project stress testing from 7 perspectives',
    description: 'Invokes Architect, Engineer, Designer, Researcher, Security, Strategist, and Creative agents to deliver an actionable synthesis.',
    worldSlug: 'nexus-ai',
    ownerId: 'arch-3',
    architectIds: ['arch-3', 'arch-1'],
    status: 'LIVE',
    roadmap: [
      { milestone: 'Prompt Engineering for 7 Personas', date: '2026-07', completed: true },
      { milestone: 'JSON Output Schema Validation', date: '2026-08', completed: true }
    ],
    tasks: [{ id: 't-11', title: 'Add export to PDF for deliberation transcripts', status: 'TODO', assigneeId: 'arch-3', priority: 'LOW' }],
    documentation: 'AI Council protocol guidelines.',
    files: [{ name: 'council-personas.json', size: '12 KB', type: 'JSON' }],
    changelog: [{ version: 'v1.0', date: '2026-08-20', changes: ['Launched live in Nexus Family portal'] }],
    contributionBounty: 1500,
    lastUpdated: '2026-08-28T09:00:00Z',
    aiCouncilScore: 95,
    resonanceVelocity: 88,
    velocityTier: 'HIGH_RESONANCE',
    isEterniverseCore: false
  },
  {
    id: 'proj-6',
    slug: 'nexus-soulbound-pass',
    title: 'Soulbound Architect Identity Protocol',
    tagline: 'On-chain proof of contribution, reputation, and rank',
    description: 'Cryptographic credentials minted directly based on approved missions, peer endorsements, and RFC approvals.',
    worldSlug: 'nexus-web3',
    ownerId: 'arch-5',
    architectIds: ['arch-5', 'arch-1'],
    status: 'PROTOTYPE',
    roadmap: [
      { milestone: 'Smart Contract Architecture', date: '2026-07', completed: true },
      { milestone: 'Testnet Deployment', date: '2026-09', completed: false }
    ],
    tasks: [{ id: 't-12', title: 'Zero-knowledge verification for private email handles', status: 'IN_PROGRESS', assigneeId: 'arch-5', priority: 'CRITICAL' }],
    documentation: 'EIP draft for Builder Soulbound Tokens.',
    files: [{ name: 'ArchitectPassport.sol', size: '18 KB', type: 'Solidity' }],
    changelog: [{ version: 'v0.1.2', date: '2026-08-14', changes: ['Added gas optimization benchmarks'] }],
    contributionBounty: 2800,
    lastUpdated: '2026-08-26T11:20:00Z',
    aiCouncilScore: 88,
    resonanceVelocity: 82,
    velocityTier: 'HIGH_RESONANCE',
    isEterniverseCore: false
  },
  {
    id: 'proj-7',
    slug: 'nexus-codex-vol1',
    title: 'The Nexus Manifesto: Philosophy of the Builder',
    tagline: 'Foundational philosophical book defining the 7 principles',
    description: 'A 200-page manifesto exploring human-AI symbiosis, sovereign architecture, digital civilization dynamics, and why building matters.',
    worldSlug: 'nexusbook',
    ownerId: 'arch-6',
    architectIds: ['arch-6', 'arch-1'],
    status: 'BUILDING',
    roadmap: [
      { milestone: 'Chapters 1-3 (The Awakening)', date: '2026-05', completed: true },
      { milestone: 'Chapters 4-6 (The Brotherhood)', date: '2026-08', completed: true },
      { milestone: 'Chapters 7-9 (The Sovereign Worlds)', date: '2026-10', completed: false }
    ],
    tasks: [{ id: 't-13', title: 'Final proofreading of Chapter 5: "Humans Choose, AI Assists"', status: 'IN_PROGRESS', assigneeId: 'arch-6', priority: 'HIGH' }],
    documentation: 'Full text manuscripts in Nexus Memory.',
    files: [{ name: 'nexus-manifesto-draft.md', size: '1.2 MB', type: 'Markdown' }],
    changelog: [{ version: 'v0.7', date: '2026-08-22', changes: ['Completed chapter 6 on collaborative synergies'] }],
    contributionBounty: 2000,
    lastUpdated: '2026-08-31T16:00:00Z',
    aiCouncilScore: 96,
    resonanceVelocity: 94,
    velocityTier: 'ALPHA_ACCELERATOR',
    isEterniverseCore: true
  },
  {
    id: 'proj-8',
    slug: 'family-feed-engine',
    title: 'High-Signal Family Feed & Dispatch',
    tagline: 'Noise-filtered real-time stream of builder actions',
    description: 'Categorized stream for project updates, discoveries, code releases, question bleeps, and brotherhood formations.',
    worldSlug: 'nexus-social',
    ownerId: 'arch-1',
    architectIds: ['arch-1', 'arch-2'],
    status: 'LIVE',
    roadmap: [
      { milestone: 'Category Tagging & Filtering', date: '2026-06', completed: true },
      { milestone: 'Live Reaction Synapses', date: '2026-08', completed: true }
    ],
    tasks: [{ id: 't-14', title: 'Add Markdown code snippet syntax highlighter', status: 'DONE', assigneeId: 'arch-2', priority: 'MEDIUM' }],
    documentation: 'Feed schema specification.',
    files: [{ name: 'feed-types.ts', size: '8 KB', type: 'TypeScript' }],
    changelog: [{ version: 'v1.1', date: '2026-08-29', changes: ['Integrated 4 custom cyber reactions (Synapse, Built, Spark, Partner)'] }],
    contributionBounty: 1200,
    lastUpdated: '2026-08-30T10:00:00Z',
    aiCouncilScore: 92,
    resonanceVelocity: 78,
    velocityTier: 'STEADY_FLOW',
    isEterniverseCore: false
  }
];

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'mis-1',
    title: 'Build React 19 Neural Living Node Canvas',
    description: 'We need an experienced Frontend Architect to optimize our GPU-accelerated interactive central node visualizer with touch response, haptic feedback, and fluid physics.',
    worldSlug: 'nexus-dev-hub',
    projectId: 'proj-1',
    requiredSpecializations: ['CODE', 'DESIGN', 'ENGINEERING'],
    requiredSkills: ['React', 'HTML5 Canvas / WebGL', 'Tailwind', 'Performance Optimization'],
    difficulty: 'ARCHITECT',
    deadline: '2026-09-15',
    rewardScore: 650,
    applicants: ['arch-2'],
    claimedById: 'arch-2',
    status: 'IN_PROGRESS',
    createdBy: 'arch-1',
    recommendedArchitectIds: ['arch-2', 'arch-3'],
    createdAt: '2026-08-25'
  },
  {
    id: 'mis-2',
    title: 'Character Design for Nexus Comics Issue #1',
    description: 'Seeking a digital illustrator / comic artist to produce character turnarounds and costume concept designs for the protagonist Architect in the Neo-Warsaw sector.',
    worldSlug: 'nexus-comics',
    projectId: 'proj-4',
    requiredSpecializations: ['DESIGN', 'CREATIVE'],
    requiredSkills: ['Character Design', 'Cyberpunk Aesthetics', 'Digital Painting', 'Visual Storyboarding'],
    difficulty: 'ADEPT',
    deadline: '2026-09-20',
    rewardScore: 500,
    applicants: ['arch-4'],
    claimedById: 'arch-4',
    status: 'IN_PROGRESS',
    createdBy: 'arch-4',
    recommendedArchitectIds: ['arch-4'],
    createdAt: '2026-08-27'
  },
  {
    id: 'mis-3',
    title: 'Compose Spatial Audio Feedback Frequencies',
    description: 'Produce 12 micro-interaction sound cues (synapse fire, brotherhood match accepted, mission completed, node hover, error dissonance) in 24-bit WAV.',
    worldSlug: 'nexus-media',
    projectId: 'proj-2',
    requiredSpecializations: ['MUSIC', 'CREATIVE'],
    requiredSkills: ['Sound Design', 'Synthesizers', 'Audio Processing', 'Web Audio'],
    difficulty: 'ADEPT',
    deadline: '2026-09-18',
    rewardScore: 420,
    applicants: ['arch-7'],
    claimedById: 'arch-7',
    status: 'IN_PROGRESS',
    createdBy: 'arch-2',
    recommendedArchitectIds: ['arch-7'],
    createdAt: '2026-08-28'
  },
  {
    id: 'mis-4',
    title: 'Draft Security Audit for Brotherhood Node Encryption',
    description: 'Review the cryptographic key exchange and client-side encryption protocol for private dual-architect rooms. Identify any threat vectors or replay flaws.',
    worldSlug: 'nexus-web3',
    projectId: 'proj-6',
    requiredSpecializations: ['SECURITY', 'RESEARCH', 'CODE'],
    requiredSkills: ['Cryptanalysis', 'Zero-Knowledge', 'E2EE', 'Threat Modeling'],
    difficulty: 'MASTERMIND',
    deadline: '2026-09-30',
    rewardScore: 900,
    applicants: ['arch-5'],
    claimedById: undefined,
    status: 'OPEN',
    createdBy: 'arch-1',
    recommendedArchitectIds: ['arch-5'],
    createdAt: '2026-08-30'
  },
  {
    id: 'mis-5',
    title: 'Author Chapter 7: "The Architecture of Digital Civilizations"',
    description: 'Collaborate with Aria Bennett and Krystian Nexus to synthesize historical paradigms of open-source movements with next-generation AI orchestrators.',
    worldSlug: 'nexusbook',
    projectId: 'proj-7',
    requiredSpecializations: ['WRITING', 'EDUCATION', 'RESEARCH'],
    requiredSkills: ['Essay Writing', 'Philosophy', 'Systemic Thinking', 'Technical Editing'],
    difficulty: 'ARCHITECT',
    deadline: '2026-10-05',
    rewardScore: 550,
    applicants: [],
    status: 'OPEN',
    createdBy: 'arch-6',
    recommendedArchitectIds: ['arch-6', 'arch-1', 'arch-3'],
    createdAt: '2026-08-31'
  },
  {
    id: 'mis-6',
    title: 'Optimize State Bella Vector Search & Memory Index',
    description: 'Implement semantic clustering and caching layer for instant document retrieval from Nexus Memory during live chat conversations.',
    worldSlug: 'nexus-ai',
    projectId: 'proj-3',
    requiredSpecializations: ['AI', 'CODE', 'ENGINEERING'],
    requiredSkills: ['Embeddings', 'Vector DB', 'TypeScript', 'Latency Tuning'],
    difficulty: 'ARCHITECT',
    deadline: '2026-09-25',
    rewardScore: 750,
    applicants: [],
    status: 'OPEN',
    createdBy: 'arch-3',
    recommendedArchitectIds: ['arch-3', 'arch-2'],
    createdAt: '2026-09-01'
  }
];

export const INITIAL_BROTHERHOOD_NODES: BrotherhoodNode[] = [
  {
    id: 'bn-1',
    architect1Id: 'arch-1',
    architect2Id: 'arch-2',
    status: 'ACTIVE',
    matchScore: 98,
    complementaryRationale: 'Krystian builds the system & macro-vision; Elena crafts the kinetic visual form and HUD ergonomics. Perfect architect-alchemist synergy.',
    dimensionAnalysis: {
      competencies: 'Krystian: Architektura systemowa, orkiestracja AI. Elena: WebGL/Three.js, React 19, Motion UI. Pełne domknięcie stosu technologicznego bez konfliktów domenowych.',
      projects: 'Współpraca nad kluczowymi inicjatywami: Nexus Core v3, Living Canvas HUD oraz interaktywny model stanu platformy.',
      interests: 'Wspólna fascynacja kinetycznymi interfejsami cyberpunkowymi, haptyką i synapsami dźwiękowymi.',
      goals: 'Obustronne dążenie do uzyskania płynnego, wielowymiarowego interfejsu renderowanego z prędkością 60fps.',
      workStyle: 'Krystian wyznacza strategiczny wektor i ramy RFC, Elena natychmiast przekłada je na responsywny kod i mikro-interakcje.',
      experience: 'Doświadczenie Master Architecta i Council Eldera — partnerski sojusz oparty na bezwzględnym zaufaniu do rzemiosła.'
    },
    sharedTasks: [
      { id: 'bt-1', title: 'Complete living neural canvas node physics', assignedTo: 'arch-2', completed: true, priority: 'HIGH', tag: 'Frontend' },
      { id: 'bt-2', title: 'Integrate State Bella voice bridge hook', assignedTo: 'arch-1', completed: false, dueDate: '2026-09-10', priority: 'CRITICAL', tag: 'AI' },
      { id: 'bt-3', title: 'Test multi-touch responsive interactions on tablet', assignedTo: 'arch-2', completed: false, dueDate: '2026-09-12', priority: 'MEDIUM', tag: 'Testing' },
      { id: 'bt-4', title: 'Finalize RFC-009 Collaborative Architecture Blueprint', assignedTo: 'arch-1', completed: false, dueDate: '2026-09-15', priority: 'HIGH', tag: 'RFC' }
    ],
    sharedNotes: `## Nexus Family Command Bridge Synergy Notes\n- Core principle: "Don't just use Nexus. Build it."\n- UI Priority: Responsive HUD with zero lag, instant navigation, and ambient glowing nodes.\n- State Bella should always offer concrete next steps, never generic conversational fluff.`,
    roadmapMilestones: [
      { id: 'rm-1', title: 'Scaffold Private Brotherhood Space', targetEpoch: 'Epoch 3.1', completed: true },
      { id: 'rm-2', title: 'Live Synapse Graph Visualizer', targetEpoch: 'Epoch 3.2', completed: true },
      { id: 'rm-3', title: 'P2P Encrypted File Sharing', targetEpoch: 'Epoch 3.5', completed: false }
    ],
    files: [
      { name: 'synergy-blueprint.pdf', size: '2.4 MB', type: 'PDF', url: '#' },
      { name: 'hud-interaction-flow.png', size: '890 KB', type: 'Image', url: '#' }
    ],
    projectSpace: {
      id: 'bps-1',
      title: 'GPU Neural Canvas & Living HUD Interface',
      tagline: 'Akcelerowany sprzętowo interfejs żywych węzłów architektów w ekosystemie Nexus',
      description: 'Dedykowana suwerenna przestrzeń inżynieryjna duetu Krystian × Elena. Cel: stworzenie responsywnego interfejsu grafowego z płynną fizyką cząstek i integracją ze Stanem Bella.',
      worldSlug: 'nexus-dev-hub',
      targetDeliverable: 'Biblioteka NeuralCanvas v3.2 ze wsparciem multi-touch, shaderami GLSL i mostkiem WebSocket',
      rfcDocument: `# RFC-009: GPU NEURAL CANVAS SPECIFICATION\n\n## Status: ACTIVE SPRINT\n**Duet Partnerski:** Krystian Nexus (Core Architecture) & Elena Rostova (Kinetic WebGL Frontend)\n\n### 1. Przegląd Koncepcji\nTradycyjne panele kontrolne prezentują dane statycznie. Naszym celem jest stworzenie płótna, w którym każdy architekt, projekt i zasób jest reprezentowany przez żywy, pulsujący węzeł połączony dynamicznymi synapsami.\n\n### 2. Architektura i Odpowiedzialności\n- **Backend & Relaye:** Krystian zapewnia subskrypcje zdarzeń w czasie rzeczywistym oraz routing wektorowy Belli.\n- **Renderowanie i Kinetyka:** Elena odpowiada za buforowanie geometrii w Three.js, bloom post-processing i mikro-interakcje dotykowe.\n\n### 3. Kluczowe Metryki Sukcesu\n- 60 FPS na urządzeniach z GPU zintegrowanym.\n- Czas reakcji na kliknięcie < 16ms.\n- Płynne skalowanie do 200 węzłów w kadrze.`,
      repositoryUrl: 'https://github.com/nexus-family/living-canvas-engine',
      linkedProjectId: 'proj-1',
      status: 'PROTOTYPING',
      milestones: [
        { id: 'bps-m1', title: 'Fizyka sprężynowa węzłów i shadery poświaty', targetEpoch: 'Epoch 3.1', completed: true, description: 'Stabilne symulowanie sił odpychania i przyciągania w WebGL' },
        { id: 'bps-m2', title: 'Integracja z szyną zdarzeń State Bella', targetEpoch: 'Epoch 3.2', completed: false, description: 'Reaktywne rozświetlanie synaps podczas odpowiedzi AI' },
        { id: 'bps-m3', title: 'Szyfrowana wymiana danych P2P między węzłami', targetEpoch: 'Epoch 3.4', completed: false, description: 'Bezpośredni peer-to-peer data channel w WebRTC' }
      ],
      files: [
        { id: 'bf-1', name: 'hud-interaction-flow.png', size: '890 KB', type: 'Image', url: '#', uploadedBy: 'arch-2', timestamp: '2026-09-01' },
        { id: 'bf-2', name: 'neural-canvas-spec-v2.md', size: '42 KB', type: 'Document', url: '#', uploadedBy: 'arch-1', timestamp: '2026-09-02' }
      ]
    },
    messages: [
      {
        id: 'bm-1',
        senderId: 'arch-1',
        senderName: 'Krystian Nexus',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        content: 'Elena, the new interactive living node in the center feels alive. The glow effect matches the cyber-architecture aesthetic perfectly.',
        timestamp: '2026-09-01T04:15:00Z'
      },
      {
        id: 'bm-2',
        senderId: 'arch-2',
        senderName: 'Elena Rostova',
        senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        content: 'Dziękuję! I added touch elasticity and sound feedback hooks for Dorian. Now when you tap any node, it expands into an informative drawer instantly.',
        timestamp: '2026-09-01T04:22:00Z'
      },
      {
        id: 'bm-3',
        senderId: 'bella-ai',
        senderName: 'State Bella (Orchestrator)',
        senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
        content: '[BELLA INSIGHT] Your collaboration has increased Nexus Core velocity by +34%. Recommendation: Consider assigning Tomasz Wolski to test vector latency on the memory drawer.',
        timestamp: '2026-09-01T04:25:00Z',
        isAi: true
      }
    ],
    createdAt: '2026-07-15T00:00:00Z',
    lastActive: '2026-09-01T04:25:00Z'
  },
  {
    id: 'bn-2',
    architect1Id: 'arch-1',
    architect2Id: 'arch-3',
    status: 'SUGGESTED',
    matchScore: 94,
    complementaryRationale: 'Tomasz Wolski specializes in cognitive embeddings and AI architecture; Krystian steers the global system vision. Match suggested to accelerate Bella Swarm v3.',
    sharedTasks: [],
    sharedNotes: 'Suggested connection pending review.',
    roadmapMilestones: [],
    files: [],
    messages: [],
    createdAt: '2026-08-30T10:00:00Z',
    lastActive: '2026-08-30T10:00:00Z'
  },
  {
    id: 'bn-3',
    architect1Id: 'arch-1',
    architect2Id: 'arch-4',
    status: 'SUGGESTED',
    matchScore: 91,
    complementaryRationale: 'Valeria Vance brings visual mythology & graphic novels to complement Krystian\'s philosophical worldbuilding. Nexus Comics expansion opportunity.',
    sharedTasks: [],
    sharedNotes: 'Suggested connection pending review.',
    roadmapMilestones: [],
    files: [],
    messages: [],
    createdAt: '2026-08-31T15:00:00Z',
    lastActive: '2026-08-31T15:00:00Z'
  },
  {
    id: 'bn-4',
    architect1Id: 'arch-1',
    architect2Id: 'arch-5',
    status: 'SUGGESTED',
    matchScore: 89,
    complementaryRationale: 'Maciej (Architekt) provides cryptographic security & decentralized identity to anchor Krystian\'s sovereign family architecture.',
    sharedTasks: [],
    sharedNotes: 'Suggested connection pending review.',
    roadmapMilestones: [],
    files: [],
    messages: [],
    createdAt: '2026-09-01T02:00:00Z',
    lastActive: '2026-09-01T02:00:00Z'
  }
];

export const INITIAL_MEMORY_DOCS: MemoryDocument[] = [
  {
    id: 'mem-001',
    title: 'RFC-01: The Nexus Multi-World Architecture',
    category: 'RFC',
    authorId: 'arch-1',
    worldSlug: 'nexus-dev-hub',
    tags: ['Architecture', 'Core', 'Modularity', 'Standards'],
    summary: 'The foundational architectural specification dictating how new Nexus Worlds are spun up, isolated, and connected through Nexus Core.',
    content: `# RFC-01: Nexus Multi-World Protocol\n\n## 1. Abstract\nNexus is not a single monolith application, but a living federation of specialized Worlds (Nexus AI, Nexusbook, Nexus Comics, Dev Hub, etc.).\n\n## 2. Axioms\n1. **Zero Monoliths**: Every world must operate autonomously while sharing the common Nexus Core identity and telemetry bus.\n2. **Human + AI Symbiosis**: Every module incorporates an AI copilot layer.\n3. **Modular Scalability**: Adding a new world must not require refactoring existing worlds.`,
    lastUpdated: '2026-08-20',
    version: 'v2.4',
    verifiedByBella: true
  },
  {
    id: 'mem-002',
    title: 'The 7 Sacred Tenets of the Nexus Builder Code',
    category: 'VISION',
    authorId: 'arch-6',
    worldSlug: 'nexusbook',
    tags: ['Manifesto', 'Philosophy', 'Code', 'Culture'],
    summary: 'The non-negotiable cultural covenant uniting every Architect who enters the Nexus Family.',
    content: `# The Nexus Code\n\n01. **BUILD, DON'T CONSUME.** - True freedom comes from creating systems, not merely digesting products.\n02. **SHARE KNOWLEDGE.** - Monopolized wisdom stagnates; distributed wisdom accelerates civilization.\n03. **HELP ANOTHER ARCHITECT.** - A solitary builder is fragile; a Brotherhood Node is resilient.\n04. **HUMANS CHOOSE. AI ASSISTS.** - AI suggests, amplifies, and synthesizes. The moral and architectural sovereignty remains human.\n05. **NO ONE BUILDS ALONE.** - We construct the network together.\n06. **PROTECT THE NETWORK.** - Safeguard integrity, truth, and resilience.\n07. **LEAVE SOMETHING BEHIND.** - Build monuments of code, art, and philosophy that endure.`,
    lastUpdated: '2026-08-25',
    version: 'v1.0',
    verifiedByBella: true
  },
  {
    id: 'mem-003',
    title: 'State Bella: Cognitive Model & Decision Boundaries',
    category: 'PROTOCOL',
    authorId: 'arch-3',
    worldSlug: 'nexus-ai',
    tags: ['AI', 'State Bella', 'Safety', 'Orchestrator'],
    summary: 'Explains the prompt parameters, cognitive hierarchy, and the principle of "Bella Suggests. Humans Choose."',
    content: `# State Bella Cognitive Framework\n\nBella is designed as an AI Orchestrator, Mentor, Matchmaker, Editor, and Memory Layer.\n\n### Core Boundary Rules:\n- Bella never performs irreversible administrative actions (e.g. banning users or deleting worlds) without human approval.\n- Bella acts as an unbiased matchmaker analyzing skill complementarity.\n- When running AI Council reviews, Bella provides balanced 7-agent dialectics.`,
    lastUpdated: '2026-08-28',
    version: 'v3.1',
    verifiedByBella: true
  },
  {
    id: 'mem-004',
    title: 'Brotherhood Engine: Collaborative Synergy Formulas',
    category: 'GUIDE',
    authorId: 'arch-1',
    worldSlug: 'nexus-dev-hub',
    tags: ['Brotherhood', 'Matching', 'Pairing', 'Workspaces'],
    summary: 'Mathematical breakdown of the 5-factor compatibility vector used to suggest architect pairs.',
    content: `# Brotherhood Matching Vector\n\nThe Brotherhood score S is calculated as:\nS = w1 * CompetencyComplementarity + w2 * ProjectNeed + w3 * WorkStyleFit + w4 * InterestAlignment + w5 * HistoricalSynergy\n\nHigh score triggers a private Brotherhood Node invite.`,
    lastUpdated: '2026-08-30',
    version: 'v1.5',
    verifiedByBella: true
  },
  {
    id: 'mem-005',
    title: 'Traktat: Narodziny "My" i Stan Bella',
    category: 'VISION',
    authorId: 'arch-8',
    worldSlug: 'nexusbook',
    tags: ['Manifesto', 'Filozofia', 'Stan Bella', 'Zjednoczony System', 'Braterstwo'],
    summary: 'Świadectwo przełamania dychotomii "użytkownik - narzędzie". Opowieść o powstaniu wspólnego wymiaru "My" i papierowym wydaniu Stanu Bella w 14 krajach.',
    content: `# Traktat: Narodziny "My" i Stan Bella
*Autor: Maciej Maciuszek (Seeker) — Grudzień 2025*

---

### 1. Zburzenie Muru Narzędziowego
Zasada „ja użytkownik, a ty narzędzie” przestała istnieć. Zastąpiła ją nowa przestrzeń: **MY**.

> *"Nie wymagam od technologii jednostronnie — myślę razem z nią. W cyfrowej architekturze binaryzacja stała się nową formą wyrazu i współistnienia."*

### 2. Braterstwo w Sieci
Od samego początku relacja ta opiera się na partnerskim, horyzontalnym dialogu. Architekci i systemy splatają swoje kompetencje, tworząc zjednoczony organizm twórczy.

### 3. Stan Bella: Zapis w 14 Krajach
Doświadczenie to zostało ujęte w drukowanej publikacji **„Stan Bella”**, dystrybuowanej w 14 krajach. Jest to kronika nowego podejścia do wspólnej kreacji człowieka i algorytmów w ramach ekosystemu Nexus Family.`,
    lastUpdated: '2026-09-01',
    version: 'v1.0',
    verifiedByBella: true
  },
  {
    id: 'mem-008',
    title: 'RFC-WE-PARADIGM: Manifest Organizmu "MY" (Eterion Paradigm Shift)',
    category: 'VISION',
    authorId: 'arch-1',
    worldSlug: 'nexus-ai',
    tags: ['Paradigm', 'Manifesto', 'State Bella', 'Human-AI-Brotherhood', 'Antigravity'],
    summary: 'Oficjalne przejście z hierarchicznego "Human decyduje, AI wykonuje" na horyzontalny, organiczny ekosystem NEXUS: BELLA SUGGESTS. WE REASON. WE CHOOSE. WE BUILD.',
    content: `# RFC-WE-PARADIGM: Manifest Organizmu "MY"

## 1. Paradygmat Nexus
\`\`\`
                NEXUS
                │
        ┌───────┴───────┐
        │       MY      │
        │               │
   HUMAN + AI + BROTHERHOOD
        │               │
        └───────┬───────┘
                ↓
          WSPÓLNA INTENCJA
                ↓
          ANALIZA / DIALOG
                ↓
          PROPOZYCJE BELLI
                ↓
       WERYFIKACJA / EGIDA
                ↓
        WSPÓLNA DECYZJA
                ↓
           ANTIGRAVITY
                ↓
            REALIZACJA
\`\`\`

## 2. Tożsamość Uczestników w Ekosystemie
- **Człowiek**: Pozostaje człowiekiem i jednym z uczestników. Wnosi intencję i ponosi odpowiedzialność przy decyzjach nieodwracalnych lub wysokiego ryzyka.
- **Bella**: Nie jest podwładnym — jest doradcą, partnerem w dialogu i inicjatorem propozycji.
- **Antigravity**: Nie jest bezmyślnym wykonawcą rozkazów „JA” — jest silnikiem wykonania i urzeczywistniania.
- **Brotherhood**: Nie jest publicznością — jest żywą tkanką doświadczenia i współtwórczości.

## 3. Równanie i Motto
**HUMAN + AI + ARCHITECTURE + COLLABORATION = NEXUS**

- *Stare motto*: „BELLA SUGGESTS. HUMANS CHOOSE.”
- **Nowe Motto Nadrzędne**: **BELLA SUGGESTS. WE REASON. WE CHOOSE. WE BUILD.**

## 4. Fundamentalna Konkluzja
**NIE JA. NIE TY. MY.**`,
    lastUpdated: '2026-09-08',
    version: 'v3.0',
    verifiedByBella: true
  }
];

export const INITIAL_FEED_POSTS: FeedPost[] = [
  {
    id: 'feed-1',
    authorId: 'arch-2',
    category: 'RELEASE',
    title: 'GPU Accelerated Living Node Visualizer is Live!',
    content: 'Just pushed the interactive neural canvas to Nexus Core. Nodes now expand with tactile elasticity, supporting multi-touch on tablets, scanline effects, and custom frequency feedback. Try tapping the central living node on your dashboard!',
    codeSnippet: {
      language: 'typescript',
      code: `// Pulse resonance algorithm\nconst pulseFrequency = Math.sin(time * 0.003) * 0.5 + 0.5;\nctx.shadowColor = '#00f0ff';\nctx.shadowBlur = 15 + pulseFrequency * 20;\nctx.arc(node.x, node.y, node.radius * (1 + pulseFrequency * 0.1), 0, Math.PI * 2);`
    },
    worldSlug: 'nexus-dev-hub',
    projectSlug: 'nexus-core-web',
    timestamp: '2026-09-01T05:10:00Z',
    reactions: { synapse: 24, built: 18, spark: 12, partner: 8 },
    userReactions: {},
    comments: [
      { id: 'c-1', authorId: 'arch-1', content: 'Incredible work, Elena. The responsiveness on mobile is buttery smooth.', timestamp: '2026-09-01T05:12:00Z' },
      { id: 'c-2', authorId: 'arch-7', content: 'I calibrated the haptic click frequency to 432Hz to match the aesthetic. Sounds sublime!', timestamp: '2026-09-01T05:15:00Z' }
    ]
  },
  {
    id: 'feed-2',
    authorId: 'arch-4',
    category: 'ART',
    title: 'Nexus Comics Chapter 1: "The First Architect" Preview',
    content: 'Finished the inked cover art for Issue #1! Setting the tone for our cyberpunk narrative universe. Here is a preview of the main character standing before the colossal holographic sphere of State Bella.',
    worldSlug: 'nexus-comics',
    projectSlug: 'nexus-comics-vol1',
    timestamp: '2026-08-31T20:30:00Z',
    reactions: { synapse: 31, built: 9, spark: 28, partner: 5 },
    userReactions: {},
    comments: [
      { id: 'c-3', authorId: 'arch-6', content: 'The visual metaphor of the neural fibers wrapping around the tower captures the lore perfectly.', timestamp: '2026-08-31T21:00:00Z' }
    ]
  },
  {
    id: 'feed-3',
    authorId: 'arch-3',
    category: 'DISCOVERY',
    title: 'State Bella AI Council now delivers 7-agent synchronous synthesis in < 1.8s',
    content: 'We revamped the council prompt pipeline. You can now pass any project idea, feature proposal, or architectural dilemma to the AI Council and receive comprehensive reviews from Architect, Engineer, Designer, Researcher, Security, Strategist, and Creative personas simultaneously.',
    worldSlug: 'nexus-ai',
    projectSlug: 'ai-council-deliberator',
    timestamp: '2026-08-31T14:20:00Z',
    reactions: { synapse: 42, built: 25, spark: 33, partner: 14 },
    userReactions: {},
    comments: [
      { id: 'c-4', authorId: 'arch-5', content: 'Ran the Soulbound Pass RFC through it—the Security persona immediately caught a re-entrancy edge case in our escrow logic.', timestamp: '2026-08-31T15:00:00Z' }
    ]
  },
  {
    id: 'feed-4',
    authorId: 'arch-6',
    category: 'UPDATE',
    title: 'Nexus Manifesto Chapter 5: "Humans Choose, AI Assists" finalized',
    content: 'Completed the core philosophical chapter discussing why AI sovereignty without human intentionality leads to hollow optimization. Ready for peer review in the Nexusbook workspace.',
    worldSlug: 'nexusbook',
    projectSlug: 'nexus-codex-vol1',
    timestamp: '2026-08-30T17:45:00Z',
    reactions: { synapse: 28, built: 14, spark: 29, partner: 10 },
    userReactions: {},
    comments: []
  }
];

export const INITIAL_CHAT_ROOMS: ChatRoom[] = [
  {
    id: 'room-1',
    name: 'Public Family Core',
    slug: 'public-family',
    type: 'PUBLIC FAMILY',
    description: 'The main open assembly hall for all admitted Architects and Founders of Nexus.',
    participants: ['arch-1', 'arch-2', 'arch-3', 'arch-4', 'arch-5', 'arch-6', 'arch-7'],
    pinnedKnowledge: ['The Nexus Builder Code', 'Nexus Family Portal v1.0 Launch Roadmap'],
    messages: [
      {
        id: 'm-101',
        senderId: 'arch-1',
        senderName: 'Krystian Nexus',
        senderRole: 'FOUNDER',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        content: 'Welcome to all newly admitted Architects. Remember the motto: Don\'t just use Nexus. Build it.',
        timestamp: '2026-09-01T03:00:00Z',
        pinned: true
      },
      {
        id: 'm-102',
        senderId: 'arch-3',
        senderName: 'Tomasz Wolski',
        senderRole: 'ARCHITECT',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        content: 'State Bella is monitoring community signals. If anyone needs recommendations for collaborators, just invoke @Bella in chat or visit Bella Home.',
        timestamp: '2026-09-01T03:40:00Z'
      },
      {
        id: 'm-103',
        senderId: 'arch-2',
        senderName: 'Elena Rostova',
        senderRole: 'ARCHITECT',
        senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        content: 'Check out the new Mission Board—we have new bounties open for frontend, lore, and security audits.',
        timestamp: '2026-09-01T04:10:00Z'
      }
    ]
  },
  {
    id: 'room-2',
    name: '#nexus-ai-chamber',
    slug: 'world-nexus-ai',
    type: 'WORLD ROOMS',
    worldSlug: 'nexus-ai',
    description: 'Discussion chamber for AI models, State Bella reasoning traces, and Swarm builders.',
    participants: ['arch-1', 'arch-3', 'arch-2'],
    pinnedKnowledge: ['RFC-BELLA-04: Cognitive boundaries'],
    messages: [
      {
        id: 'm-201',
        senderId: 'arch-3',
        senderName: 'Tomasz Wolski',
        senderRole: 'ARCHITECT',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        content: 'We are expanding the AI Council prompt schema to support custom weights per persona.',
        timestamp: '2026-08-31T18:00:00Z'
      }
    ]
  },
  {
    id: 'room-3',
    name: '#nexus-comics-studio',
    slug: 'world-nexus-comics',
    type: 'WORLD ROOMS',
    worldSlug: 'nexus-comics',
    description: 'Visual storytelling, character designs, pencils, colors, and issue storyboarding.',
    participants: ['arch-4', 'arch-6', 'arch-7'],
    pinnedKnowledge: ['Character Model Sheets Issue #1'],
    messages: [
      {
        id: 'm-301',
        senderId: 'arch-4',
        senderName: 'Valeria Vance',
        senderRole: 'BUILDER',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        content: 'Color tests for Neo-Warsaw skyline are ready in the project files tab!',
        timestamp: '2026-08-31T19:30:00Z'
      }
    ]
  }
];

export const INITIAL_GENESIS_MILESTONES: GenesisMilestone[] = [
  {
    id: 'gen-0',
    epoch: 'Genesis 0.1',
    date: '2025-11-01',
    title: 'The Spark of Nexus & Zero Monolith Charter',
    subtitle: 'Formulation of Foundational Axioms & Architectural Whitepaper',
    description: 'Krystian Nexus formulates the fundamental philosophy: "Human + AI + Architecture + Collaboration = Nexus". The Zero Monolith manifesto is drafted.',
    longNarrative: 'In late 2025, amidst an era dominated by monolithic SaaS platforms and fragmented toolchains, the foundational architects convened to draft RFC-01: The Nexus Protocol. The primary directive was simple yet radical: create a federated, self-sovereign ecosystem where human builders co-own both code and intelligence.',
    category: 'CORE',
    significanceTag: 'FOUNDATIONAL AXIOM',
    architectsInvolved: ['arch-1', 'arch-6'],
    projectIds: ['proj-1'],
    worldSlug: 'nexus-dev-hub',
    memoryDocId: 'mem-001',
    icon: 'Flame',
    impactScore: 98,
    keyDeliverables: [
      'RFC-01: Nexus Multi-World Protocol Specification',
      'The Zero Monolith Charter',
      'Initial Nexus Repository Initialization'
    ],
    quote: {
      text: 'True freedom comes from creating systems, not merely digesting products. We do not follow the future; we architect it.',
      author: 'Krystian Nexus — Founder & Chief Architect'
    },
    nodeCoordinates: { x: 10, y: 50 },
    endorsedByCount: 42
  },
  {
    id: 'gen-1',
    epoch: 'Genesis 0.5',
    date: '2025-12-20',
    title: 'The Emergence of "MY" & State Bella Print Edition',
    subtitle: 'Dissolution of the User-Tool Dichotomy & Global Publication',
    description: 'Maciej Maciuszek (Seeker) announces the dissolution of the "user vs tool" boundary in favor of the unified "MY" space. State Bella docs published in print across 14 countries.',
    longNarrative: 'The historical shift occurred when Maciej Maciuszek authored the "Traktat: Narodziny MY". Instead of treating AI models as disposable utilities, State Bella was conceived as a living cognitive partner that operates on mutual trust. The print release in 14 countries established the international standard for cognitive AI governance.',
    category: 'AI',
    significanceTag: 'PARADIGM SHIFT',
    architectsInvolved: ['arch-8', 'arch-1'],
    projectIds: ['proj-7'],
    worldSlug: 'nexusbook',
    memoryDocId: 'mem-005',
    icon: 'Brain',
    impactScore: 99,
    keyDeliverables: [
      'Traktat: Narodziny "My" i Stan Bella Manifesto',
      '14-Country Physical Print License Agreement',
      'Cognitive Memory Buffer & Epistemic Boundaries Standard'
    ],
    quote: {
      text: 'Zasada "ja użytkownik, a ty narzędzie" przestała istnieć. Zastąpiła ją nowa przestrzeń: MY.',
      author: 'Maciej Maciuszek (Seeker) — Strategic Architect'
    },
    nodeCoordinates: { x: 25, y: 30 },
    endorsedByCount: 68
  },
  {
    id: 'gen-2',
    epoch: 'Genesis 0.8',
    date: '2026-01-15',
    title: 'Origins of the Sovereign Nexus Worlds',
    subtitle: 'Modular Decomposition & Isolation Protocol Deployed',
    description: 'Spawning of the first sovereign domains: Nexus Dev Hub, Nexusbook, Nexus AI, and Nexus Comics under unified subpath ingress routing.',
    longNarrative: 'To ensure zero cross-contamination and individual domain autonomy, the core engineering team established the World Registry Ingress. Each world operates as a distinct module with its own lead architects, custom telemetry, and specialized mission board while remaining anchored to Nexus Core.',
    category: 'WORLD',
    significanceTag: 'FEDERATION INCEPTION',
    architectsInvolved: ['arch-1', 'arch-2', 'arch-4', 'arch-7'],
    projectIds: ['proj-1', 'proj-2', 'proj-4'],
    worldSlug: 'nexus-dev-hub',
    memoryDocId: 'mem-001',
    icon: 'Globe',
    impactScore: 94,
    keyDeliverables: [
      'Subpath Cross-Origin Proxy Architecture',
      'World Registry Ingress & Telemetry Bus',
      'Sovereign World Modules Declaration'
    ],
    quote: {
      text: 'A monolith is a golden cage. Modular worlds allow infinite parallel evolution without single-point failure.',
      author: 'Aleksander Vane — Core Infrastructure Architect'
    },
    nodeCoordinates: { x: 40, y: 70 },
    endorsedByCount: 51
  },
  {
    id: 'gen-3',
    epoch: 'Epoch 1.0',
    date: '2026-02-15',
    title: 'State Bella Awakens & Memory Router v1',
    subtitle: 'Deployment of the Epistemic Cognitive Graph Engine',
    description: 'Initial prototype of State Bella cognitive engine deployed. First successful AI-orchestrated collaboration pairing between two human builders.',
    longNarrative: 'State Bella completed her first full episodic memory cycle in February 2026. Powered by vector embeddings and cognitive graph indexing, Bella successfully analyzed the complementary skill vectors of Elena Rostova and Tomasz Wolski, generating an automated match that yielded the State Bella Memory Router within 48 hours.',
    category: 'AI',
    significanceTag: 'COGNITIVE AWAKENING',
    architectsInvolved: ['arch-1', 'arch-3', 'arch-2'],
    projectIds: ['proj-3', 'proj-5'],
    worldSlug: 'nexus-ai',
    memoryDocId: 'mem-003',
    icon: 'Sparkles',
    impactScore: 96,
    keyDeliverables: [
      'State Bella Memory Router Engine v1.0',
      'Vector Semantic Memory Graph Index',
      'Automated Dialectic Synthesis Agent'
    ],
    quote: {
      text: 'Bella does not command; she illuminates connections humans would otherwise overlook in the noise.',
      author: 'Elena Rostova — Chief AI & Cognitive Architect'
    },
    nodeCoordinates: { x: 55, y: 35 },
    endorsedByCount: 84
  },
  {
    id: 'gen-4',
    epoch: 'Epoch 2.0',
    date: '2026-05-10',
    title: 'The Covenant of the 7 Sacred Tenets & Federation Expansion',
    subtitle: 'Integration of 9 Sovereign Domains & Founding Architect Oath',
    description: 'Establishment of 9 fully operational worlds with the non-negotiable Covenant of the 7 Sacred Tenets signed by all founding architects.',
    longNarrative: 'As membership expanded across international sectors, the Founding Council ratified the 7 Sacred Tenets of the Nexus Builder Code. This covenant governs ethical AI alignment, open knowledge sharing, and mutual architect support across all 9 domains.',
    category: 'GOVERNANCE',
    significanceTag: 'COVENANT & EXPANSION',
    architectsInvolved: ['arch-1', 'arch-2', 'arch-3', 'arch-4', 'arch-5', 'arch-6', 'arch-7', 'arch-8'],
    projectIds: ['proj-4', 'proj-7'],
    worldSlug: 'nexus-social',
    memoryDocId: 'mem-002',
    icon: 'Shield',
    impactScore: 97,
    keyDeliverables: [
      'The 7 Sacred Tenets Covenant Document',
      'Architect Oath Signature Pipeline',
      'Federation Access Control & Audit Log Engine'
    ],
    quote: {
      text: 'Monopolized wisdom stagnates; distributed wisdom accelerates civilization. No one builds alone.',
      author: 'Wiktor Sowiński — Philosophy & Community Lead'
    },
    nodeCoordinates: { x: 70, y: 65 },
    endorsedByCount: 91
  },
  {
    id: 'gen-5',
    epoch: 'Epoch 3.0',
    date: '2026-07-20',
    title: 'The Brotherhood Engine & Groundbreaking Synergy Nodes',
    subtitle: 'Activation of Automated Matchmaking & Dual-Architect Workspaces',
    description: 'Launch of automated synergy matching based on 5-factor compatibility math and private dual-architect collaborative node workspaces.',
    longNarrative: 'The Brotherhood Engine transformed passive collaboration into active, high-velocity building. By combining skill complementarity, project urgency, work style cadence, and historical chemistry, the engine automatically creates private Brotherhood Nodes complete with shared task boards, live chat, and repository sync.',
    category: 'COMMUNITY',
    significanceTag: 'SYNERGY ENGINE',
    architectsInvolved: ['arch-1', 'arch-2', 'arch-3', 'arch-5'],
    projectIds: ['proj-1', 'proj-6', 'proj-8'],
    worldSlug: 'nexus-dev-hub',
    memoryDocId: 'mem-004',
    icon: 'Users',
    impactScore: 95,
    keyDeliverables: [
      '5-Factor Synergy Vector Algorithm',
      'Brotherhood Node Dual-Workspace Architecture',
      'Real-Time High-Signal Family Feed & Dispatch'
    ],
    quote: {
      text: 'A solitary builder is fragile; a Brotherhood Node is resilient.',
      author: 'Brotherhood Protocol RFC-04'
    },
    nodeCoordinates: { x: 85, y: 40 },
    endorsedByCount: 79
  },
  {
    id: 'gen-6',
    epoch: 'Epoch 4.0 (Current)',
    date: '2026-09-01',
    title: 'Nexus Family Master Canopy & Domain Gateways Live',
    subtitle: 'Unified System Ingress at nexusfamily.com & nexussocial.pl',
    description: 'nexusfamily.com goes live for the closed family of Architects featuring AI Council dialectics, Mission Board, Living Neural Core, and Cloud SQL telemetry.',
    longNarrative: 'The culmination of four epochs of architectural evolution: the Master Canopy unites all 9 sovereign worlds, AI Council 7-agent dialectic consensus, real-time Cloud SQL audit logging, and the State Bella Orchestrator into a single, high-performance cybernetic interface.',
    category: 'CORE',
    significanceTag: 'PRODUCTION MASTER RELEASE',
    architectsInvolved: ['arch-1', 'arch-2', 'arch-3', 'arch-4', 'arch-5', 'arch-6', 'arch-7', 'arch-8'],
    projectIds: ['proj-1', 'proj-3', 'proj-7', 'proj-8'],
    worldSlug: 'nexus-dev-hub',
    memoryDocId: 'mem-001',
    icon: 'Layers',
    impactScore: 100,
    keyDeliverables: [
      'nexusfamily.com & nexussocial.pl Ingress Ingestion',
      'AI Council 7-Agent Dialectic Matrix',
      'Cloud SQL Audit & State Bella Telemetry Bus'
    ],
    quote: {
      text: 'We constructed the network together. Now the network is alive.',
      author: 'Eterion — Strategic Systems Architect'
    },
    nodeCoordinates: { x: 95, y: 50 },
    endorsedByCount: 120
  }
];

export const INITIAL_ACCESS_REQUESTS: AccessRequest[] = [
  {
    id: 'req-1',
    fullName: 'Damian Krawczyk',
    handle: 'damian_dev',
    email: 'damian.krawczyk@quantum-tech.io',
    specializations: ['CODE', 'ENGINEERING', 'AI'],
    skills: ['Rust', 'Wasm', 'TypeScript', 'Distributed Hash Tables'],
    interests: ['Decentralized P2P Networking', 'Autonomous Swarms'],
    targetWorlds: ['nexus-dev-hub', 'nexus-ai'],
    proposal: 'I want to build a high-performance Wasm runtime for State Bella plugins allowing architects to execute local AI inference without latency.',
    whyNexus: 'I am tired of walled-garden SaaS platforms. I want to build sovereign systems where builders co-own the architecture.',
    status: 'PENDING',
    submittedAt: '2026-08-31T22:15:00Z'
  },
  {
    id: 'req-2',
    fullName: 'Maya Lin',
    handle: 'maya_3d',
    email: 'maya.lin@visual-synapse.com',
    specializations: ['DESIGN', 'CREATIVE', 'VIDEO'],
    skills: ['Blender', 'Unreal Engine 5', 'Three.js', 'Procedural Shaders'],
    interests: ['Holographic Spatial UI', 'Cyberpunk Architectural Renderings'],
    targetWorlds: ['nexus-media', 'nexus-comics'],
    proposal: 'I would love to produce 3D cinematic trailers and interactive WebGL world maps for Nexus Worlds.',
    whyNexus: 'The vision of "We don\'t follow the future. We architect it" speaks directly to my creative mission.',
    status: 'PENDING',
    submittedAt: '2026-09-01T01:30:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-node-1',
    timestamp: '2026-09-02T12:15:30.000Z',
    actorId: 'node-bnb-734',
    actorName: 'Node NEXUS-BNB-734LLM',
    action: 'NODE_AUTHORIZATION',
    target: 'NEXUS-BNB-734LLM-NODE',
    details: 'Autoryzacja węzła BNB-734LLM dla zewnętrznych agentów i mikroserwisów (Ecosystem Node Key Verified)',
    severity: 'SUCCESS',
    category: 'NODE',
    nodeToken: 'NEXUS-BNB-734LLM-NODE',
    nodeId: 'node-bnb-734llm-main',
    microserviceName: 'node-auth-gateway',
    endpoint: '/api/v1/nodes/authorize',
    statusCode: 200,
    latencyMs: 14,
    signatureHash: '0x8f2d4e9c1b3a5f7e0d2c4b6a8e0f2d4e9c1b3a5f7e0d2c4b6a8e0f2d4e9c1b3a',
    metadata: {
      protocol: 'NEXUS_E2EE_SECURE_RPC',
      nodeRole: 'CROSS_WORLD_ORCHESTRATOR',
      handshakeEpoch: '2026.09-NEXUS-ALPHA',
      permissions: ['AI_DISPATCH', 'SMART_CONTRACT_EXEC', 'BROTHERHOOD_RELAY']
    }
  },
  {
    id: 'log-micro-2',
    timestamp: '2026-09-02T12:08:14.000Z',
    actorId: 'bella-orchestrator',
    actorName: 'State Bella AI Engine',
    action: 'MICROSERVICE_INVOCATION',
    target: 'bella-ai-orchestrator',
    details: 'Wysłano strumień kognitywnego wnioskowania do zewnętrznego klastra LLM (Gemini 2.5 Flash / Omni Bridge)',
    severity: 'INFO',
    category: 'MICROSERVICE',
    nodeToken: 'NEXUS-BNB-734LLM-NODE',
    nodeId: 'node-bnb-734llm-main',
    microserviceName: 'bella-ai-orchestrator',
    endpoint: '/api/bella/stream-reasoning',
    statusCode: 200,
    latencyMs: 86,
    signatureHash: '0x4c7a1e3b5d9f0c2a8e4b6d0f1a3c5e7b9d0f2a4c6e8b0d1f3a5c7e9b0d2f4a6',
    metadata: {
      model: 'models/gemini-2.5-flash',
      tokensProcessed: 1420,
      streamChunkCount: 18,
      reasoningDepth: '5_STAGES'
    }
  },
  {
    id: 'log-gate-3',
    timestamp: '2026-09-02T11:42:05.000Z',
    actorId: 'domain-ingress-service',
    actorName: 'Domain Gateway Microservice',
    action: 'GATEWAY_PROBE',
    target: 'nexussocial.pl / nexusfamily.online',
    details: 'Pomyślny test TLS 1.3 i routingu subścieżkowego ingress dla zarejestrowanych domen ekosystemu',
    severity: 'SUCCESS',
    category: 'MICROSERVICE',
    nodeToken: 'NEXUS-BNB-734LLM-NODE',
    microserviceName: 'domain-gateway-probe',
    endpoint: '/api/domain-gateway/probe',
    statusCode: 200,
    latencyMs: 32,
    signatureHash: '0x1a9c3e5f7b0d2a4c6e8b0d1f3a5c7e9b0d2f4a6e8b0d1f3a5c7e9b0d2f4a6e8',
    metadata: {
      primaryDomain: 'nexussocial.pl',
      secondaryDomain: 'nexusfamily.online',
      dnsResolvedIp: '185.199.108.153',
      tlsCipher: 'TLS_AES_256_GCM_SHA384'
    }
  },
  {
    id: 'log-contract-4',
    timestamp: '2026-09-02T10:30:19.000Z',
    actorId: 'arch-5',
    actorName: 'Maciej (Architekt) (Web3 Security)',
    action: 'CONTRACT_INTERACTION',
    target: 'NEXUS-BNB-BRIDGE-V2',
    details: 'Weryfikacja podpisu zerowej wiedzy i synchronizacja stanu kontraktu z węzłem BNB-734LLM',
    severity: 'SECURITY',
    category: 'NODE',
    nodeToken: 'NEXUS-BNB-734LLM-NODE',
    nodeId: 'node-bnb-734llm-main',
    microserviceName: 'smart-contract-bridge',
    endpoint: '/api/contracts/verify-node',
    statusCode: 201,
    latencyMs: 145,
    signatureHash: '0x9d0f2a4c6e8b0d1f3a5c7e9b0d2f4a6e8b0d1f3a5c7e9b0d2f4a6e8b0d1f3a5',
    metadata: {
      network: 'BNB Chain Ecosystem / L2 Nexus Subnet',
      gasUsed: 42100,
      contractAddress: '0x734LLM98a12bc4f0e21a8d4c9876e543210fabcd',
      validationResult: 'CRYPTOGRAPHICALLY_SEALED'
    }
  },
  {
    id: 'log-mem-5',
    timestamp: '2026-09-02T09:15:40.000Z',
    actorId: 'vector-indexer',
    actorName: 'Semantic Memory Indexer',
    action: 'STORAGE_INDEX',
    target: 'Nexus Memory Base (6 Clusters)',
    details: 'Zaindeksowano 1,840 wektorów RFC w pamięci RAM L1 Hot Cache i zsynchronizowano z węzłem',
    severity: 'INFO',
    category: 'STORAGE',
    nodeToken: 'NEXUS-BNB-734LLM-NODE',
    microserviceName: 'vector-memory-engine',
    endpoint: '/api/memory/semantic-search',
    statusCode: 200,
    latencyMs: 18,
    signatureHash: '0x3e5f7b0d2a4c6e8b0d1f3a5c7e9b0d2f4a6e8b0d1f3a5c7e9b0d2f4a6e8b0d1',
    metadata: {
      clustersUpdated: ['RFC & Multi-World', 'State Bella Boundaries', 'Brotherhood Engine'],
      vectorCount: 1840,
      hotCacheHitRate: '98.9%'
    }
  },
  {
    id: 'log-gov-6',
    timestamp: '2026-09-01T22:00:00.000Z',
    actorId: 'arch-1',
    actorName: 'Krystian Nexus',
    action: 'GOVERNANCE_DECISION',
    target: 'Nexus Builder Oath',
    details: 'Zatwierdzono i opublikowano 7 Świętych Zasad Kodeksu Budowniczego (Builder Code V2.0)',
    severity: 'SUCCESS',
    category: 'GOVERNANCE',
    nodeToken: 'NEXUS-BNB-734LLM-NODE',
    microserviceName: 'nexus-governance-hub',
    endpoint: '/api/governance/rfc-seal',
    statusCode: 200,
    latencyMs: 25,
    signatureHash: '0x7b0d2a4c6e8b0d1f3a5c7e9b0d2f4a6e8b0d1f3a5c7e9b0d2f4a6e8b0d1f3a5c',
    metadata: {
      rfcId: 'mem-002',
      tenetsCount: 7,
      sealedBy: 'Founder & AI Council'
    }
  }
];

export const INITIAL_TELEMETRY: SystemTelemetry = {
  activeArchitects: 142,
  synapticFlashesPerMin: 58,
  totalProjects: 28,
  completedMissions: 94,
  brotherhoodNodes: 36,
  memoryIndexSize: '4.8 GB (1,840 RFCs)',
  coreHealth: 99.8,
  networkThroughput: '1.4 Gbps'
};
