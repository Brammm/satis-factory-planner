import type { ChangeEvent } from 'react';

import { type Item, items } from '../hooks/item.ts';

type Props = {
    value: Item | null;
    onChange: (item: Item | null) => void;
};

export default function SelectItem({ onChange, value }: Props) {
    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedItem = e.currentTarget.value
            ? (e.currentTarget.value as Item)
            : null;
        onChange(selectedItem);
    };

    return (
        <select
            className="text-secondary"
            onChange={handleChange}
            value={value || ''}
        >
            <option value="">-</option>
            {items.map((item) => (
                <option key={item} value={item}>
                    {item}
                </option>
            ))}
        </select>
    );
}
