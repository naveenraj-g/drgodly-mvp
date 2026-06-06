/**
 * POST /api/workflow/submit
 *
 * Executes the HTTP action for a workflow step — the form submission leg.
 * Calls the FHIR server directly using the URL declared in the step's action.
 *
 * Request body:
 *   { workflow, stepIndex, actionName, formData, sessionContext? }
 *
 * Response (success):
 *   { success: true, data, nextStepIndex: number | null, sessionContext }
 *
 * Response (failure):
 *   { success: false, error: string }
 */

import type { WorkflowDefinition } from "@/types/workflow";
import {
  getJWTToken,
  sortedSteps,
  resolveUrl,
  extractOutputs,
  cleanFormData,
} from "../_lib";
import { VALIDATION_SCHEMAS } from "@/modules/client/ai-hub/schemas/validation";

export async function POST(req: Request) {
  const {
    workflow,
    stepIndex,
    actionName,
    formData,
    sessionContext = {},
  }: {
    workflow: WorkflowDefinition;
    stepIndex: number;
    actionName: string;
    formData: Record<string, unknown>;
    sessionContext?: Record<string, unknown>;
  } = await req.json();

  const steps = sortedSteps(workflow.workflow_steps);
  const step = steps[stepIndex];

  if (!step) {
    return Response.json(
      { success: false, error: "Step not found" },
      { status: 404 },
    );
  }

  const action =
    step.actions?.find((a) => a.tool_name === actionName) ?? step.actions?.[0];

  if (!action) {
    return Response.json(
      { success: false, error: "No action defined for this step" },
      { status: 400 },
    );
  }

  try {
    const token = await getJWTToken();

    // A2UI forms serialise field values as a JSON string inside context.formData
    const rawFields =
      typeof formData.formData === "string"
        ? (JSON.parse(formData.formData) as Record<string, unknown>)
        : formData;

    const cleaned = cleanFormData(rawFields);

    let payload: Record<string, unknown> = cleaned;
    if (action.validation_schema && !action.iterate_key) {
      const schema = VALIDATION_SCHEMAS[action.validation_schema];
      if (schema) {
        const result = schema.safeParse({ ...sessionContext, ...cleaned });
        if (!result.success) {
          const message = result.error.issues.map((i) => i.message).join("; ");
          return Response.json({ success: false, error: message }, { status: 422 });
        }
        payload = result.data as Record<string, unknown>;
      }
    }

    const url = resolveUrl(action.url, { ...sessionContext, ...cleaned });

    // RepeatableGroup: loop over the array and POST each item individually
    if (action.iterate_key) {
      const items = Array.isArray(cleaned[action.iterate_key])
        ? (cleaned[action.iterate_key] as Record<string, unknown>[])
        : [];

      let lastData: Record<string, unknown> = {};
      for (const raw of items) {
        const item = cleanFormData(raw as Record<string, unknown>);
        if (Object.keys(item).length === 0) continue;

        let itemPayload: Record<string, unknown> = item;
        if (action.validation_schema) {
          const schema = VALIDATION_SCHEMAS[action.validation_schema];
          if (schema) {
            const result = schema.safeParse({ ...sessionContext, ...item });
            if (!result.success) {
              const message = result.error.issues.map((i) => i.message).join("; ");
              return Response.json({ success: false, error: message }, { status: 422 });
            }
            itemPayload = result.data as Record<string, unknown>;
          }
        }

        const itemRes = await fetch(url, {
          method: action.method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(itemPayload),
          cache: "no-store",
          signal: action.timeout_ms ? AbortSignal.timeout(action.timeout_ms) : undefined,
        });
        if (!itemRes.ok) {
          const errText = await itemRes.text();
          return Response.json({
            success: false,
            error: errText || `HTTP ${itemRes.status}`,
          });
        }
        lastData = await itemRes.json();
      }

      const outputs = step.context
        ? extractOutputs(step.context.outputs, lastData)
        : {};
      const updatedContext = { ...sessionContext, ...outputs };
      const nextStepIndex = stepIndex + 1 < steps.length ? stepIndex + 1 : null;
      return Response.json({
        success: true,
        data: lastData,
        nextStepIndex,
        sessionContext: updatedContext,
      });
    }

    const res = await fetch(url, {
      method: action.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: action.method !== "GET" ? JSON.stringify(payload) : undefined,
      cache: "no-store",
      signal: action.timeout_ms ? AbortSignal.timeout(action.timeout_ms) : undefined,
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json({
        success: false,
        error: errText || `HTTP ${res.status}`,
      });
    }

    const data: Record<string, unknown> = await res.json();

    const outputs = step.context
      ? extractOutputs(step.context.outputs, data)
      : {};
    const updatedContext = { ...sessionContext, ...cleaned, ...outputs };
    const nextStepIndex = stepIndex + 1 < steps.length ? stepIndex + 1 : null;

    return Response.json({
      success: true,
      data,
      nextStepIndex,
      sessionContext: updatedContext,
    });
  } catch (error) {
    console.error(
      `[workflow/submit] Step ${stepIndex} action "${actionName}" failed:`,
      error,
    );
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Submission failed",
      },
      { status: 500 },
    );
  }
}
