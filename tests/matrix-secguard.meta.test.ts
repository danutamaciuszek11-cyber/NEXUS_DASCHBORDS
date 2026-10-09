import fs from 'fs';
import path from 'path';

const target = path.resolve(process.cwd(), 'tests', 'matrix-secguard.test.ts');
const source = fs.readFileSync(target, 'utf8');
let failed = 0;

function assert(condition: boolean, description: string) {
  if (condition) console.log(`  PASS: ${description}`);
  else {
    failed += 1;
    console.error(`  FAIL: ${description}`);
  }
}

console.log('\n[TESTY DLA TESTÓW]');
assert(fs.existsSync(target), 'Plik testu matrycy i straży istnieje.');
assert(source.includes('Manifest matrycy kompiluje się'), 'Test sprawdza kompilację NXL matrycy.');
assert(source.includes('Próg 85 jest prawdą w NXL'), 'Test sprawdza próg straży w manifeście.');
assert(source.includes('85% przenosi straż w kwarantannę'), 'Test sprawdza kwarantannę przy 85%.');
assert(source.includes('84% nie zamyka modułu'), 'Test sprawdza, że próg nie zamyka wcześniej.');
assert(source.includes('nie powtarza śladu ptrace'), 'Test zabrania powtórzenia śladu ataku.');
assert(source.includes('trzy pytania Kaisa'), 'Test sprawdza dziennik.');
assert(source.includes("viewMode === 'secguard'"), 'Test sprawdza podłączenie widoku.');
assert(!source.includes('PTRACE_ATTACH, pid'), 'Sam test nie zawiera recepty podłączenia procesu.');

console.log(`\nMeta: ${failed === 0 ? 'pass' : failed + ' fail'}\n`);
if (failed > 0) process.exit(1);
