import type { ChangeEvent } from 'react';

import { type Item, items } from '../hooks/item.ts';

type Props = {
    defaultItems?: Item[];
    onChange: (item: Item | null) => void;
    value: Item | null;
};

export default function SelectItem({ defaultItems, onChange, value }: Props) {
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
            {(defaultItems || items).map((item) => (
                <option key={item} value={item}>
                    {item}
                </option>
            ))}
        </select>
    );
}
