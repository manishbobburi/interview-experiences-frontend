import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NavItem from "./NavItem";

function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed w-full h-14 border-b z-50 border-gray-200 bg-white/50 backdrop-blur-sm">
      <div className="max-w-8xl px-4 sm:px-8 h-full flex items-center justify-between">
        <div
          className="font-semibold text-lg cursor-pointer"
          onClick={() => navigate("/")}>
          PEX
        </div>

        <div className="hidden sm:flex items-center space-x-3">
          <NavItem />
        </div>

        <button className="sm:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="sm:hidden absolute top-14  right-4 w-56 z-50 bg-white border-b border-gray-200 shadow-md">
          <div className="flex flex-col p-4 space-y-3">
            <NavItem onItemClick={() => setOpen(false)}/>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
