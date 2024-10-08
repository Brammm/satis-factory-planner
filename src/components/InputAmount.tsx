import {ChangeEvent} from 'react';

type Props = {
    value: number;
    onChange: (amount: number) => void;
};

export default function InputAmount({onChange, value}: Props) {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedItem = e.currentTarget.value;
        onChange(parseFloat(selectedItem));
    }
    
    return (
        <input type="number" value={value} onChange={handleChange} className="text-secondary" />
    );
}
