import { Fragment } from 'react';
import type { Item } from '../../hooks/item.ts';
import { usePlanner } from '../../hooks/usePlanner.ts';
import { legible } from '../../util';
import Title from '../Title.tsx';
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

    const factoryOverview = factories.map((factory) => {
        const modules = factory.modules.map((module) => {
            const moduleCount = production[module.item] / module.amount;

            return {
                id: module.id,
                item: module.item,
                count: moduleCount,
                input: module.input.map(([item, amount]) => [
                    item,
                    amount * moduleCount,
                ]),
            };
        });

        const baseInput = modules.reduce<Partial<Record<Item, number>>>(
            (baseInput, module) => {
                for (const [item, amount] of module.input) {
                    if (factory.modules.find((module) => module.item === item))
                        continue;

                    baseInput[item as Item] =
                        (baseInput[item as Item] || 0) + (amount as number);
                }

                return baseInput;
            },
            {},
        );

        return {
            id: factory.id,
            name: factory.name,
            modules,
            baseInput,
        };
    });

    return (
        <Layout header={<Title>Overview</Title>}>
            <Title type="sub">Factory overview</Title>
            <div className="inline-grid grid-cols-3">
                {factoryOverview.map((factory) => (
                    <Fragment key={factory.id}>
                        <div className="col-span-3 my-4">
                            <Title type="small">{factory.name}</Title>
                        </div>
                        {factory.modules.map((module) => (
                            <Fragment key={module.id}>
                                <div className="border-b">
                                    {legible(module.item)}
                                </div>
                                <div className="border-b">{module.count}</div>
                                <div className="border-b">
                                    <ul>
                                        {module.input.map(([item, amount]) => (
                                            <li key={module.id + item}>
                                                {legible(item as string)}:{' '}
                                                {amount}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Fragment>
                        ))}
                        <span>Total input:</span>
                        <ul className="col-span-2">
                            {Object.entries(factory.baseInput).map(
                                ([item, amount]) => (
                                    <li key={item}>
                                        {legible(item)}: {amount}
                                    </li>
                                ),
                            )}
                        </ul>
                    </Fragment>
                ))}
            </div>
            <Title type="sub">Total required production</Title>
            <div className="inline-grid grid-cols-2">
                {Object.entries(production).map(([item, amount]) => (
                    <Fragment key={item}>
                        <span key={`item-${item}`}>{legible(item)}</span>
                        <span key={`amount-${item}`}>{amount}</span>
                    </Fragment>
                ))}
            </div>
        </Layout>
    );
}
