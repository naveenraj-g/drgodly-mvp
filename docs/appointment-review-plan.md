# Appointment Review Page — Implementation Plan

## Overview

After a doctor ends a consultation, the AI generates a full structured report containing `soap`, `assessment`, and `clinicalExtraction` sections. The doctor is routed to `/bezs/telemedicine/doctor/appointments/[appointmentId]` where they review, edit, and confirm everything before it is stored as proper FHIR medical records.

**Two storage concerns:**
- `AppointmentActual.doctorReport` → the final approved SOAP (shown to patient/reports)
- `AppointmentActual.fullReport` → staging area for the raw AI output (already in schema)

**After doctor confirms**, data saves to:
- Updated `AppointmentActual.doctorReport` (edited SOAP)
- New `Condition` records
- New `Observation` records
- New `MedicationRequest` records
- New `ServiceRequest` records (all with `isDoctorAccepted: true` since doctor confirmed)

---

## Phase 1 — Backend Prep (Small, Required Before UI)

### 1.1 Update `completeConsultation` repository

**File:** `src/modules/server/telemedicine/infrastructure/repositories/appointmentRepository.ts`  
**Line ~1519** — the `upsert` on `AppointmentActual` currently saves the full AI JSON to `doctorReport`.

Change to save:
- `doctorReport` → only the `soap` section (what the repo comment says it should be)
- `fullReport` → the entire AI JSON (staging area; already exists as `Json?` in schema)

```typescript
await tx.appointmentActual.upsert({
  where: { appointmentId },
  create: {
    appointmentId,
    orgId,
    doctorReport: doctorReport?.soap ?? null,
    fullReport: doctorReport ?? null,          // full AI JSON → staging
  },
  update: {
    doctorReport: doctorReport?.soap ?? null,
    fullReport: doctorReport ?? null,
    updatedBy: userId,
  },
});
```

No schema migration needed — `fullReport Json?` already exists.

### 1.2 New server action: `getAppointmentReview`

**File:** `src/modules/client/telemedicine/server-actions/appointment-action.ts`

New exported server action (not via ZSA, plain async function is fine since it's server-only):

```typescript
export async function getAppointmentReview(appointmentId: string) {
  const actual = await prismaTelemedicine.appointmentActual.findUnique({
    where: { appointmentId },
    select: {
      doctorReport: true,
      fullReport: true,
      appointment: {
        select: {
          id: true,
          orgId: true,
          appointmentDate: true,
          patient: { select: { personal: { select: { fullName: true } } } },
          doctor: { select: { personal: { select: { fullName: true } } } },
        },
      },
    },
  });
  return actual;
}
```

### 1.3 Terminology API proxy routes (Next.js)

Instead of calling the terminology service directly from the browser (CORS risk), create two thin Next.js API routes that proxy to `process.env.TERMINOLOGY_SERVICE_URL` (server-side, no `NEXT_PUBLIC_`).

**Files to create:**
- `src/app/api/terminology/search/route.ts`
- `src/app/api/terminology/concepts/route.ts`

**Search proxy:**
```typescript
// GET /api/terminology/search?q=...&system=...&limit=20
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const base = process.env.TERMINOLOGY_SERVICE_URL;
  const upstream = `${base}/api/v1/terminology/search?${searchParams}`;
  const res = await fetch(upstream, { cache: "no-store" });
  const data = await res.json();
  return Response.json(data);
}
```

**Concepts proxy:**
```typescript
// GET /api/terminology/concepts?resource=...&field=...
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const base = process.env.TERMINOLOGY_SERVICE_URL;
  const upstream = `${base}/api/v1/terminology/concepts?${searchParams}`;
  const res = await fetch(upstream, { cache: "force-cache" }); // enums rarely change
  const data = await res.json();
  return Response.json(data);
}
```

---

## Phase 2 — UI Components

### 2.1 Page entry point

**File:** `src/app/[locale]/bezs/telemedicine/doctor/appointments/[appointmentId]/page.tsx`

```tsx
import { getAppointmentReview } from "@/modules/client/telemedicine/server-actions/appointment-action";
import { AppointmentReview } from "@/modules/client/telemedicine/components/doctor/appointment-review/AppointmentReview";

export default async function AppointmentIdPage({ params }) {
  const { appointmentId } = await params;
  const data = await getAppointmentReview(appointmentId);
  return <AppointmentReview data={data} appointmentId={appointmentId} />;
}
```

For Phase 2 UI dev, `AppointmentReview` can accept mock data so the page works without real appointment IDs.

---

### 2.2 Component folder structure

```
src/modules/client/telemedicine/components/doctor/appointment-review/
├── AppointmentReview.tsx             # Main container — owns all state
├── types.ts                          # Shared TS types for this feature
│
├── soap/
│   ├── SoapEditor.tsx                # Card wrapper, sections inside
│   ├── SubjectiveSection.tsx         # chief_complaint, HPI, symptoms chips
│   ├── ObjectiveSection.tsx          # observations list (editable)
│   ├── AssessmentSection.tsx         # possible_conditions list, clinical_reasoning
│   └── PlanSection.tsx               # next_steps list, when_to_seek_care, summary
│
├── clinical/
│   ├── ClinicalExtractionPanel.tsx   # Tabs: Conditions | Observations | Medications | Orders
│   ├── conditions/
│   │   ├── ConditionList.tsx
│   │   └── ConditionItem.tsx
│   ├── observations/
│   │   ├── ObservationList.tsx
│   │   └── ObservationItem.tsx
│   ├── medications/
│   │   ├── MedicationList.tsx
│   │   └── MedicationItem.tsx
│   └── service-requests/
│       ├── ServiceRequestList.tsx
│       └── ServiceRequestItem.tsx
│
└── shared/
    ├── TerminologyCombobox.tsx       # Debounced terminology search combobox
    ├── ConceptSelect.tsx             # Enum/coded-value select (client-side search)
    └── EditableList.tsx              # Reusable add/remove string list
```

---

### 2.3 `types.ts`

```typescript
export interface StagingReport {
  soap: SoapNote;
  assessment: ClinicalAssessment;
  clinicalExtraction: ClinicalExtraction;
}

export interface SoapNote {
  subjective: {
    chief_complaint: string;
    history_of_present_illness: string;
    associated_symptoms: string[];
  };
  objective: { observations: string[] };
  assessment: { possible_conditions: string[]; clinical_reasoning: string };
  plan: { next_steps: string[]; when_to_seek_care: string };
  summary: string;
}

export interface ClinicalExtraction {
  conditions: AiCondition[];
  observations: AiObservation[];
  medicationRequests: AiMedicationRequest[];
  serviceRequests: AiServiceRequest[];
}

export interface AiCondition {
  display: string;
  terminologySystem: string; // "SNOMED" | "ICD-10" | etc.
}

export interface AiObservation {
  display: string;
  terminologySystem: string;
  value: string | null;
  unit: string | null;
}

export interface AiMedicationRequest {
  display: string;
  terminologySystem: string;
  dose: string | null;
  frequency: string | null;
  duration: string | null;
  route: string | null;
}

export interface AiServiceRequest {
  display: string;
  terminologySystem: string;
}

// What the doctor edits — adds resolved codes
export interface ResolvedConcept {
  code: string;
  system: string;
  display: string;
}

export interface ConditionFormItem extends AiCondition {
  id: string;           // local uuid for list key
  resolved?: ResolvedConcept;
  clinicalStatus?: string;       // code from ConceptSelect
  verificationStatus?: string;
}

export interface ObservationFormItem extends AiObservation {
  id: string;
  resolved?: ResolvedConcept;
  status?: string;
  editedValue?: string;
  editedUnit?: string;
}

export interface MedicationFormItem extends AiMedicationRequest {
  id: string;
  resolved?: ResolvedConcept;
  status?: string;
  intent?: string;
  editedDose?: string;
  editedFrequency?: string;
  editedDuration?: string;
  editedRoute?: string;
}

export interface ServiceRequestFormItem extends AiServiceRequest {
  id: string;
  resolved?: ResolvedConcept;
  status?: string;
  intent?: string;
  priority?: string;
}
```

---

### 2.4 `AppointmentReview.tsx`

Top-level client component. Responsibilities:
- Initialize `soapState` from `data.fullReport.soap`
- Initialize 4 clinical lists from `data.fullReport.clinicalExtraction.*`
- Pass state + setters down to sub-components
- Render layout: header + two-column (SOAP left, clinical right)
- "Confirm & Save" button at bottom — calls `submitClinicalReview` (Phase 3)

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  Patient: John Doe   Date: 2026-06-06   Dr. Smith   │
│                                    [Confirm & Save]  │
├────────────────────┬────────────────────────────────┤
│                    │  Tabs: Conditions | Obs |       │
│   SOAP Editor      │  Medications | Service Requests │
│                    │                                 │
│  [Subjective]      │  ┌─────────────────────────┐   │
│  [Objective]       │  │ AI: URTI (SNOMED)       │   │
│  [Assessment]      │  │ Search: [_____________]  │   │
│  [Plan]            │  │ Status: [__select_____]  │   │
│  [Summary]         │  │ Verification: [_select_] │   │
│                    │  └─────────────────────────┘   │
└────────────────────┴────────────────────────────────┘
```

---

### 2.5 `SoapEditor.tsx`

Accordion card with 5 collapsible sections. Each section receives slice of `soapState` and setter.

```tsx
<Accordion type="multiple" defaultValue={["subjective","objective","assessment","plan","summary"]}>
  <SubjectiveSection data={soap.subjective} onChange={...} />
  <ObjectiveSection data={soap.objective} onChange={...} />
  <AssessmentSection data={soap.assessment} onChange={...} />
  <PlanSection data={soap.plan} onChange={...} />
  {/* summary as textarea in PlanSection or its own accordion item */}
</Accordion>
```

**SubjectiveSection fields:**
- `chief_complaint` → `<Input>`
- `history_of_present_illness` → `<Textarea>`
- `associated_symptoms` → `<EditableList>` (chip-style add/remove)

**ObjectiveSection fields:**
- `observations` → `<EditableList>` (one text input per item, add/remove)

**AssessmentSection fields:**
- `possible_conditions` → `<EditableList>`
- `clinical_reasoning` → `<Textarea>`

**PlanSection fields:**
- `next_steps` → `<EditableList>`
- `when_to_seek_care` → `<Input>`
- `summary` → `<Textarea>` (shown at bottom, labeled "Clinical Summary")

---

### 2.6 `EditableList.tsx`

Generic reusable component for a list of strings with add/remove:

```tsx
// Props
interface EditableListProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}
```

Renders: existing items with `<Input>` + remove `×` button each; an "Add" button at bottom.

---

### 2.7 `ClinicalExtractionPanel.tsx`

Tabs component with 4 tabs. Each tab renders its `*List` component.

```tsx
<Tabs defaultValue="conditions">
  <TabsList>
    <TabsTrigger value="conditions">Conditions ({conditions.length})</TabsTrigger>
    <TabsTrigger value="observations">Observations ({observations.length})</TabsTrigger>
    <TabsTrigger value="medications">Medications ({medications.length})</TabsTrigger>
    <TabsTrigger value="serviceRequests">Service Requests ({serviceRequests.length})</TabsTrigger>
  </TabsList>
  <TabsContent value="conditions">
    <ConditionList items={conditions} onChange={setConditions} />
  </TabsContent>
  {/* ... */}
</Tabs>
```

---

### 2.8 Clinical Item Components

All four `*Item` components share the same visual pattern:
1. **AI suggestion header** — badge with AI icon + original display text
2. **TerminologyCombobox** — pre-searched with AI display, doctor can confirm or override
3. **ConceptSelect(s)** — for status/intent/priority fields
4. **Extra fields** specific to each type
5. **Remove button** — trash icon top-right

#### `ConditionItem.tsx`
```
[AI] Upper Respiratory Tract Infection (SNOMED)
Terminology: [Search SNOMED ────────────────── ▼]  ← auto-searched on mount
Clinical Status: [Select ────────────── ▼]
Verification:    [Select ────────────── ▼]
                                           [🗑]
```

- TerminologyCombobox `system="http://snomed.info/sct"`
- ConceptSelect `resource="Condition" field="clinicalStatus"` (values: active | recurrence | inactive | remission | resolved)
- ConceptSelect `resource="Condition" field="verificationStatus"` (values: unconfirmed | provisional | confirmed | refuted)

#### `ObservationItem.tsx`
```
[AI] Temperature (LOINC)
Terminology: [Search LOINC ────────────────── ▼]
Value: [101.2]   Unit: [F]
Status: [Select ────── ▼]
                                               [🗑]
```

- TerminologyCombobox `system="http://loinc.org"`
- `<Input>` for editedValue (pre-filled from AI `value`)
- `<Input>` for editedUnit (pre-filled from AI `unit`)
- ConceptSelect `resource="Observation" field="status"`

#### `MedicationItem.tsx`
```
[AI] Amoxicillin (RXNORM)
Terminology: [Search RxNorm ───────────────── ▼]
Dose:      [500 mg]    Route:     [Oral]
Frequency: [Three times daily]
Duration:  [7 days]
Status:  [Select ─ ▼]   Intent: [Select ─ ▼]
                                               [🗑]
```

- TerminologyCombobox `system="http://www.nlm.nih.gov/research/umls/rxnorm"`
- `<Input>` for dose, frequency, duration, route (all pre-filled from AI)
- ConceptSelect `resource="MedicationRequest" field="status"`
- ConceptSelect `resource="MedicationRequest" field="intent"`

#### `ServiceRequestItem.tsx`
```
[AI] Complete Blood Count (LOINC)
Terminology: [Search LOINC ────────────────── ▼]
Status:   [Select ── ▼]  Intent:   [Select ── ▼]  Priority: [Select ── ▼]
                                               [🗑]
```

- TerminologyCombobox `system="http://loinc.org"`
- ConceptSelect `resource="ServiceRequest" field="status"`
- ConceptSelect `resource="ServiceRequest" field="intent"`
- ConceptSelect `resource="ServiceRequest" field="priority"`

---

### 2.9 `TerminologyCombobox.tsx`

**System URL mapping (defined in `types.ts` or util):**
```typescript
export const TERMINOLOGY_SYSTEM_MAP: Record<string, string> = {
  LOINC: "http://loinc.org",
  SNOMED: "http://snomed.info/sct",
  RXNORM: "http://www.nlm.nih.gov/research/umls/rxnorm",
  "ICD-10": "http://hl7.org/fhir/sid/icd-10-cm",
};
```

**Props:**
```typescript
interface TerminologyComboboxProps {
  system: string;                  // FHIR system URL
  initialQuery?: string;           // AI display text — auto-searched on mount
  value?: ResolvedConcept | null;
  onChange: (concept: ResolvedConcept | null) => void;
  placeholder?: string;
  minChars?: number;               // default: 2
  debounceMs?: number;             // default: 200
}
```

**Behavior:**
1. On mount: if `initialQuery` set, auto-fetch `GET /api/terminology/search?q={initialQuery}&system={system}&limit=20` and pre-select first result (auto-confirm if exactly 1 match, or show list for doctor to pick)
2. User types in search box → debounce 200ms → fetch results
3. Results show `display` as primary, `code` as monospace subtitle (gray, smaller)
4. Selected concept shown in trigger button with small code badge
5. If no results: "No results found — type to search"
6. Loading state: spinner in CommandEmpty

**API call:**
```typescript
const res = await fetch(
  `/api/terminology/search?q=${encodeURIComponent(query)}&system=${encodeURIComponent(system)}&limit=20`
);
const data = await res.json();
// data.results or data.concepts — check actual response shape from terminology service
```

---

### 2.10 `ConceptSelect.tsx`

Used for status/intent/priority fields where the set of values is finite.

**Props:**
```typescript
interface ConceptSelectProps {
  resource: string;   // FHIR resource name e.g. "ServiceRequest"
  field: string;      // field name e.g. "status"
  value?: string;
  onChange: (code: string) => void;
  placeholder?: string;
}
```

**Behavior:**
1. On mount: `GET /api/terminology/concepts?resource={resource}&field={field}` → load full list
2. Store list in local state (no refetch needed)
3. Render as Popover + Command (same pattern as `TerminologyCombobox`)
4. Filter client-side with `Command`'s built-in filtering (no debounce, no server call)
5. Cache: the proxy route uses `cache: "force-cache"` so browser also avoids refetch

**API call:**
```typescript
const res = await fetch(`/api/terminology/concepts?resource=${resource}&field=${field}`);
const data = await res.json();
const concepts = data.concepts ?? [];
```

---

## Phase 3 — Backend Save (After UI is Approved)

### 3.1 New server action: `submitClinicalReview`

**File:** `src/modules/client/telemedicine/server-actions/appointment-action.ts`

Takes the collected form state and:
1. Updates `AppointmentActual.doctorReport` with edited SOAP
2. Creates `Condition` records linked to the appointment
3. Creates `Observation` records
4. Creates `MedicationRequest` records
5. Creates `ServiceRequest` records
6. Marks all new FHIR records with `isDoctorAccepted: true`

**Input shape:**
```typescript
{
  appointmentId: string;
  orgId: string;
  userId: string;
  soap: SoapNote;
  conditions: ConditionFormItem[];
  observations: ObservationFormItem[];
  medications: MedicationFormItem[];
  serviceRequests: ServiceRequestFormItem[];
}
```

### 3.2 Data mapping — AI form state → Prisma creates

**Condition:**
```typescript
prismaTelemedicine.condition.create({
  data: {
    appointmentId,
    orgId,
    isDoctorAccepted: true,
    code_system: item.resolved?.system ?? null,
    code_code: item.resolved?.code ?? null,
    code_display: item.resolved?.display ?? item.display,
    code_text: item.display,
    clinical_status_code: item.clinicalStatus ?? null,
    verification_status_code: item.verificationStatus ?? null,
  }
})
```

**Observation:**
```typescript
prismaTelemedicine.observation.create({
  data: {
    appointmentId,
    orgId,
    isDoctorAccepted: true,
    status: (item.status as ObservationStatus) ?? "PRELIMINARY",
    code_system: item.resolved?.system ?? null,
    code_code: item.resolved?.code ?? null,
    code_display: item.resolved?.display ?? item.display,
    value_string: item.editedValue ?? item.value ?? null,
    // store unit in a note or value_quantity_unit if schema supports
  }
})
```

**MedicationRequest:**
```typescript
prismaTelemedicine.medicationRequest.create({
  data: {
    appointmentId,
    orgId,
    isDoctorAccepted: true,
    status: (item.status as MedicationRequestStatus) ?? "ACTIVE",
    intent: (item.intent as MedicationRequestIntent) ?? "ORDER",
    medication_code_system: item.resolved?.system ?? null,
    medication_code_code: item.resolved?.code ?? null,
    medication_code_display: item.resolved?.display ?? item.display,
    dosageInstructions: {
      create: [{
        text: `${item.editedDose ?? ""} ${item.editedFrequency ?? ""} for ${item.editedDuration ?? ""}`.trim(),
        route_code: item.editedRoute ?? null,
      }]
    }
  }
})
```

**ServiceRequest:**
```typescript
prismaTelemedicine.serviceRequest.create({
  data: {
    appointmentId,
    orgId,
    isDoctorAccepted: true,
    status: (item.status as ServiceRequestStatus) ?? "ACTIVE",
    intent: (item.intent as ServiceRequestIntent) ?? "ORDER",
    priority: (item.priority as ServiceRequestPriority) ?? null,
    code_system: item.resolved?.system ?? null,
    code_code: item.resolved?.code ?? null,
    code_display: item.resolved?.display ?? item.display,
  }
})
```

---

## Implementation Order

### Step 1 (now — backend prep)
- [ ] Update `completeConsultation` repository to save `fullReport`
- [ ] Add `getAppointmentReview` server action
- [ ] Create `/api/terminology/search/route.ts` proxy
- [ ] Create `/api/terminology/concepts/route.ts` proxy

### Step 2 (UI — shared components first)
- [ ] `types.ts`
- [ ] `TerminologyCombobox.tsx`
- [ ] `ConceptSelect.tsx`
- [ ] `EditableList.tsx`

### Step 3 (UI — SOAP editor)
- [ ] `SubjectiveSection.tsx`, `ObjectiveSection.tsx`, `AssessmentSection.tsx`, `PlanSection.tsx`
- [ ] `SoapEditor.tsx` (assembles sections into Accordion)

### Step 4 (UI — clinical panels)
- [ ] All 4 `*Item.tsx` components
- [ ] All 4 `*List.tsx` components (add/remove items)
- [ ] `ClinicalExtractionPanel.tsx` (Tabs wrapper)

### Step 5 (UI — wire up)
- [ ] `AppointmentReview.tsx` (main container with state)
- [ ] `page.tsx` (server component — passes data)
- [ ] Test with mock staging data

### Step 6 (backend save — Phase 3)
- [ ] `submitClinicalReview` server action + repository method
- [ ] Wire "Confirm & Save" button to action
- [ ] Run `prisma generate` after any schema changes

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `TERMINOLOGY_SERVICE_URL` | Server-side URL for the terminology service (no `NEXT_PUBLIC_`) |
| `NEXT_PUBLIC_TERMINOLOGY_SERVICE_URL` | May exist already; use server-side var in proxy routes instead |

Add to `.env` if not present:
```
TERMINOLOGY_SERVICE_URL=http://localhost:8005
```

---

## Key Decisions

| Decision | Rationale |
|---|---|
| `fullReport` as staging field | Already in schema — no migration needed |
| Next.js proxy routes for terminology | Avoids CORS; hides service URL from client bundle |
| Client-side filter for ConceptSelect | Enum lists are small; no need for server round-trips per keystroke |
| Server-side search for TerminologyCombobox | Terminology databases are large (LOINC 95k+); must search server |
| Auto-search AI display on mount | Gives doctor a pre-selected starting point; they confirm or override |
| `isDoctorAccepted: true` on submit | All confirmed items go directly to accepted state |
