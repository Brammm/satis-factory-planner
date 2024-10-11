import InputAmount from './components/InputAmount.tsx';
import SelectItem from './components/SelectItem.tsx';
import Layout from './components/page/Layout.tsx';
import Overview from './components/page/Overview.tsx';
import type { Item } from './hooks/item.ts';
import { usePlanner } from './hooks/usePlanner.ts';

function App() {
    const {
        activeFactoryId,
        addModuleToFactory,
        changeOutput,
        changeModuleInput,
        changeModuleOutput,
        deleteFactory,
        deleteModule,
        factories,
        renameFactory,
    } = usePlanner();

    const activeFactory = factories.find(
        (factory) => factory.id === activeFactoryId,
    );

    if (!activeFactoryId || !activeFactory) {
        return <Overview />;
    }

    const handleRename = () => {
        const newName = prompt('New factory name?', activeFactory.name);

        if (newName) {
            renameFactory(activeFactoryId, newName);
        }
    };

    const handleAddOutput = (item: Item | null) => {
        if (!item) {
            return;
        }

        changeOutput(activeFactoryId, [...activeFactory.output, [item, 10]]);
    };

    const handleRemoveOutput = (index: number) => {
        changeOutput(activeFactoryId, activeFactory.output.toSpliced(index, 1));
    };

    const handleAmountChange = (index: number, amount: number) => {
        changeOutput(
            activeFactoryId,
            activeFactory.output.toSpliced(index, 1, [
                activeFactory.output[index][0],
                amount,
            ]),
        );
    };

    const handleItemChange = (index: number, item: Item | null) => {
        if (!item) {
            return handleRemoveOutput(index);
        }
        changeOutput(
            activeFactoryId,
            activeFactory.output.toSpliced(index, 1, [
                item,
                activeFactory.output[index][1],
            ]),
        );
    };

    const availableModuleOutput = [
        ...new Set(
            activeFactory.output
                .map(([item]) => item)
                .concat(
                    activeFactory.modules.flatMap((module) =>
                        module.input.map(([item]) => item),
                    ),
                ),
        ),
    ];

    const handleAddModule = (item: Item | null) => {
        if (!item) return;

        addModuleToFactory(activeFactoryId, item);
    };

    return (
        <Layout
            header={
                <>
                    <h2 className="text-2xl">{activeFactory.name}</h2>
                    <button onClick={handleRename} type="button">
                        rename
                    </button>
                    <button
                        onClick={() => deleteFactory(activeFactoryId)}
                        type="button"
                    >
                        remove
                    </button>
                </>
            }
        >
            <h3>Output</h3>
            <form>
                {activeFactory.output.map(([item, amount], index) => (
                    <div key={item}>
                        <SelectItem
                            value={item}
                            onChange={(item) => handleItemChange(index, item)}
                        />
                        <InputAmount
                            value={amount}
                            onChange={(amount) =>
                                handleAmountChange(index, amount)
                            }
                        />
                        <button
                            onClick={() => handleRemoveOutput(index)}
                            type="button"
                        >
                            &times;
                        </button>
                    </div>
                ))}
                <div>
                    <SelectItem value={null} onChange={handleAddOutput} />
                </div>
            </form>
            <hr className="my-4" />
            <h3>Modules</h3>
            <form>
                {activeFactory.modules.map((module) => (
                    <div key={module.id}>
                        <div>
                            <SelectItem
                                defaultItems={availableModuleOutput}
                                value={module.item}
                                onChange={(item) => {
                                    if (!item) return;

                                    changeModuleOutput(
                                        activeFactoryId,
                                        module.id,
                                        item,
                                        module.amount,
                                    );
                                }}
                            />
                            <InputAmount
                                value={module.amount}
                                onChange={(amount) => {
                                    changeModuleOutput(
                                        activeFactoryId,
                                        module.id,
                                        module.item,
                                        amount,
                                    );
                                }}
                            />
                            <button
                                onClick={() =>
                                    deleteModule(activeFactoryId, module.id)
                                }
                                type="button"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="flex">
                            <span className="mr-2">Inputs</span>
                            <div>
                                {module.input.map(([item, amount], index) => (
                                    <div key={`${module.id}-${index}`}>
                                        <SelectItem
                                            value={item}
                                            onChange={(item) => {
                                                if (!item) return;

                                                changeModuleInput(
                                                    activeFactoryId,
                                                    module.id,
                                                    module.input.toSpliced(
                                                        index,
                                                        1,
                                                        [
                                                            item,
                                                            module.input[
                                                                index
                                                            ][1],
                                                        ],
                                                    ),
                                                );
                                            }}
                                        />
                                        <InputAmount
                                            value={amount}
                                            onChange={(amount) => {
                                                changeModuleInput(
                                                    activeFactoryId,
                                                    module.id,
                                                    module.input.toSpliced(
                                                        index,
                                                        1,
                                                        [
                                                            module.input[
                                                                index
                                                            ][0],
                                                            amount,
                                                        ],
                                                    ),
                                                );
                                            }}
                                        />
                                        <button
                                            onClick={() => {
                                                changeModuleInput(
                                                    activeFactoryId,
                                                    module.id,
                                                    module.input.toSpliced(
                                                        index,
                                                        1,
                                                    ),
                                                );
                                            }}
                                            type="button"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                                <div>
                                    <SelectItem
                                        value={null}
                                        onChange={(item) => {
                                            if (!item) return;

                                            changeModuleInput(
                                                activeFactoryId,
                                                module.id,
                                                [...module.input, [item, 10]],
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <div>
                    <SelectItem
                        defaultItems={availableModuleOutput}
                        value={null}
                        onChange={handleAddModule}
                    />
                </div>
            </form>
        </Layout>
    );
}

export default App;
