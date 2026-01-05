import { Slider } from "@/components/ui/slider";

interface LevelSliderProps {
  value: number;
  onChange: (value: number) => void;
  max: number;
}

const LevelSlider = ({ value, onChange, max }: LevelSliderProps) => {
  const percentage = (value / max) * 100;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Simulate Level</h3>
        <span className="font-mono text-primary font-bold">{value.toLocaleString()} L</span>
      </div>

      <Slider
        value={[value]}
        onValueChange={(vals) => onChange(vals[0])}
        max={max}
        step={100}
        className="w-full"
      />

      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>0 L</span>
        <span>{max.toLocaleString()} L</span>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-4">
        Drag to simulate different fill levels
      </p>
    </div>
  );
};

export default LevelSlider;
