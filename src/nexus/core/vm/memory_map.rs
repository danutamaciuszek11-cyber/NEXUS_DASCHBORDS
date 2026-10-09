use std::collections::HashMap;

/// Błąd maszyny wirtualnej
#[derive(Debug)]
pub enum VMError {
    InvalidAddress(u32),
    AccessViolation,
    NotImplemented,
}

/// Przedział adresowy dedykowany dla Pamięci Asocjacyjnej Bellas
pub const BELLAS_ASSOCIATIVE_MEM_START: u32 = 0x90000000;
pub const BELLAS_ASSOCIATIVE_MEM_END: u32 = 0x9FFFFFFF;

/// Cecha (Trait) definiująca urządzenie MMIO obsługujące pamięć asocjacyjną
pub trait AssociativeMemoryDevice {
    fn read_reg(&self, address: u32) -> Result<u32, VMError>;
    fn write_reg(&mut self, address: u32, value: u32) -> Result<(), VMError>;
    fn get_state_root(&self) -> [u8; 32];
}

/// Przykładowa implementacja Mock (Stub) dla urządzenia asocjacyjnego
pub struct MockAssociativeMemory {
    registers: HashMap<u32, u32>,
}

impl MockAssociativeMemory {
    pub fn new() -> Self {
        Self {
            registers: HashMap::new(),
        }
    }
}

impl AssociativeMemoryDevice for MockAssociativeMemory {
    fn read_reg(&self, address: u32) -> Result<u32, VMError> {
        Ok(*self.registers.get(&address).unwrap_or(&0))
    }

    fn write_reg(&mut self, address: u32, value: u32) -> Result<(), VMError> {
        self.registers.insert(address, value);
        Ok(())
    }

    fn get_state_root(&self) -> [u8; 32] {
        // Zwraca zerowy korzeń kryptograficzny w przypadku macka
        [0u8; 32]
    }
}

/// Dyspozytor MMIO (Memory Router)
pub struct MMIODispatcher {
    bellas_mem: Box<dyn AssociativeMemoryDevice>,
}

impl MMIODispatcher {
    pub fn new(bellas_mem: Box<dyn AssociativeMemoryDevice>) -> Self {
        Self { bellas_mem }
    }

    pub fn read_memory(&self, address: u32) -> Result<u32, VMError> {
        if address >= BELLAS_ASSOCIATIVE_MEM_START && address <= BELLAS_ASSOCIATIVE_MEM_END {
            return self.bellas_mem.read_reg(address);
        }
        // Pozostała pamięć - dla uproszczenia rzucamy wyjątek
        Err(VMError::InvalidAddress(address))
    }

    pub fn write_memory(&mut self, address: u32, value: u32) -> Result<(), VMError> {
        if address >= BELLAS_ASSOCIATIVE_MEM_START && address <= BELLAS_ASSOCIATIVE_MEM_END {
            return self.bellas_mem.write_reg(address, value);
        }
        // Pozostała pamięć
        Err(VMError::InvalidAddress(address))
    }
}
