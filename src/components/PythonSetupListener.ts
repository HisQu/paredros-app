import { listen } from '@tauri-apps/api/event';
import { message } from '@tauri-apps/plugin-dialog';

export async function attachPythonProgressListener() {
    const unlisten = await listen<PySetupProgress>('py/setup-progress', ({ payload }) => {
        if (typeof payload === 'string') {
            console.log(`Python setup → ${payload}`);
        } else if ('Error' in payload) {
            message(`Python backend error:\n\n${payload.Error}`, {
                title: 'Python setup failed',
                kind: 'error'
            });
        }
    });

    return unlisten;
}