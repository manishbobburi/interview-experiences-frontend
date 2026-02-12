interface PaswordFieldsProps {
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function PasswordField({
  name,
  placeholder,
  value,
  onChange,
}: PaswordFieldsProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-500">{placeholder}</label>
      <input
        name={name}
        type="password"
        value={value}
        onChange={onChange}
        className="border-b  border-b-gray-300 bg-gray-50 rounded-md px-3 h-10 focus:outline-1 focus:outline-black"
      />
    </div>
  );
}

export default PasswordField;
