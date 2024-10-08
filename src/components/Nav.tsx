import clsx from 'clsx';
import type { ReactNode } from 'react';

type NavProps = {
    children: ReactNode;
};

export function Nav({ children }: NavProps) {
    return <ul className="bg-tertiary flex">{children}</ul>;
}

type NavItemProps = {
    active?: boolean;
    onClick: () => void;
    children: ReactNode;
};
export function NavItem({ active = false, children, onClick }: NavItemProps) {
    return (
        <li className={clsx(active ? 'bg-primary' : 'bg-tertiary')}>
            <button className="p-2" onClick={onClick} type="button">
                {children}
            </button>
        </li>
    );
}
