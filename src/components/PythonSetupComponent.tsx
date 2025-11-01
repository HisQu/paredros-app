import React, { useEffect } from 'react';
import {invoke} from "@tauri-apps/api/core";
import { listen } from '@tauri-apps/api/event';
import { Button } from './ui/button';
import type {PySetupProgressType} from "../interfaces/PySetupProgressType.ts";

type PythonSetupProps = {
    pyProgress: PySetupProgressType;
    setPyProgress: React.Dispatch<React.SetStateAction<PySetupProgressType>>;
};


const PythonSetupComponent: React.FC<PythonSetupProps> = ({ pyProgress, setPyProgress }) => {

    const handleInitPython = async () => {
        try {
            await invoke('initialise_python_frontend_wrapper');
        } catch (err) {
            console.error('Failed to invoke Python init:', err);
            // setPyProgress({Error: err});
        }
    };

    useEffect(() => {
        const unlistenPromise = listen<PySetupProgressType>('py/setup-progress', (evt) => {
            let payload: PySetupProgressType;

            try {
                payload = JSON.parse(evt.payload as string);
            } catch {
                payload = evt.payload;
            }

            setPyProgress(payload);

            // DEBUG
            console.log(payload);
        });

        handleInitPython();

        return () => {
            unlistenPromise.then((unlisten) => unlisten());
        };
    }, []);

    const isThereAnError = () => {
        return typeof pyProgress === 'object' && 'Error' in pyProgress;
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <img
                className="h-22"
                src="/paredros_wordmark.png"
                alt="Paredros"
                style={{marginRight: '1px'}}
            />
            {pyProgress !== 'Idle' && (
                <div
                    className={`px-4 py-2 rounded text-sm max-w-md text-left
                ${isThereAnError()
                        ? 'bg-red-100 text-red-700 border border-red-400'
                        : 'bg-blue-100 text-blue-700 border border-blue-400'}
            `}
                >
                    {pyProgress === 'Checking' && '🔍 Checking environment...'}
                    {pyProgress === 'CreatingVenv' && '⚙️ Creating virtual environment...'}
                    {pyProgress === 'InstallingPackages' && '📦 Installing packages...'}
                    {pyProgress === 'Done' && '✅ Setup complete!'}
                    {typeof pyProgress === 'object' && 'Error' in pyProgress && <span style={{ whiteSpace: 'pre-wrap' }}>❌ An error occurred during setup: {pyProgress.Error} </span>}
                </div>
            )}
        </div>
    );
};

export default PythonSetupComponent;
