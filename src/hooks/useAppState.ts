import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { ParseStepInfo, TokenInfo, UserGrammar } from "../interfaces/UserGrammar";
import { ParseTreeNode } from "../interfaces/ParseTreeNode";
import { PySetupProgressType } from "../interfaces/PySetupProgressType";
import { Edge } from "@xyflow/react";
import { useUserSettings } from "./useUserSettings";

export interface AppState {
    pyState: {
        pyProgress: PySetupProgressType;
        setPyProgress: Dispatch<SetStateAction<PySetupProgressType>>;
    };
    grammarState: {
        activeFileIndex: string | undefined;
        setActiveFileIndex: Dispatch<SetStateAction<string | undefined>>;
        grammarFileLocation: string;
        setGrammarFileLocation: Dispatch<SetStateAction<string>>;
        grammarDirectory: string;
        setGrammarDirectory: Dispatch<SetStateAction<string>>;
        availableGrammarFiles: Array<{ name: string; isMainFile: boolean }>;
        setAvailableGrammarFiles: Dispatch<SetStateAction<Array<{ name: string; isMainFile: boolean }>>>;
        noGrammarFilesFound: boolean;
        setNoGrammarFilesFound: Dispatch<SetStateAction<boolean>>;
        userGrammar: UserGrammar | undefined;
        setUserGrammar: Dispatch<SetStateAction<UserGrammar | undefined>>;
    };
    parseState: {
        parseInfo: string | undefined;
        setParseInfo: Dispatch<SetStateAction<string | undefined>>;
        generateParserResult: string | undefined;
        setGenerateParserResult: Dispatch<SetStateAction<string | undefined>>;
        nodes: ParseTreeNode[] | undefined;
        setNodes: Dispatch<SetStateAction<ParseTreeNode[] | undefined>>;
        edges: Edge[] | undefined;
        setEdges: Dispatch<SetStateAction<Edge[] | undefined>>;
        parseStepInfo: ParseStepInfo | undefined;
        setParseStepInfo: Dispatch<SetStateAction<ParseStepInfo | undefined>>;
        nextInfo: ParseStepInfo | undefined;
        setNextInfo: Dispatch<SetStateAction<ParseStepInfo | undefined>>;
        lexemes: TokenInfo[] | undefined;
        setLexemes: Dispatch<SetStateAction<TokenInfo[] | undefined>>;
        followParser: boolean;
        setFollowParser: Dispatch<SetStateAction<boolean>>;
        isGeneratingParser: boolean;
        setIsGeneratingParser: Dispatch<SetStateAction<boolean>>;
        isParsingExpression: boolean;
        setIsParsingExpression: Dispatch<SetStateAction<boolean>>;
    };
    expressionState: {
        expressionContent: string;
        setExpressionContent: Dispatch<SetStateAction<string>>;
        expressionChanged: boolean;
        setExpressionChanged: Dispatch<SetStateAction<boolean>>;
        expressionLanguage: string;
        setExpressionLanguage: Dispatch<SetStateAction<string>>;
        showTokenLabels: boolean;
        setShowTokenLabels: Dispatch<SetStateAction<boolean>>;
    };
    editorState: {
        editorContent: string;
        setEditorContent: Dispatch<SetStateAction<string>>;
    };
    flowLayoutState: {
        flowLayoutDirection: 'TB' | 'LR';
        setFlowLayoutDirection: Dispatch<SetStateAction<'TB' | 'LR'>>;
        autoCenterActiveNode: boolean;
        setAutoCenterActiveNode: Dispatch<SetStateAction<boolean>>;
    };
}

export function useAppState(): AppState {
    const { getSetting, setSetting } = useUserSettings();

    // Python initialization progress
    const [pyProgress, setPyProgress] = useState<PySetupProgressType>('Idle');

    // Grammar-related state
    const [activeFileIndex, setActiveFileIndex] = useState<string | undefined>();
    const [grammarFileLocation, setGrammarFileLocation] = useState("");
    const [grammarDirectory, setGrammarDirectory] = useState<string>("");
    const [availableGrammarFiles, setAvailableGrammarFiles] = useState<Array<{ name: string; isMainFile: boolean }>>([]);
    const [noGrammarFilesFound, setNoGrammarFilesFound] = useState(false);
    const [userGrammar, setUserGrammar] = useState<UserGrammar>();

    // Parse-related state
    const [parseInfo, setParseInfo] = useState<string | undefined>();
    const [generateParserResult, setGenerateParserResult] = useState<string | undefined>();
    const [nodes, setNodes] = useState<ParseTreeNode[]>();
    const [edges, setEdges] = useState<Edge[]>();
    const [parseStepInfo, setParseStepInfo] = useState<ParseStepInfo>();
    const [nextInfo, setNextInfo] = useState<ParseStepInfo>();
    const [lexemes, setLexemes] = useState<TokenInfo[]>();
    const [followParser, setFollowParser] = useState<boolean>(false);
    const [isGeneratingParser, setIsGeneratingParser] = useState<boolean>(false);
    const [isParsingExpression, setIsParsingExpression] = useState<boolean>(false);

    // Expression editor state
    const [expressionContent, setExpressionContent] = useState<string>("");
    const [expressionChanged, setExpressionChanged] = useState<boolean>(false);
    const [expressionLanguage, setExpressionLanguage] = useState<string>("xml");
    const [showTokenLabels, setShowTokenLabels] = useState<boolean>(true);
    const [settingsInitialized, setSettingsInitialized] = useState<boolean>(false);

    // Grammar editor state
    const [editorContent, setEditorContent] = useState<string>("");

    // Flow layout state
    const [flowLayoutDirection, setFlowLayoutDirection] = useState<'TB' | 'LR'>('TB');
    const [autoCenterActiveNode, setAutoCenterActiveNode] = useState<boolean>(true);

    // Load settings on mount
    useEffect(() => {
        const loadSettings = async () => {
            console.log('[AppState] Loading settings...');
            const showLabels = await getSetting('showTokenLabels');
            console.log('[AppState] Loaded showTokenLabels:', showLabels);
            setShowTokenLabels(showLabels);

            const flowLayout = await getSetting('flowLayoutDirection');
            console.log('[AppState] Loaded flowLayoutDirection:', flowLayout);
            setFlowLayoutDirection(flowLayout);

            const autoCenter = await getSetting('autoCenterActiveNode');
            console.log('[AppState] Loaded autoCenterActiveNode:', autoCenter);
            setAutoCenterActiveNode(autoCenter);

            setSettingsInitialized(true);
            console.log('[AppState] Settings initialized');
        };
        loadSettings();
    }, [getSetting]);

    // Save showTokenLabels setting when it changes (but not on initial load)
    useEffect(() => {
        if (settingsInitialized) {
            console.log('[AppState] Saving showTokenLabels:', showTokenLabels);
            setSetting('showTokenLabels', showTokenLabels);
        } else {
            console.log('[AppState] Skipping save (not initialized yet)');
        }
    }, [showTokenLabels, setSetting, settingsInitialized]);

    // Save flowLayoutDirection setting when it changes (but not on initial load)
    useEffect(() => {
        if (settingsInitialized) {
            console.log('[AppState] Saving flowLayoutDirection:', flowLayoutDirection);
            setSetting('flowLayoutDirection', flowLayoutDirection);
        }
    }, [flowLayoutDirection, setSetting, settingsInitialized]);

    // Save autoCenterActiveNode setting when it changes (but not on initial load)
    useEffect(() => {
        if (settingsInitialized) {
            console.log('[AppState] Saving autoCenterActiveNode:', autoCenterActiveNode);
            setSetting('autoCenterActiveNode', autoCenterActiveNode);
        }
    }, [autoCenterActiveNode, setSetting, settingsInitialized]);

    return {
        pyState: { pyProgress, setPyProgress },
        grammarState: {
            activeFileIndex,
            setActiveFileIndex,
            grammarFileLocation,
            setGrammarFileLocation,
            grammarDirectory,
            setGrammarDirectory,
            availableGrammarFiles,
            setAvailableGrammarFiles,
            noGrammarFilesFound,
            setNoGrammarFilesFound,
            userGrammar,
            setUserGrammar,
        },
        parseState: {
            parseInfo,
            setParseInfo,
            generateParserResult,
            setGenerateParserResult,
            nodes,
            setNodes,
            edges,
            setEdges,
            parseStepInfo,
            setParseStepInfo,
            nextInfo,
            setNextInfo,
            lexemes,
            setLexemes,
            followParser,
            setFollowParser,
            isGeneratingParser,
            setIsGeneratingParser,
            isParsingExpression,
            setIsParsingExpression,
        },
        expressionState: {
            expressionContent,
            setExpressionContent,
            expressionChanged,
            setExpressionChanged,
            expressionLanguage,
            setExpressionLanguage,
            showTokenLabels,
            setShowTokenLabels,
        },
        editorState: {
            editorContent,
            setEditorContent,
        },
        flowLayoutState: {
            flowLayoutDirection,
            setFlowLayoutDirection,
            autoCenterActiveNode,
            setAutoCenterActiveNode,
        },
    };
}

