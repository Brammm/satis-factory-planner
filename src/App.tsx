import {Nav, NavItem} from './components/Nav.tsx';
import {usePlanner} from './hooks/usePlanner.ts';

function App() {
    const {activeFactory, addFactory, factories, navigateToFactory} = usePlanner();

    return (
        <main className="p-8">
            <h1 className="text-3xl mb-8"><i>Satis</i>factory Planner</h1>
            <Nav>
                {factories.map((factory) => (
                    <NavItem active={factory.id === activeFactory.id}
                             onClick={() => navigateToFactory(factory.id)}>{factory.name}</NavItem>
                ))}
                <NavItem onClick={addFactory}>Add new</NavItem>
            </Nav>
            <div className="bg-primary p-2">
                <h2>{activeFactory.name}</h2>
            </div>
        </main>
    );
}

export default App;
