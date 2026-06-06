/**
 * POST /api/workflow/step
 *
 * Loads a specific step within an in-progress workflow session. Called by the
 * client after a successful form submission to advance to the next step, or
 * when the user skips an optional step.
 *
 * Request body:  { workflow: WorkflowDefinition, stepIndex: number, sessionContext?: Record<string, unknown> }
 * Response:      { type: "workflow_step", step, stepIndex, stepData, sessionContext }
 *             or { type: "error", message: string }
 */

import type { WorkflowDefinition } from "@/types/workflow";
import {
  getJWTToken,
  sortedSteps,
  runContextResolver,
  runContextResolvers,
  extractOutputs,
} from "../_lib";

export async function POST(req: Request) {
  const {
    workflow,
    stepIndex,
    sessionContext = {},
  }: {
    workflow: WorkflowDefinition;
    stepIndex: number;
    sessionContext?: Record<string, unknown>;
  } = await req.json();

  const steps = sortedSteps(workflow.workflow_steps);
  const step = steps[stepIndex];

  if (!step) {
    return Response.json(
      { type: "error", message: "Step not found" },
      { status: 404 },
    );
  }

  try {
    const token = await getJWTToken();
    let stepData: Record<string, unknown> = {};
    let mergedContext = { ...sessionContext };

    if (step.context_resolvers?.length) {
      stepData = await runContextResolvers(
        step.context_resolvers,
        mergedContext,
        token,
      );
      const extracted = step.context?.outputs
        ? extractOutputs(step.context.outputs, stepData)
        : {};
      mergedContext = { ...mergedContext, ...stepData, ...extracted };
    } else if (step.context_resolver) {
      stepData = await runContextResolver(
        step.context_resolver,
        mergedContext,
        token,
      );
      const extracted = step.context?.outputs
        ? extractOutputs(step.context.outputs, stepData)
        : {};
      mergedContext = { ...mergedContext, ...stepData, ...extracted };
    }

    return Response.json({
      type: "workflow_step",
      step,
      stepIndex,
      stepData,
      sessionContext: mergedContext,
    });
  } catch (error) {
    console.error(`[workflow/step] Failed to load step ${stepIndex}:`, error);
    return Response.json(
      { type: "error", message: "Failed to load step" },
      { status: 500 },
    );
  }
}
