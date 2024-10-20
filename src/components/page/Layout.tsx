import type { ReactNode } from 'react';
import { usePlanner } from '../../hooks/usePlanner.ts';
import { Nav, NavItem } from '../Nav.tsx';

type Props = {
    children: ReactNode;
    header: ReactNode;
};

export default function Layout({ children, header }: Props) {
    const {
        activeFactoryId,
        addFactory,
        factories,
        goToOverview,
        navigateToFactory,
    } = usePlanner();

    return (
        <main className="p-8">
            <h1 className="text-3xl mb-8">
                <i>Satis</i>Factory Planner
            </h1>
            <Nav>
                <NavItem active={!activeFactoryId} onClick={goToOverview}>
                    Overview
                </NavItem>
                {factories.map((factory) => (
                    <NavItem
                        key={factory.id}
                        active={factory.id === activeFactoryId}
                        onClick={() => navigateToFactory(factory.id)}
                    >
                        {factory.name}
                    </NavItem>
                ))}
                <NavItem onClick={addFactory}>Add new</NavItem>
            </Nav>
            <div className="bg-primary p-4 flex gap-x-2">{header}</div>

            <div className="border border-t-0 border-tertiary p-8">
                {children}
            </div>
        </main>
    );
}
