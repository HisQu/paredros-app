export type PySetupProgressType =
    | 'Idle'
    | 'Checking'
    | 'CreatingVenv'
    | 'InstallingPackages'
    | 'Done'
    | { Error: string };