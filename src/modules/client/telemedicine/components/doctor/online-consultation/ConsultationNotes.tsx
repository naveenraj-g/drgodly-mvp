"use client";

import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface ConsultationNotesProps {
  roomId: string;
}

export default function ConsultationNotes({ roomId }: ConsultationNotesProps) {
  const storageKey = `consultation_notes_${roomId}`;
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  // Load saved notes when doctor reopens
  //   useEffect(() => {
  //     const savedNotes = localStorage.getItem(storageKey);
  //     if (savedNotes) setNotes(savedNotes);
  //   }, [storageKey]);

  // Auto-save on every change (debounced)
  //   useEffect(() => {
  //     if (!notes) return;
  //     const timeout = setTimeout(() => {
  //       localStorage.setItem(storageKey, notes);
  //       setSaved(true);
  //       setTimeout(() => setSaved(false), 2000);
  //     }, 1000);
  //     return () => clearTimeout(timeout);
  //   }, [notes, storageKey]);

  return (
    <Card className="mt-3 p-3 flex flex-col gap-2 h-[240px] bg-secondary">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-muted-foreground">
          Consultation Notes
        </h3>
        {/* {saved && (
          <span className="text-xs text-green-600 flex items-center gap-1">
            <Save className="h-3 w-3" /> Saved
          </span>
        )} */}
      </div>

      <Textarea
        placeholder="Write important points, observations, prescriptions..."
        className="flex-1 resize-none text-sm"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      {/* <div className="flex justify-end">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            localStorage.setItem(storageKey, notes);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Notes
        </Button>
      </div> */}
    </Card>
  );
}
