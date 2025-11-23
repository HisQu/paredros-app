/**
 * Interface for user settings that are persisted across sessions
 */
export interface UserSettings {
    // Expression editor settings
    showTokenLabels: boolean;
}

/**
 * Default values for user settings
 */
export const DEFAULT_USER_SETTINGS: UserSettings = {
    showTokenLabels: true,
};

