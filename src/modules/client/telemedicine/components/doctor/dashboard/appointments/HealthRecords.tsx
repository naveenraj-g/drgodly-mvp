import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Image, ExternalLink } from "lucide-react";
import { HealthRecord } from "@/modules/client/telemedicine/datas/doctor-dashboard";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";
import ActionTooltipProvider from "@/modules/shared/providers/action-tooltip-provider";
import { CgCompress } from "react-icons/cg";
import { RiExpandHorizontalLine } from "@remixicon/react";

interface HealthRecordsProps {
  records: HealthRecord[];
}

export const HealthRecords = ({ records }: HealthRecordsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleViewRecord = (record: HealthRecord) => {
    toast.info(`Opening ${record.name}`);
  };

  return (
    <Card className={cn(isExpanded ? "col-span-2" : "col-auto")}>
      <CardHeader className="flex items-center gap-2 justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Attached Health Records
        </CardTitle>
        <ActionTooltipProvider label={isExpanded ? "Shrink" : "Expand"}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsExpanded((prevState) => !prevState)}
          >
            {isExpanded ? (
              <CgCompress className="size-6 text-muted-foreground" />
            ) : (
              <RiExpandHorizontalLine className="size-6 text-muted-foreground" />
            )}
          </Button>
        </ActionTooltipProvider>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {records.map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between p-3 border border-border rounded-md hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {record.type === "pdf" ? (
                  <FileText className="h-5 w-5 text-destructive" />
                ) : (
                  <Image className="h-5 w-5 text-info" />
                )}
                <div>
                  <p className="font-medium text-foreground text-sm">
                    {record.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{record.date}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewRecord(record)}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
