export const items = [
    'IRON_INGOT',
    'COPPER_INGOT',
    'CATERIUM_INGOT',
    'STEEL_INGOT',
    'ALUMINUM_INGOT',
    'RAW_QUARTZ',
    'CONCRETE',
    'RUBBER',
    'PLASTIC ',
    'SMART_PLATING',
    'MODULAR_ENGINE',
    'VERSATILE_FRAMEWORK',
    'AUTOMATED_WIRING',
    'ADAPTIVE_CONTROL_UNIT',
    'FUSED_MODULAR_FRAME',
    'HEAVY_MODULAR_FRAME',
    'ENCASED_INDUSTRIAL_BEAM',
    'MODULAR_FRAME',
    'REINFORCED_IRON_PLATE',
    'ROTOR',
    'STATOR',
    'MOTOR',
    'AI_LIMITER',
    'CRYSTAL_OSCILLATOR',
    'CIRCUIT_BOARD',
    'HIGH_SPEED_CONNECTOR',
    'COMPUTER',
    'RADIO_CONTROL_UNIT',
    'SUPERCOMPUTER',
] as const;

export type Item = (typeof items)[number];
