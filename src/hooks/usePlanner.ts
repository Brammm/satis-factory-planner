import {ulid} from 'ulid';
import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {immer} from 'zustand/middleware/immer';

import {Branded} from '../util/Branded.ts';
import {Item} from './item.ts';
import {createComputed} from 'zustand-computed';

type FactoryId = Branded<string, 'FactoryId'>;
type ModuleId = Branded<string, 'ModuleId'>;

function createFactoryId(): FactoryId {
    return ulid() as FactoryId;
}

type Factory = {
    id: FactoryId;
    name: string;
    output: Partial<Record<Item, number>>;
    modules: Module[];
};

type Module = {
    id: ModuleId;
    item: Item,
    amount: number,
    input: Partial<Record<Item, number>>;
};

type State = {
    activeFactoryId: FactoryId;
    factories: Factory[];
};

type Actions = {
    addFactory: () => void;
    navigateToFactory: (factoryId: FactoryId) => void;
};

type Computed = {
    activeFactory: Factory;
}

const defaultFactoryId = createFactoryId();
const defaultState: State = {
    activeFactoryId: defaultFactoryId,
    factories: [
        {
            id: defaultFactoryId,
            name: 'New Factory',
            output: {},
            modules: [],
        },
    ],
};

const computed = createComputed((state: State & Actions): Computed => ({
    activeFactory: state.factories.find((factory) => factory.id === state.activeFactoryId)!,
}));

export const usePlanner = create<State & Actions>()(
    computed(
        persist(
            immer(
                (set) => ({
                    ...defaultState,
                    addFactory: () => {
                        const newId = createFactoryId();
                        console.log(newId);
                        set((state) => {
                            state.factories.push({
                                id: newId,
                                name: 'New Factory',
                                output: {},
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
                })),
            {name: 'satis-factory-planner', version: 1},
        ),
    ),
);
