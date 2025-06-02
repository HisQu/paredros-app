import { Fragment, useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import { Dialog, DialogTitle, DialogBody, DialogActions } from './ui/dialog';
import { Button } from './ui/button';

export function useUnhandledRejectionDialog() {
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handler = (evt: PromiseRejectionEvent) => {
            console.error('🔥 Unhandled promise rejection', evt.reason);
            setError(String(evt.reason));
            evt.preventDefault(); // Prevent the default handling of the rejection
        };

        window.addEventListener('unhandledrejection', handler);
        return () => window.removeEventListener('unhandledrejection', handler);
    }, []);

    return (
        <Transition appear as={Fragment} show={error !== null}>
            <Dialog onClose={() => setError(null)} size="sm">
                <DialogTitle>Error</DialogTitle>

                <DialogBody>
                    <p className="text-sm text-zinc-700 dark:text-zinc-200 whitespace-pre-wrap">
                        {error}
                    </p>
                </DialogBody>

                <DialogActions>
                    <Button color="violet" onClick={() => setError(null)}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Transition>
    );
}
