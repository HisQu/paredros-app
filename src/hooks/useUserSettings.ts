import { useCallback } from 'react';
import { Store } from '@tauri-apps/plugin-store';
import { UserSettings, DEFAULT_USER_SETTINGS } from '../interfaces/UserSettings';

const STORE_FILE = 'settings.json';

let storeInstance: Store | null = null;

/**
 * Get or create the store instance
 */
async function getStore(): Promise<Store> {
    if (!storeInstance) {
        storeInstance = await Store.load(STORE_FILE);
    }
    return storeInstance;
}

/**
 * Hook for managing persistent user settings using Tauri's Store plugin
 */
export function useUserSettings() {
    /**
     * Load a setting value from the store
     */
    const getSetting = useCallback(async <K extends keyof UserSettings>(
        key: K
    ): Promise<UserSettings[K]> => {
        try {
            const store = await getStore();
            const value = await store.get<UserSettings[K]>(key);
            return value ?? DEFAULT_USER_SETTINGS[key];
        } catch (error) {
            console.error(`Error loading setting ${String(key)}:`, error);
            return DEFAULT_USER_SETTINGS[key];
        }
    }, []);

    /**
     * Save a setting value to the store
     */
    const setSetting = useCallback(async <K extends keyof UserSettings>(
        key: K,
        value: UserSettings[K]
    ): Promise<void> => {
        try {
            const store = await getStore();
            await store.set(key, value);
            await store.save();
        } catch (error) {
            console.error(`Error saving setting ${String(key)}:`, error);
        }
    }, []);

    /**
     * Load all settings from the store
     */
    const loadAllSettings = useCallback(async (): Promise<UserSettings> => {
        try {
            const store = await getStore();
            const settings: UserSettings = { ...DEFAULT_USER_SETTINGS };

            for (const key of Object.keys(DEFAULT_USER_SETTINGS) as Array<keyof UserSettings>) {
                const value = await store.get<UserSettings[typeof key]>(key);
                if (value !== null && value !== undefined) {
                    settings[key] = value;
                }
            }

            return settings;
        } catch (error) {
            console.error('Error loading all settings:', error);
            return DEFAULT_USER_SETTINGS;
        }
    }, []);

    /**
     * Reset all settings to default values
     */
    const resetSettings = useCallback(async (): Promise<void> => {
        try {
            const store = await getStore();
            await store.clear();

            for (const [key, value] of Object.entries(DEFAULT_USER_SETTINGS)) {
                await store.set(key, value);
            }

            await store.save();
        } catch (error) {
            console.error('Error resetting settings:', error);
        }
    }, []);

    return {
        getSetting,
        setSetting,
        loadAllSettings,
        resetSettings,
    };
}

