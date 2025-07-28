type PySetupProgress =
    | 'Idle'
    | 'Checking'
    | 'CreatingVenv'
    | 'InstallingPackages'
    | 'Done'
    | { Error: string };