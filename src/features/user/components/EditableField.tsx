type EditableFieldProps = {
  label: string;
  name: string;
  value: string;
  isEditing: boolean;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggle: () => void;
};

function EditableField({
  label,
  name,
  value,
  isEditing,
  disabled = false,
  onChange,
  onToggle,
}: EditableFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-500">{label}</label>

      <div className="flex gap-2">
        {isEditing && !disabled ? (
          <input
            name={name}
            value={value}
            onChange={onChange}
            className="border rounded-md px-3 h-10 w-full outline-none focus:outline-none focus:ring-0"
          />
        ) : (
          <div
            className={`border-b border-b-gray-300 rounded-md px-3 h-10 flex items-center w-full ${
              disabled
                ? "bg-gray-50 text-gray-500 cursor-not-allowed"
                : "bg-gray-50"
            }`}
          >
            {value || "Not set"}
          </div>
        )}

        {!disabled && (
          <button
            onClick={onToggle}
            className="rounded-md text-black cursor-pointer"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        )}
      </div>
    </div>
  );
}

export default EditableField;
