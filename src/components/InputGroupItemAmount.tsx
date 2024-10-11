import type { Item } from '../hooks/item.ts';
import InputAmount from './InputAmount.tsx';
import SelectItem from './SelectItem.tsx';

type Props = {
    item: Item;
    amount: number;
    onItemChange: (item: Item) => void;
    onDelete: () => void;
    onAmountChange: (amount: number) => void;
};

export default function InputGroupItemAmount({
    amount,
    item,
    onAmountChange,
    onDelete,
    onItemChange,
}: Props) {
    const handleItemChange = (item: Item | null) => {
        if (!item) {
            return onDelete();
        }

        onItemChange(item);
    };

    return (
        <>
            <SelectItem value={item} onChange={handleItemChange} />
            <InputAmount value={amount} onChange={onAmountChange} />
            <button onClick={onDelete} type="button">
                &times;
            </button>
        </>
    );
}
