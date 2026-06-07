/**
 * POST /api/workflow
 *
 * Entry point for the A2UI workflow system. Receives a plain-text user message,
 * forwards it to the external AI agent, and returns the first step of the
 * workflow the agent selected.
 *
 * Flow:
 *   1. Obtain a short-lived JWT and read the session for user_id / org_id.
 *   2. POST the user message to AGENT_API_URL with Bearer auth.
 *      The agent interprets intent and returns a WorkflowDefinition JSON.
 *   3. Sort workflow_steps by sequence_number and take step[0].
 *   4. Run context_resolvers for the first step (pre-fetch FHIR data).
 *   5. Return the full workflow + first step to the client.
 *
 * Request body:  { message: string, sessionContext?: Record<string, unknown> }
 * Response:      { type: "workflow_step", workflow, stepIndex, step, stepData, sessionContext }
 *             or { type: "error", message: string }
 */

import type { WorkflowDefinition } from "@/types/workflow";
import {
  getJWTToken,
  sortedSteps,
  runContextResolver,
  runContextResolvers,
  extractOutputs,
} from "./_lib";
import { getServerSession } from "@/modules/server/auth/get-session";

import create_patient from "../../../modules/client/ai-hub/workflows/patient/create_patient.json";

const AGENT_API_URL = process.env.AGENT_API_URL!;

export async function POST(req: Request) {
  const {
    message,
    sessionContext = {},
  }: { message: string; sessionContext?: Record<string, unknown> } =
    await req.json();

  if (!message?.trim()) {
    return Response.json(
      { type: "error", message: "Empty message" },
      { status: 400 },
    );
  }

  try {
    const [token, authSession] = await Promise.all([
      getJWTToken(),
      getServerSession(),
    ]);

    let workflow: WorkflowDefinition;

    if (AGENT_API_URL) {
      const agentRes = await fetch(AGENT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: message,
          session_id:
            (sessionContext.session_id as string | undefined) ??
            crypto.randomUUID(),
        }),
        cache: "no-store",
      });

      if (!agentRes.ok) {
        console.log(agentRes);
        throw new Error(`Agent API error: ${agentRes.status}`);
      }

      workflow = await agentRes.json();
      console.log(workflow);
    } else {
      // Fallback: load a default workflow when no agent is configured
      const { default: fallback } =
        await import("@/modules/client/ai-hub/workflows/orders/create_service_request.json");
      workflow = fallback as WorkflowDefinition;
    }

    const steps = sortedSteps(workflow.workflow_steps);
    const firstStep = steps[0];

    if (!firstStep) {
      return Response.json(
        { type: "error", message: "Workflow has no steps" },
        { status: 500 },
      );
    }

    let stepData: Record<string, unknown> = {};
    let mergedContext: Record<string, unknown> = {
      ...sessionContext,
      ...(authSession?.user?.id ? { user_id: authSession.user.id } : {}),
      ...(authSession?.session?.activeOrganizationId
        ? { org_id: authSession.session.activeOrganizationId }
        : {}),
    };

    if (firstStep.context_resolvers?.length) {
      stepData = await runContextResolvers(
        firstStep.context_resolvers,
        mergedContext,
        token,
      );
      const extracted = firstStep.context?.outputs
        ? extractOutputs(firstStep.context.outputs, stepData)
        : {};
      mergedContext = { ...mergedContext, ...stepData, ...extracted };
    } else if (firstStep.context_resolver) {
      stepData = await runContextResolver(
        firstStep.context_resolver,
        mergedContext,
        token,
      );
      const extracted = firstStep.context?.outputs
        ? extractOutputs(firstStep.context.outputs, stepData)
        : {};
      mergedContext = { ...mergedContext, ...stepData, ...extracted };
    }

    return Response.json({
      type: "workflow_step",
      workflow,
      stepIndex: 0,
      step: firstStep,
      stepData,
      sessionContext: mergedContext,
    });
  } catch (error) {
    console.error("[workflow] Failed to start workflow:", error);
    return Response.json(
      { type: "error", message: "Failed to start workflow" },
      { status: 500 },
    );
  }
}
