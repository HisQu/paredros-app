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

    // Grammar editor state
    const [editorContent, setEditorContent] = useState<string>("");

    // Load settings on mount
    useEffect(() => {
        const loadSettings = async () => {
            const showLabels = await getSetting('showTokenLabels');
            setShowTokenLabels(showLabels);
        };
        loadSettings();
    }, [getSetting]);

    // Save showTokenLabels setting when it changes
    useEffect(() => {
        setSetting('showTokenLabels', showTokenLabels);
    }, [showTokenLabels, setSetting]);

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
    };
}

