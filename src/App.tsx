import InputGroupItemAmount from './components/InputGroupItemAmount.tsx';
import SelectItem from './components/SelectItem.tsx';
import Title from './components/Title.tsx';
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
                    <Title>{activeFactory.name}</Title>
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
            <Title type="sub">Output</Title>
            <form className="flex flex-col gap-y-2">
                {activeFactory.output.map(([item, amount], index) => (
                    <div key={item}>
                        <InputGroupItemAmount
                            item={item}
                            amount={amount}
                            onItemChange={(item) =>
                                handleItemChange(index, item)
                            }
                            onDelete={() => handleRemoveOutput(index)}
                            onAmountChange={(amount) =>
                                handleAmountChange(index, amount)
                            }
                        />
                    </div>
                ))}
                <div>
                    <SelectItem value={null} onChange={handleAddOutput} />
                </div>
            </form>
            <hr className="my-4 border-tertiary" />
            <Title type="sub">Modules</Title>
            <form className="flex flex-col gap-y-6">
                {activeFactory.modules.map((module) => (
                    <div key={module.id} className="flex flex-col gap-y-2">
                        <div>
                            <InputGroupItemAmount
                                item={module.item}
                                amount={module.amount}
                                onItemChange={(item) =>
                                    changeModuleOutput(
                                        activeFactoryId,
                                        module.id,
                                        item,
                                        module.amount,
                                    )
                                }
                                onDelete={() =>
                                    deleteModule(activeFactoryId, module.id)
                                }
                                onAmountChange={(amount) =>
                                    changeModuleOutput(
                                        activeFactoryId,
                                        module.id,
                                        module.item,
                                        amount,
                                    )
                                }
                            />
                        </div>
                        <div className="flex">
                            <span className="mr-2">Inputs</span>
                            <div className="flex flex-col gap-y-2">
                                {module.input.map(([item, amount], index) => (
                                    <div key={`${module.id}-${index}`}>
                                        <InputGroupItemAmount
                                            item={item}
                                            amount={amount}
                                            onItemChange={(item) =>
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
                                                )
                                            }
                                            onDelete={() =>
                                                changeModuleInput(
                                                    activeFactoryId,
                                                    module.id,
                                                    module.input.toSpliced(
                                                        index,
                                                        1,
                                                    ),
                                                )
                                            }
                                            onAmountChange={(amount) =>
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
                                                )
                                            }
                                        />
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
