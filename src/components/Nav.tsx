import {ReactNode} from 'react';
import clsx from 'clsx';

type NavProps = {
    children: ReactNode;
};

export function Nav({children}: NavProps) {
    return (
        <ul className="bg-tertiary flex">
            {children}
        </ul>
    );
}

type NavItemProps = {
    active?: boolean;
    onClick: () => void;
    children: ReactNode;
};
export function NavItem({active = false, children, onClick}: NavItemProps) {
    return (
        <li className={clsx(active ? 'bg-primary' : 'bg-tertiary', 'p-2')}>
            <button onClick={onClick}>{children}</button>
        </li>
    );
}
