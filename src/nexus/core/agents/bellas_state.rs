/// Stan Agentów w Warstwie Prawdy 2.0 (Truth Layer 2.0)

/// Struktura reprezentująca stan agenta Bellas w systemie.
#[derive(Debug, Clone)]
pub struct BellasAgent {
    pub id: String,
    pub status: String,
    
    // Nowe pola dla Pamięci Asocjacyjnej
    /// Kryptograficzny dowód (korzeń Merkle) aktualnego stanu pamięci asocjacyjnej agenta.
    pub associative_root: [u8; 32],
    
    /// Licznik aktualizacji pamięci (cykli). Zwiększany z każdym poprawnym commitem.
    pub memory_epoch: u64,
}

impl BellasAgent {
    pub fn new(id: String) -> Self {
        Self {
            id,
            status: "INITIALIZED".to_string(),
            associative_root: [0; 32],
            memory_epoch: 0,
        }
    }

    /// Aktualizuje korzeń pamięci asocjacyjnej, inkrementując epokę.
    /// Ważne: to wywołanie musi zostać zatwierdzone przez silnik dowodzenia przed wywołaniem tej metody.
    pub fn commit_associative_memory(&mut self, new_root: [u8; 32]) {
        self.associative_root = new_root;
        self.memory_epoch += 1;
    }
}
