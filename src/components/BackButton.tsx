import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Button from "./Button";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate(-1)}
      variant="ghost"
      size="sm"
      className="hover:text-black px-2"
    >
      <ArrowLeft size={18} className="text-gray-700" />
    </Button>
  );
}
