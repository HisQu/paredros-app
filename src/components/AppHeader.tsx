export function AppHeader() {
    return (
        <header className="shrink-0 pr-0 border-b border-zinc-200 h-16">
            <div className="flex items-center gap-4 h-full">
                {/* Left content (logos + subtitle) */}
                <div className="flex items-center pl-4">
                    <div className="flex items-center">
                        <img
                            className="h-22"
                            src="/paredros_wordmark.png"
                            alt="Paredros Icon"
                            style={{ marginRight: '1px' }}
                        />
                    </div>

                    <span className="text-sm underline decoration-dotted decoration-blue-700 decoration-2 underline-offset-2 whitespace-nowrap">
                        Grammar debugging environment
                    </span>
                </div>
            </div>
        </header>
    );
}

