import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Heart, Footprints, Moon } from "lucide-react";
import { LifestyleData } from "@/modules/client/telemedicine/datas/doctor-dashboard";
import { useState } from "react";
import { cn } from "@/lib/utils";
import ActionTooltipProvider from "@/modules/shared/providers/action-tooltip-provider";
import { Button } from "@/components/ui/button";
import { CgCompress } from "react-icons/cg";
import { RiExpandHorizontalLine } from "@remixicon/react";
import { HeartRateChart } from "./heartRateChart";
import { StepsChart } from "./stepsChart";
import { SleepChart } from "./sleepChart";
import { ActivityChart } from "./activityChart";

interface LifestyleChartsProps {
  lifestyle: LifestyleData;
}

export const LifestyleCharts = ({ lifestyle }: LifestyleChartsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className={cn(isExpanded ? "col-span-2" : "col-auto")}>
      <CardHeader className="flex items-center gap-2 justify-between">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Lifestyle & Behavioral Data
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
        <Tabs defaultValue="heart-rate" className="w-full">
          <TabsList className="grid w-full h-fit grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="heart-rate" className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              Heart Rate
            </TabsTrigger>
            <TabsTrigger value="steps" className="flex items-center gap-1">
              <Footprints className="h-3 w-3" />
              Steps
            </TabsTrigger>
            <TabsTrigger value="sleep" className="flex items-center gap-1">
              <Moon className="h-3 w-3" />
              Sleep
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="heart-rate" className="mt-6">
            <HeartRateChart heartRate={lifestyle.heartRate} />
          </TabsContent>

          <TabsContent value="steps" className="mt-6">
            <StepsChart steps={lifestyle.steps} />
          </TabsContent>

          <TabsContent value="sleep" className="mt-6">
            <SleepChart sleep={lifestyle.sleep} />
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <ActivityChart activity={lifestyle.activity} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
