import fs from 'fs';
import path from 'path';
import { NxlRuntimeCore } from '../src/nexus/core/nxl/runtime';
import { MATRIX_GATES, MATRIX_LAWS, MATRIX_SECTORS, MATRIX_SUBJECTS } from '../src/nexus/matrix/canon';
import { interpretJournalLocally } from '../src/nexus/matrix/interpret';
import {
  guardSnapshot,
  releaseModule,
  reviewAlert,
  setDrift,
} from '../src/nexus/secguard/secGuardLink';

const root = path.resolve(process.cwd());
let failed = 0;
let passed = 0;

function assert(condition: boolean, description: string) {
  if (condition) {
    passed += 1;
    console.log(`  PASS: ${description}`);
  } else {
    failed += 1;
    console.error(`  FAIL: ${description}`);
  }
}

function compileNxl(fileName: string) {
  const source = fs.readFileSync(path.join(root, 'src', 'nxl', fileName), 'utf8');
  return new NxlRuntimeCore().executeSource(source);
}

console.log('\n[MATRIX + SEC-GUARD]');

const matrix = compileNxl('matrix-core.nxl');
assert(matrix.success, 'Manifest matrycy kompiluje się bez błędu prawdy.');
assert(matrix.truthReports.length === 4, 'Manifest matrycy ma cztery asercje.');
assert(matrix.truthReports.every((report) => report.result), 'Asercje matrycy przechodzą.');

const guard = compileNxl('sec-guard.nxl');
assert(guard.success, 'Manifest straży kompiluje się bez błędu prawdy.');
assert(guard.truthReports.some((report) => report.assertion.includes('85') && report.result), 'Próg 85 jest prawdą w NXL.');

assert(MATRIX_SUBJECTS.length === 5, 'Kanon ma pięć filarów.');
assert(MATRIX_LAWS.length === 7, 'Kanon ma siedem praw.');
assert(MATRIX_GATES.length === 9, 'Kanon ma dziewięć bram.');
assert(MATRIX_SECTORS.length === 10, 'Kanon ma dziesięć sektorów.');
assert(MATRIX_LAWS[0].text.includes('połączone'), 'Prawo Jedności ma brzmienie manifestu.');

const reading = interpretJournalLocally('Obserwuję intencję i zostawiam ślad dla dziedzictwa.');
assert(reading.prompts.length === 3, 'Dziennik zwraca trzy pytania Kaisa.');
assert(reading.engine === 'local', 'Odczyt bez Gemini jest podpisany jako local.');
assert(reading.summary.length > 10, 'Streszczenie nie jest puste.');

const before = guardSnapshot();
assert(before.modules.length === 4, 'Straż trzyma cztery moduły.');
assert(before.status === 'SECURE', 'Start straży jest SECURE.');

const raised = setDrift('AUTH-MATRIX-01', 84);
assert(raised?.modules.find((item) => item.id === 'AUTH-MATRIX-01')?.status !== 'QUARANTINED', '84% nie zamyka modułu.');

const closed = setDrift('AUTH-MATRIX-01', 85);
assert(closed?.status === 'QUARANTINE', '85% przenosi straż w kwarantannę.');
assert(closed?.ledger[0]?.event === 'QUARANTINE', 'Księga zapisuje QUARANTINE.');

const opened = releaseModule('AUTH-MATRIX-01');
assert(opened?.modules.find((item) => item.id === 'AUTH-MATRIX-01')?.status === 'ACTIVE', 'Zdjęcie kwarantanny przywraca moduł.');

const review = reviewAlert('SENTINEL-NODE-03', 'sys_ptrace(PTRACE_ATTACH)');
assert(!review.summary.toLowerCase().includes('ptrace'), 'Odczyt nie powtarza śladu ptrace.');
assert(review.actions.length === 3, 'Odczyt daje trzy działania obronne.');
assert(!review.summary.includes('sys_'), 'Odczyt nie zawiera wywołań systemowych.');

const app = fs.readFileSync(path.join(root, 'src', 'App.tsx'), 'utf8');
const server = fs.readFileSync(path.join(root, 'server.ts'), 'utf8');
assert(app.includes("viewMode === 'matrix'") && app.includes("viewMode === 'secguard'"), 'Aplikacja ma widoki matrycy i straży.');
assert(server.includes('/api/sec-guard/status') && server.includes('/api/matrix/journal/interpret'), 'Serwer ma trasy matrycy i straży.');

console.log(`\nMatrix/SecGuard: ${passed} pass, ${failed} fail\n`);
if (failed > 0) process.exit(1);
