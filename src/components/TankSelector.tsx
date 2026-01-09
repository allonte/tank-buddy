import { Box } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TANK_LIST } from "@/lib/tankData";

interface TankSelectorProps {
  value: string;
  onChange: (tankId: string) => void;
}

const TankSelector = ({ value, onChange }: TankSelectorProps) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-2">
        <Box className="w-4 h-4 text-primary" />
        <label className="text-sm font-medium text-foreground">
          Select Tank
        </label>
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-background border-2 border-primary text-primary font-medium h-12">
          <SelectValue placeholder="Select a tank" />
        </SelectTrigger>
        <SelectContent className="bg-background border-primary z-50">
          {TANK_LIST.map((tank) => (
            <SelectItem key={tank.id} value={tank.id} className="text-primary font-medium">
              {tank.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TankSelector;
