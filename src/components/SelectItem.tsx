import { useState } from 'react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
} from '@headlessui/react';
import { type Item, items } from '../hooks/item.ts';
import { legible } from '../util';

type Props = {
    defaultItems?: Item[];
    onChange: (item: Item | null) => void;
    value: Item | null;
};

export default function SelectItem({ defaultItems, onChange, value }: Props) {
    const [query, setQuery] = useState('');

    const itemsToShow = defaultItems || items;

    const filteredItems =
        query === ''
            ? itemsToShow
            : itemsToShow.filter((item) =>
                  legible(item).toLowerCase().includes(query.toLowerCase()),
              );

    return (
        <Combobox
            as="div"
            immediate
            value={value}
            onChange={(item) => {
                setQuery('')
                onChange(item)
            }}
        >
            <div className="relative w-fit">
                <ComboboxInput
                    className="w-full rounded-md border-0 bg-tertiary py-1.5 pl-3 pr-12 text-slate-100 shadow-sm ring-1 ring-inset ring-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm/6"
                    onChange={(event) => setQuery(event.target.value)}
                    onBlur={() => setQuery('')}
                    displayValue={(item: Item|null) => item ? legible(item) : ''}
                />
                <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                    <ChevronUpDownIcon className="size-5 text-gray-400" aria-hidden="true" />
                </ComboboxButton>

                {filteredItems.length > 0 && (
                    <ComboboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-tertiary py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                        {filteredItems.map((item) => (
                            <ComboboxOption
                                key={item}
                                value={item}
                                className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-primary data-[focus]:text-white data-[focus]:outline-none"
                            >
                                <div className="flex items-center">
                                    <img src={`assets/items/${item}.png`} alt="" className="size-6 shrink-0" />
                                    <span className="ml-3 truncate group-data-[selected]:font-semibold">{legible(item)}</span>
                                </div>

                                <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-primary group-data-[selected]:flex group-data-[focus]:text-white">
                  <CheckIcon className="size-5" aria-hidden="true" />
                </span>
                            </ComboboxOption>
                        ))}
                    </ComboboxOptions>
                )}
            </div>
        </Combobox>
    );
}
