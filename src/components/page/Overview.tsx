import { Fragment } from 'react';
import type { Item } from '../../hooks/item.ts';
import { usePlanner } from '../../hooks/usePlanner.ts';
import Layout from './Layout.tsx';

export default function Overview() {
    const { factories } = usePlanner();

    // Add up all the minimum output from each factory
    const production = Object.fromEntries(
        factories.flatMap((factory) => factory.output),
    );
    // Get all available modules
    const allModules = factories.flatMap((factory) => factory.modules);

    // Function that will try finding a module for the desired item,
    // calculates the required input and adds that input to the required production
    const parseProduction = (item: Item, desiredAmount: number) => {
        const module = allModules.find((module) => module.item === item);
        if (!module) return;

        const multiplier = desiredAmount / module.amount;

        for (const [item, amount] of module.input) {
            const requiredAmount = amount * multiplier;
            production[item] = (production[item] || 0) + requiredAmount;

            parseProduction(item, requiredAmount);
        }
    };

    // Loop over initial production and recurse over it
    for (const [item, amount] of Object.entries(production)) {
        parseProduction(item as Item, amount);
    }

    // Loop over modules and round up
    // TODO: allModules should be ordered so the last modules of a factory
    // that have the most dependencies are first in the array
    for (const module of allModules) {
        const difference =
            Math.ceil(production[module.item] / module.amount) * module.amount -
            production[module.item];

        production[module.item] += difference;
        parseProduction(module.item, difference);
    }

    return (
        <Layout header={<h2>Overview</h2>}>
            <h3>Factory overview</h3>
            {factories.map((factory) => (
                <Fragment key={factory.id}>
                    <h4>{factory.name}</h4>
                    <div className="grid grid-cols-3">
                        {factory.modules.map((module) => (
                            <Fragment key={module.id}>
                                <div>{module.item}</div>
                                <div>
                                    {production[module.item] / module.amount}
                                </div>
                                <div>
                                    <ul>
                                        {module.input.map(([item, amount]) => (
                                            <li key={module.id + item}>
                                                {item}:{' '}
                                                {(amount *
                                                    production[module.item]) /
                                                    module.amount}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Fragment>
                        ))}
                    </div>
                </Fragment>
            ))}
            <h3>Total required production</h3>
            <div className="grid grid-cols-2">
                {Object.entries(production).map(([item, amount]) => (
                    <Fragment key={item}>
                        <span key={`item-${item}`}>{item}</span>
                        <span key={`amount-${item}`}>{amount}</span>
                    </Fragment>
                ))}
            </div>
        </Layout>
    );
}
