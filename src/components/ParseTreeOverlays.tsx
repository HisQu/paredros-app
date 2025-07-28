import React from "react";
import {BeakerIcon, BoltIcon, FolderOpenIcon} from "@heroicons/react/24/outline";

interface OverlayProps {
    onClick: () => void;
}

const BigLoadGrammarOverlay: React.FC<OverlayProps> = ({onClick}) => {
    return (
        <div className="flex-1 text-center mt-12">
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
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No grammar loaded</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by loading a grammar.</p>
            <div className="mt-6">
                <button
                    type="button"
                    onClick={onClick}
                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    <FolderOpenIcon aria-hidden="true" className="mr-1.5 -ml-0.5 size-5"/>
                    Open Grammar file
                </button>
            </div>
        </div>
    )
}

const ParserInputOverlay: React.FC<OverlayProps> = ({onClick}) => {
    return (
        <div className="text-center text-xl bg-orange-100 h-full p-4">
            <button
                type="button"
                onClick={onClick}
                className="relative block w-full h-full rounded-lg border-2 border-dashed border-gray-300 p-48 text-center hover:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
            >
                <BoltIcon className="mx-auto size-12"/>
                <span className="mt-2 block font-semibold text-gray-900">
          The grammar has been changed.{' '}
                    <span className="underline decoration-4 underline-offset-2 decoration-dotted decoration-blue-700">
            Generate a new parser and parse the input.
          </span>
        </span>
            </button>
        </div>
    );
};

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
                <span className="mt-2 block text-sm font-semibold text-gray-900">Load a grammar file</span>
            </button>
        </div>
    )
}

export {BigLoadGrammarOverlay, ParserInputOverlay, ParseExpressionOverlay, GenerateParserOverlay, LoadGrammarOverlay};