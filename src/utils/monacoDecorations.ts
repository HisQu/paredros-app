import { editor } from "monaco-editor";
import { GrammarRuleLocation, TokenInfo } from "../interfaces/UserGrammar";

/**
 * Converts a token to a Monaco Range object
 */
export function tokenToRange(monaco: any, model: any, token: TokenInfo) {
    const startPos = model.getPositionAt(token.startIndex);
    const endPos = model.getPositionAt(token.stopIndex + 1);
    return new monaco.Range(startPos.lineNumber, startPos.column, endPos.lineNumber, endPos.column);
}

/**
 * Creates decorations for grammar rule highlighting
 */
export function createGrammarRuleDecoration(
    monaco: any,
    model: editor.ITextModel,
    loc: GrammarRuleLocation
): editor.IModelDeltaDecoration[] {
    const full = model.getValue();
    let idx = (loc.content ?? '').length ? full.indexOf(loc.content) : -1;
    let fallbackLen = 0;

    if (idx === -1 && loc.content) {
        const firstNonEmpty = loc.content.split(/\r?\n/).find(l => l.trim().length > 0);
        if (firstNonEmpty) {
            idx = full.indexOf(firstNonEmpty);
            fallbackLen = firstNonEmpty.length;
        }
    }

    let range: any;
    if (idx !== -1) {
        const startPos = model.getPositionAt(idx);
        const endPos = model.getPositionAt(idx + (fallbackLen || loc.content.length));
        range = new monaco.Range(startPos.lineNumber, startPos.column, endPos.lineNumber, endPos.column);
    } else {
        const line = Math.min(Math.max(loc.start_line || 1, 1), model.getLineCount());
        range = new monaco.Range(line, 1, line, model.getLineMaxColumn(line));
    }

    return [{
        range,
        options: {
            className: 'rule-highlight',
            beforeContentClassName: 'rule-inline-hint',
        }
    }];
}

/**
 * Creates decorations for all tokens in the expression
 */
export function createTokenDecorations(
    monaco: any,
    model: editor.ITextModel,
    tokens: TokenInfo[],
    showLabels: boolean = true
): editor.IModelDeltaDecoration[] {
    const Stickiness = monaco.editor.TrackedRangeStickiness;
    const RulerLane = monaco.editor.OverviewRulerLane;

    const maxLabel = 80;
    const safe = (s: string) => (s ?? '').replace(/\s+/g, ' ').slice(0, maxLabel);

    return tokens.map((t, i) => {
        const range = tokenToRange(monaco, model, t);
        const label = safe(t.typeName || 'Token');

        return {
            range,
            options: {
                className: `token-highlight token-type-${i % 2}`,
                stickiness: Stickiness.AlwaysGrowsWhenTypingAtEdges,
                inlineClassNameAffectsLetterSpacing: true,

                ...(showLabels && {
                    after: {
                        content: ` ${label}  `,
                        inlineClassName: `token-inline-annotation`,
                    },
                }),

                hoverMessage: [
                    {
                        value:
                            `**${t.typeName || 'Token'}**\n\n` +
                            `line: ${t.line}, column: ${t.column}; ` +
                            `index: [${t.startIndex}..${t.stopIndex + 1}] (#${t.tokenIndex})`
                    }
                ],

                overviewRuler: {
                    color: 'rgba(180,180,255,0.6)',
                    position: RulerLane.Center,
                },
                minimap: { color: 'rgba(180,180,255,0.6)', position: 1 },
            }
        };
    });
}

/**
 * Creates decoration for the currently active token
 */
export function createCurrentTokenDecoration(
    monaco: any,
    model: editor.ITextModel,
    token: TokenInfo
): editor.IModelDeltaDecoration[] {
    const range = tokenToRange(monaco, model, token);

    return [{
        range,
        options: {
            className: 'token-type-active',
            stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        },
    }];
}

