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
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-muted-foreground">
        Select Tank:
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px] bg-background border-border">
          <SelectValue placeholder="Select a tank" />
        </SelectTrigger>
        <SelectContent className="bg-background border-border z-50">
          {TANK_LIST.map((tank) => (
            <SelectItem key={tank.id} value={tank.id}>
              {tank.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TankSelector;
