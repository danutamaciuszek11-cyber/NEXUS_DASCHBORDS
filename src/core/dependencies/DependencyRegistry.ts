/**
 * System Dependency Registry
 * Wzorzec Registry/Singleton przechowujący współdzielone instancje bibliotek 
 * oraz funkcji systemowych. Gwarantuje dostępność krytycznych zasobów 
 * dla wtyczek i podmodułów.
 */

export class DependencyRegistry {
  private static instance: DependencyRegistry;
  private dependencies: Map<string, any> = new Map();

  private constructor() {}

  public static getInstance(): DependencyRegistry {
    if (!DependencyRegistry.instance) {
      DependencyRegistry.instance = new DependencyRegistry();
    }
    return DependencyRegistry.instance;
  }

  /**
   * Zarejestruj nową zależność
   * @param key Klucz identyfikujący (np. 'd3', 'eventBus', 'theme')
   * @param value Instancja zależności
   * @param force Nadpisz, jeśli już istnieje (Domyślnie false - ochrona systemowych usług)
   */
  public register(key: string, value: any, force = false): void {
    if (this.dependencies.has(key) && !force) {
      console.warn(`[DependencyRegistry] Zależność '${key}' została już zarejestrowana.`);
      return;
    }
    this.dependencies.set(key, value);
  }

  /**
   * Pobierz zarejestrowaną zależność
   * @param key Klucz identyfikujący
   * @returns Instancja zależności
   */
  public get<T = any>(key: string): T {
    if (!this.dependencies.has(key)) {
      throw new Error(`[DependencyRegistry] Zależność '${key}' nie została znaleziona w rejestrze.`);
    }
    return this.dependencies.get(key) as T;
  }

  /**
   * Sprawdź dostępność zależności
   */
  public has(key: string): boolean {
    return this.dependencies.has(key);
  }

  /**
   * Pobierz wszystkie klucze zarejestrowanych zależności
   */
  public getRegisteredKeys(): string[] {
    return Array.from(this.dependencies.keys());
  }
}

export const registry = DependencyRegistry.getInstance();
