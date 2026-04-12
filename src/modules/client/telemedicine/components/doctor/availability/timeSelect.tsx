import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

type TTimeSelectProps = {
  options: string[];
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function TimeSelect({
  options,
  onChange,
  placeholder,
  value,
  className,
}: TTimeSelectProps) {
  return (
    <Select onValueChange={(value) => onChange(value)} value={value}>
      <SelectTrigger
        className={cn("w-32 flex items-center justify-between", className)}
        showIcon={false}
      >
        <SelectValue placeholder={placeholder} />
        <Clock className="size-4" />
      </SelectTrigger>
      <SelectContent className="max-h-72">
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
