import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { University } from "@/lib/models";
import { useState } from "react";

type DropdownProps = {
  value?: string;
  onChangeHandler: () => void;
};
const Dropdown = ({ onChangeHandler, value }: DropdownProps) => {
  const [universities, setUniversities] = useState<University[]>([
    {
      id: 1,
      name: "Fast University",
      email: "fast-nuces@gmail.com",
      password: "12345678",
      logo_url: "http://some-logo/.com",
    },
  ]);

  const handleAddUniversity = () => {};
  return (
    <Select onValueChange={onChangeHandler} defaultValue={value}>
      <SelectTrigger className="select-field bg-gray-50">
        <SelectValue placeholder="University" />
      </SelectTrigger>
      <SelectContent>
        {universities.length > 0 &&
          universities.map((university) => (
            <SelectItem
              value={String(university.id)}
              key={university.id}
              className="select-item p-regular-14"
            >
              {university.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

export default Dropdown;
