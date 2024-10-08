import {Nav, NavItem} from './components/Nav.tsx';
import {usePlanner} from './hooks/usePlanner.ts';

function App() {
    const {activeFactoryId, addFactory, deleteFactory, factories, navigateToFactory, renameFactory} = usePlanner();
    
    const activeFactory = factories.find((factory) => factory.id === activeFactoryId)!;
    
    const handleRename = () => {
        const newName = prompt('New factory name?', activeFactory.name);
        
        if (newName) {
            renameFactory(activeFactoryId, newName);
        }
    };

    return (
        <main className="p-8">
            <h1 className="text-3xl mb-8"><i>Satis</i>Factory Planner</h1>
            <Nav>
                {factories.map((factory) => (
                    <NavItem active={factory.id === activeFactory.id}
                             onClick={() => navigateToFactory(factory.id)}>{factory.name}</NavItem>
                ))}
                <NavItem onClick={addFactory}>Add new</NavItem>
            </Nav>
            <div className="bg-primary p-2 flex gap-x-2">
                <h2 className="text-2xl">{activeFactory.name}</h2>
                <button onClick={handleRename}>rename</button>
                <button onClick={() => deleteFactory(activeFactoryId)}>remove</button>
            </div>
        </main>
    );
}

export default App;
