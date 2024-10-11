import clsx from 'clsx';
import type { ReactNode } from 'react';

type Props = {
    children: ReactNode;
    type?: 'page' | 'sub' | 'small';
};

export default function Title({ children, type = 'page' }: Props) {
    return (
        <h2
            className={clsx(
                'font-bold',
                type === 'page' && 'text-2xl',
                type === 'sub' && 'text-xl',
                type === 'small' && 'text-lg',
            )}
        >
            {children}
        </h2>
    );
}
