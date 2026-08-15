import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DobInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  id?: string;
  label?: string;
}

export const DobInput = ({ 
  value, 
  onChange, 
  onBlur, 
  error, 
  id = "dob", 
  label = "Date of Birth (DD/MM/YYYY)" 
}: DobInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 8) val = val.slice(0, 8);
    if (val.length > 4) val = `${val.slice(0, 2)}/${val.slice(2, 4)}/${val.slice(4)}`;
    else if (val.length > 2) val = `${val.slice(0, 2)}/${val.slice(2)}`;
    onChange(val);
  };

  return (
    <div className="text-left w-full">
      <Label htmlFor={id} className="text-sm font-semibold ml-1 text-stone-900">{label}</Label>
      <Input 
        id={id}
        placeholder="DD/MM/YYYY"
        inputMode="numeric"
        className={`bg-[#fdfbf7] border-stone-300 text-stone-900 focus:border-primary ${error ? 'border-destructive' : ''}`}
        value={value}
        onBlur={onBlur}
        onChange={handleChange}
        required
      />
      {error && <p className="mt-1 text-xs text-destructive ml-1">{error}</p>}
    </div>
  );
};
