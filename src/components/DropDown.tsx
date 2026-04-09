import { Trash } from 'lucide-react';

type DropDownProps = {
  onDelete: () => {};
  onClose: () => void;
}

function DropDown({ onDelete, onClose }: DropDownProps) {
  return (
    <div className="absolute right-0 mt-2 z-50 w-36 rounded-md bg-white shadow-md">
      <button
        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
        onClick={() => {
          onDelete();
          onClose();
        }}
      >
        <Trash size={15} />
        Delete
      </button>
    </div>
  );
}


export default DropDown