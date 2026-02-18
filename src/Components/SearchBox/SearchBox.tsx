import { useDebouncedCallback } from "use-debounce";
import css from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onChange: (searchValue: string) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  const handleChange = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    1000,
  );
  return (
    <input
      className={css.input}
      onChange={handleChange}
      defaultValue={value}
      type="text"
      placeholder="Search notes"
    />
  );
}
