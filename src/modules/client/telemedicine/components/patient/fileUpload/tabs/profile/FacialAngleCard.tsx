/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFileUploadCore } from "@/modules/client/shared/hooks/useFileUploadCore";
import { Camera, Upload, X } from "lucide-react";
import React from "react";

interface IFacialAngleCardProps {
  facialAngles: {
    angle: string;
    label: string;
    icon: React.ReactNode;
    instruction: string;
  }[];
  uploads: Record<string, ReturnType<typeof useFileUploadCore>>;
  uploadedFaceAngleData?: Record<string, string>;
}

function FacialAngleCard({
  facialAngles,
  uploads,
  uploadedFaceAngleData,
}: IFacialAngleCardProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {facialAngles.map((angle) => {
        const upload = uploads[angle.angle as keyof typeof uploads];
        const file = upload.completedFiles[0];
        const isUploaded = uploadedFaceAngleData?.[
          angle.angle as keyof typeof uploadedFaceAngleData
        ]
          ? true
          : false;
        const displaySrc =
          file?.objectUrl ||
          uploadedFaceAngleData?.[
            angle.angle as keyof typeof uploadedFaceAngleData
          ] ||
          "";

        return (
          <React.Fragment key={angle.angle}>
            <div
              className={cn(
                "group relative rounded-xl overflow-hidden transition-all duration-300 animate-fade-in",
                "bg-card border border-border shadow-card hover:shadow-card-hover",
                upload.isDragActive && "border-primary shadow-glow"
              )}
              {...upload.getRootProps()}
            >
              <input type="file" accept="image/*" {...upload.getInputProps()} />

              {/* Header */}
              <div className="px-4 py-3 border-b border-border bg-secondary/30">
                <div className="flex gap-2 items-center justify-between flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                      {angle.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {angle.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {angle.instruction}
                      </p>
                    </div>
                  </div>
                  {isUploaded && (
                    <Button onClick={upload.open} size="sm" variant="secondary">
                      <Camera />
                      Change Photo
                    </Button>
                  )}
                </div>
              </div>

              {/* Image Area */}
              <div
                className={cn(
                  "relative aspect-square h-80 w-full",
                  file ? "cursor-default" : "cursor-pointer"
                )}
                onClick={upload.open}
              >
                {file || displaySrc ? (
                  <>
                    <img
                      src={displaySrc}
                      alt={`${angle.label} angle`}
                      className="w-full h-full object-cover"
                    />
                    {file && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          upload.removeFile(file?.id);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-secondary/20 group-hover:bg-secondary/40 transition-colors">
                    <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                      <Camera className="w-8 h-8" />
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      <Upload className="w-4 h-4" />
                      Click or drag to upload
                    </div>
                  </div>
                )}
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default FacialAngleCard;
