export const items = [
    'IRON_INGOT',
    'COPPER_INGOT',
    'CATERIUM_INGOT',
    'STEEL_INGOT',
    'RAW_QUARTZ',
    'CONCRETE',
    'RUBBER',
    'SMART_PLATING',
    'MODULAR_ENGINE',
    'VERSATILE_FRAMEWORK',
    'AUTOMATED_WIRING',
    'ADAPTIVE_CONTROL_UNIT',
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
] as const;

export type Item = (typeof items)[number];
