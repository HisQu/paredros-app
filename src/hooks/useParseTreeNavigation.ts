import { invoke } from "@tauri-apps/api/core";
import { AppState } from "./useAppState";

export function useParseTreeNavigation(
    appState: AppState,
    get_json_parse_tree: () => Promise<void>
) {
    const {parseState} = appState;

    async function stepForwards() {
        console.log("Step Forwards");

        await invoke("step_forwards", {id: parseState.parseInfo, step: 1});
        await get_json_parse_tree();
    }

    async function stepBackwards() {
        console.log("Step Backwards");

        await invoke("step_backwards", {id: parseState.parseInfo});
        await get_json_parse_tree();
    }

    async function stepToLastDecision() {
        console.log("stepToLastDecision");

        await invoke("step_back_until_previous_decision", {id: parseState.parseInfo});
        await get_json_parse_tree();
    }

    async function stepToNextDecision() {
        console.log("stepToNextDecision");

        await invoke("step_until_next_decision", {id: parseState.parseInfo});
        await get_json_parse_tree();
    }

    async function go_to_step(step_id: number) {
        console.log("go_to_step", step_id);

        await invoke("go_to_step", {
            id: parseState.parseInfo,
            stepId: step_id,
        });

        await get_json_parse_tree();
    }

    return {
        stepForwards,
        stepBackwards,
        stepToLastDecision,
        stepToNextDecision,
        go_to_step,
    }
}

