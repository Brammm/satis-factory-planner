import type { ChangeEvent } from 'react';

type Props = {
    value: number;
    onChange: (amount: number) => void;
};

export default function InputAmount({ onChange, value }: Props) {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedItem = e.currentTarget.value;
        onChange(Number.parseFloat(selectedItem));
    };

    return (
        <input
            type="number"
            value={value}
            onChange={handleChange}
            className="bg-tertiary text-slate-100 rounded py-1 w-28 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
    );
}
