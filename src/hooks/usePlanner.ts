import { ulid } from 'ulid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type { WritableDraft } from 'immer';
import type { Branded } from '../util/Branded.ts';
import type { Item } from './item.ts';

type FactoryId = Branded<string, 'FactoryId'>;
type ModuleId = Branded<string, 'ModuleId'>;

function createFactoryId(): FactoryId {
    return ulid() as FactoryId;
}

function createModuleId(): ModuleId {
    return ulid() as ModuleId;
}

type Factory = {
    id: FactoryId;
    name: string;
    output: [Item, number][];
    modules: Module[];
};

type Module = {
    id: ModuleId;
    item: Item;
    amount: number;
    input: [Item, number][];
};

type State = {
    activeFactoryId?: FactoryId;
    factories: Factory[];
};

type Actions = {
    goToOverview: () => void;
    addFactory: () => void;
    navigateToFactory: (factoryId: FactoryId) => void;
    renameFactory: (factoryId: FactoryId, name: string) => void;
    deleteFactory: (factoryId: FactoryId) => void;
    changeOutput: (factoryId: FactoryId, output: [Item, number][]) => void;
    addModuleToFactory: (factoryId: FactoryId, item: Item) => void;
    deleteModule: (factoryId: FactoryId, moduleId: ModuleId) => void;
    changeModuleOutput: (
        factoryId: FactoryId,
        moduleId: ModuleId,
        item: Item,
        amount: number,
    ) => void;
    changeModuleInput: (
        factoryId: FactoryId,
        moduleId: ModuleId,
        input: [Item, number][],
    ) => void;
};

const defaultState: State = {
    factories: [
        {
            id: createFactoryId(),
            name: 'New Factory',
            output: [],
            modules: [],
        },
    ],
};

function onFactory(
    factories: WritableDraft<Factory>[],
    factoryId: FactoryId,
    handler: (factory: Factory) => void,
) {
    const activeFactory = factories.find((factory) => factory.id === factoryId);
    if (!activeFactory) return;

    handler(activeFactory);
}

function onModule(
    factories: WritableDraft<Factory>[],
    factoryId: FactoryId,
    moduleId: ModuleId,
    handler: (module: Module) => void,
) {
    const factory = factories.find((factory) => factory.id === factoryId);
    if (!factory) return;

    const module = factory.modules.find((module) => module.id === moduleId);
    if (!module) return;

    handler(module);
}

export const usePlanner = create<State & Actions>()(
    persist(
        immer((set) => ({
            ...defaultState,
            goToOverview: () => {
                set({ activeFactoryId: undefined });
            },
            addFactory: () => {
                const newId = createFactoryId();
                set((state) => {
                    state.factories.push({
                        id: newId,
                        name: 'New Factory',
                        output: [],
                        modules: [],
                    });
                    state.activeFactoryId = newId;
                });
            },
            navigateToFactory: (factoryId) => {
                set((state) => {
                    state.activeFactoryId = factoryId;
                });
            },
            renameFactory: (factoryId, name) => {
                set((state) => {
                    onFactory(state.factories, factoryId, (factory) => {
                        factory.name = name;
                    });
                });
            },
            deleteFactory: (factoryId) => {
                set((state) => {
                    state.factories = state.factories.filter(
                        (factory) => factory.id !== factoryId,
                    );
                    if (state.factories.length === 0) {
                        state.factories = defaultState.factories;
                        state.activeFactoryId = defaultState.factories[0].id;
                    }
                    if (factoryId === state.activeFactoryId) {
                        state.activeFactoryId = state.factories[0].id;
                    }
                });
            },
            changeOutput: (factoryId, output) => {
                set((state) => {
                    onFactory(state.factories, factoryId, (factory) => {
                        factory.output = output;
                    });
                });
            },
            addModuleToFactory: (factoryId, item) => {
                set((state) => {
                    onFactory(state.factories, factoryId, (factory) => {
                        factory.modules.push({
                            id: createModuleId(),
                            item,
                            amount: 10,
                            input: [],
                        });
                    });
                });
            },
            deleteModule: (factoryId, moduleId) => {
                set((state) => {
                    onFactory(state.factories, factoryId, (factory) => {
                        factory.modules = factory.modules.filter(
                            (module) => module.id !== moduleId,
                        );
                    });
                });
            },
            changeModuleOutput: (factoryId, moduleId, item, amount) => {
                set((state) => {
                    onModule(state.factories, factoryId, moduleId, (module) => {
                        module.item = item;
                        module.amount = amount;
                    });
                });
            },
            changeModuleInput: (factoryId, moduleId, input) => {
                set((state) => {
                    onModule(state.factories, factoryId, moduleId, (module) => {
                        module.input = input;
                    });
                });
            },
        })),
        { name: 'satis-factory-planner', version: 1 },
    ),
);
