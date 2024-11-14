import { useEffect, useState } from 'react';
import { usePlanner } from '../hooks/usePlanner.ts';
import { NavItem } from './Nav.tsx';

export default function ShareButton() {
    const { getShareUrl } = usePlanner();

    const [buttonText, setButtonText] = useState('Share');

    const handleCopy = () => {
        const url = getShareUrl();
        navigator.clipboard.writeText(url);

        setButtonText('Copied!');
    };

    useEffect(() => {
        if (buttonText !== 'Copied!') {
            return;
        }

        const timeout = setTimeout(() => {
            setButtonText('Share');
        }, 1000);

        return () => clearTimeout(timeout);
    }, [buttonText]);

    return <NavItem onClick={handleCopy}>{buttonText}</NavItem>;
}
