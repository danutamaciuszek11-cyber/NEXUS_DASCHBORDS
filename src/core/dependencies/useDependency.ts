import { registry } from './DependencyRegistry';

/**
 * Hook dostępu do narzędzi systemowych wstrzykniętych w Dependency Layer.
 * Używany zamiast standardowych importów w dynamicznych modułach P2P.
 * 
 * @param key Klucz zależności (np. 'd3')
 * @returns Przypisana paczka / usługa
 */
export function useDependency<T = any>(key: string): T {
  // Ponieważ rejestr jest globalnym singletonem, możemy go odpytać bezpośrednio.
  // Zapewnia to działanie nawet poza drzewem React (o ile zainicjowano provider).
  return registry.get<T>(key);
}
