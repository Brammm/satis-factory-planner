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
    activeFactoryId: FactoryId;
    factories: Factory[];
};

type Actions = {
    addFactory: () => void;
    navigateToFactory: (factoryId: FactoryId) => void;
    renameFactory: (factoryId: FactoryId, name: string) => void;
    deleteFactory: (factoryId: FactoryId) => void;
    changeOutput: (factoryId: FactoryId, output: [Item, number][]) => void;
};

const defaultFactoryId = createFactoryId();
const defaultState: State = {
    activeFactoryId: defaultFactoryId,
    factories: [
        {
            id: defaultFactoryId,
            name: 'New Factory',
            output: [],
            modules: [],
        },
    ],
};

function onActiveFactory(
    factories: WritableDraft<Factory>[],
    factoryId: FactoryId,
    handler: (factory: Factory) => void,
) {
    const activeFactory = factories.find((factory) => factory.id === factoryId);
    if (!activeFactory) return;

    handler(activeFactory);
}

export const usePlanner = create<State & Actions>()(
    persist(
        immer((set) => ({
            ...defaultState,
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
                    onActiveFactory(state.factories, factoryId, (factory) => {
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
                        state.activeFactoryId = defaultFactoryId;
                    }
                    if (factoryId === state.activeFactoryId) {
                        state.activeFactoryId = state.factories[0].id;
                    }
                });
            },
            changeOutput: (factoryId, output) => {
                set((state) => {
                    onActiveFactory(state.factories, factoryId, (factory) => {
                        factory.output = output;
                    });
                });
            },
        })),
        { name: 'satis-factory-planner', version: 1 },
    ),
);
