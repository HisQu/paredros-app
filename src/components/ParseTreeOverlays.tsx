import React from "react";
import {ArrowRightIcon, BeakerIcon, BoltIcon, FolderOpenIcon} from "@heroicons/react/24/outline";
import {Button} from "./ui/button";

interface OverlayProps {
    onClick: () => void;
}

const BigLoadGrammarOverlay: React.FC<OverlayProps> = ({onClick}) => {
    return (
        <div className="flex flex-col flex-1 items-center justify-center text-center p-6">
            <img
                className="h-22"
                src="/paredros_wordmark.png"
                alt="Paredros"
                style={{marginRight: '1px'}}
            />

            <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="mx-auto size-12 text-gray-400"
            >
                <path
                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                    strokeWidth={2}
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            <h3 className="mt-4 text-sm font-semibold text-gray-900">
                Open a Grammar Directory
            </h3>

            <p className="mt-1 text-sm text-gray-500">
                Get started by selecting a directory containing your grammar files.
            </p>

            <div className="mt-6">
                <Button onClick={onClick} color={"lime"}>
                    <FolderOpenIcon aria-hidden="true" className="mr-2 size-5" />
                    Open Grammar Directory
                </Button>
            </div>

            <div className="mt-8 max-w-md text-left">
                <h4 className="text-xs font-semibold text-gray-700 mb-2">
                    <i>Hint!</i>
                </h4>
                <p className="text-xs text-gray-400 mb-2">
                    The app will automatically detect your main grammar file by looking for:
                </p>
                <ul className="text-xs text-gray-400 space-y-1 ml-4 list-disc">
                    <li>A rule named <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700">startRule</code></li>
                    <li>A comment containing <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700">// main file</code></li>
                </ul>
                <p className="text-xs text-gray-400 mt-3">
                    <strong>Note:</strong> The first rule in your grammar will be used as the entry point for parsing.
                </p>
            </div>

        </div>
    );
}

const ParseExpressionOverlay: React.FC<OverlayProps> = ({onClick}) => {
    return (
        <div className="text-center text-xl bg-orange-100 h-full p-4">
            <button
                type="button"
                onClick={onClick}
                className="relative block w-full h-full rounded-lg border-2 border-dashed border-gray-300 p-48 text-center hover:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
            >
                <BoltIcon className="mx-auto size-12"/>
                <span className="mt-2 block font-semibold text-gray-900">Now, you can <span
                    className="underline decoration-4 underline-offset-2 decoration-dotted decoration-blue-700">parse the expression</span></span>
            </button>
        </div>
    )
}

const ExpressionChangedOverlay: React.FC<OverlayProps> = ({onClick}) => {
    return (
        <div className="text-center text-xl bg-orange-100 h-full p-4">
            <button
                type="button"
                onClick={onClick}
                className="relative block w-full h-full rounded-lg border-2 border-dashed border-gray-300 p-48 text-center hover:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
            >
                <BoltIcon className="mx-auto size-12"/>
                <span className="mt-2 block font-semibold text-gray-900">The expression has changed. <span
                    className="underline decoration-4 underline-offset-2 decoration-dotted decoration-blue-700">You need to re-parse the expression.</span></span>
            </button>
        </div>
    )
}

const GenerateParserOverlay: React.FC<OverlayProps> = ({onClick}) => {
    return (<div className="text-center text-xl bg-green-100 h-full p-4">
        <button
            type="button"
            onClick={onClick}
            className="relative block w-full h-full rounded-lg border-2 border-dashed border-gray-300 p-48 text-center hover:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden">
            <BeakerIcon className="mx-auto size-12"/>
            <span
                className="mt-2 block font-semibold text-gray-900">The next step is to <span
                className="underline decoration-4 underline-offset-2 decoration-dotted decoration-blue-700">generate the parser</span></span>
        </button>
    </div>)
}

const LoadGrammarOverlay: React.FC<OverlayProps> = ({onClick}) => {
    return (
        <div className="text-center text-xl bg-blue-200 h-full p-4">
            <button
                type="button"
                onClick={onClick}
                className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
            >
                <FolderOpenIcon className="mx-auto size-12"/>
                <span className="mt-2 block text-sm font-semibold text-gray-900">Load a grammar directory</span>
            </button>
        </div>
    )
}

interface SelectGrammarFileProps {
    files: Array<{name: string, isMainFile: boolean}>;
    onSelect: (fileName: string) => void;
}

const SelectGrammarFileOverlay: React.FC<SelectGrammarFileProps> = ({ files, onSelect }) => {
    return (
        <div className="flex flex-col flex-1 items-center justify-center text-center p-6">
            <img
                className="h-22"
                src="/paredros_wordmark.png"
                alt="Paredros"
                style={{ marginRight: "1px" }}
            />

            <h3 className="mt-4 text-sm font-semibold text-gray-900">
                Select Main Grammar File
            </h3>

            <p className="mt-1 text-sm text-gray-500">
                Multiple grammar files found. Please select the{" "}
                <span className="underline decoration-2 underline-offset-2 decoration-dotted decoration-blue-700">
                    main grammar file
                </span>
                .
            </p>

            <div className="mt-6 w-full max-w-md space-y-3 text-left">
                {files.map((file) => (
                    <button
                        key={file.name}
                        type="button"
                        onClick={() => onSelect(file.name)}
                        className={`flex w-full items-center justify-between rounded-lg border border-dashed px-4 py-3 text-sm font-medium transition ${
                            file.isMainFile 
                                ? 'border-lime-400 bg-lime-50 text-gray-900 hover:border-lime-500 hover:bg-lime-100' 
                                : 'border-gray-300 text-gray-900 hover:border-gray-400 hover:bg-gray-50'
                        } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-2`}
                    >
                        <div className="flex items-center gap-2 truncate">
                            <span className="truncate">{file.name}</span>
                            {file.isMainFile && (
                                <span className="inline-flex items-center rounded-full bg-lime-500 px-2 py-0.5 text-xs font-medium text-white">
                                    Main
                                </span>
                            )}
                        </div>
                        <ArrowRightIcon
                            aria-hidden="true"
                            className={`ml-3 size-5 flex-shrink-0 ${file.isMainFile ? 'text-lime-600' : 'text-gray-400'}`}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};


const NoGrammarFilesOverlay: React.FC<OverlayProps> = ({onClick}) => {
    return (
        <div className="flex flex-col flex-1 items-center justify-center text-center p-6">
            <img
                className="h-22"
                src="/paredros_wordmark.png"
                alt="Paredros"
                style={{marginRight: '1px'}}
            />

            <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="mx-auto size-12 text-red-400 mt-4"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
            </svg>

            <h3 className="mt-4 text-sm font-semibold text-gray-900">
                No Grammar Files Found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
                The selected directory does not contain any{" "}
                <span className="underline decoration-2 underline-offset-2 decoration-dotted decoration-blue-700">
                    ANTLR4 grammar files (.g4)
                </span>
                .
            </p>

            <p className="mt-2 text-sm text-gray-500">
                Please select a different directory that contains your grammar files.
            </p>

            <div className="mt-6">
                <Button onClick={onClick} color={"lime"}>
                    <FolderOpenIcon aria-hidden="true" className="mr-2 size-5" />
                    Select Different Directory
                </Button>
            </div>

            <div className="mt-8 max-w-md text-left">
                <h4 className="text-xs font-semibold text-gray-900 mb-2">
                    Main Grammar File Detection
                </h4>
                <p className="text-xs text-gray-600 mb-2">
                    The app will automatically detect your main grammar file by looking for:
                </p>
                <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                    <li>A rule named <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-900">startRule</code></li>
                    <li>A comment containing <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-900">// main file</code></li>
                </ul>
                <p className="text-xs text-gray-600 mt-3">
                    <strong>Note:</strong> The first rule in your grammar will be used as the entry point for parsing.
                </p>
            </div>
        </div>
    );
}

export {BigLoadGrammarOverlay, ParseExpressionOverlay, GenerateParserOverlay, LoadGrammarOverlay, ExpressionChangedOverlay, SelectGrammarFileOverlay, NoGrammarFilesOverlay};
