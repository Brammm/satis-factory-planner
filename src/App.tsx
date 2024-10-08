import InputAmount from './components/InputAmount.tsx';
import {Nav, NavItem} from './components/Nav.tsx';
import SelectItem from './components/SelectItem.tsx';
import {Item} from './hooks/item.ts';
import {usePlanner} from './hooks/usePlanner.ts';

function App() {
    const {
        activeFactoryId,
        addFactory,
        changeOutput,
        deleteFactory,
        factories,
        navigateToFactory,
        renameFactory,
    } = usePlanner();

    const activeFactory = factories.find((factory) => factory.id === activeFactoryId)!;

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
        changeOutput(activeFactoryId,
            activeFactory.output.toSpliced(index, 1, [activeFactory.output[index][0], amount]));
    };

    const handleItemChange = (index: number, item: Item | null) => {
        if (!item) {
            return handleRemoveOutput(index);
        }
        changeOutput(activeFactoryId, activeFactory.output.toSpliced(index, 1, [item, activeFactory.output[index][1]]));
    };

    return <main className="p-8">
        <h1 className="text-3xl mb-8"><i>Satis</i>Factory Planner</h1>
        <Nav>
            {factories.map((factory) => <NavItem key={factory.id} active={factory.id === activeFactory.id}
                                                 onClick={() => navigateToFactory(factory.id)}>{factory.name}</NavItem>)}
            <NavItem onClick={addFactory}>Add new</NavItem>
        </Nav>
        <div className="bg-primary p-2 flex gap-x-2">
            <h2 className="text-2xl">{activeFactory.name}</h2>
            <button onClick={handleRename}>rename</button>
            <button onClick={() => deleteFactory(activeFactoryId)}>remove</button>
        </div>
        <div className="bg-tertiary p-2">
            <h3>Output</h3>
            <form>
                {activeFactory.output.map(([item, amount], index) => (<div key={item}>
                    <SelectItem value={item} onChange={(item) => handleItemChange(index, item)} />
                    <InputAmount value={amount} onChange={(amount) => handleAmountChange(index, amount)} />
                    <button onClick={() => handleRemoveOutput(index)} type="button">&times;</button>
                </div>))}
                <div>
                    <SelectItem value={null} onChange={handleAddOutput} />
                </div>
            </form>
        </div>
    </main>;
}

export default App;
