import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { useAuth } from "../features/auth/auth.context";

interface NavItemProps {
  onItemClick?: () => void;
}

function NavItem({ onItemClick }: NavItemProps) {
  const { user, isAuthenticated, signOutCxt } = useAuth();
  const navigate = useNavigate();

  const handleAction = (path: string, isLogout: boolean = false) => {
    if (isLogout) {
      signOutCxt();
    } else {
      navigate(path);
    }

    if (onItemClick) onItemClick();
  };

  if (!isAuthenticated) {
    return (
      <>
        <Button variant="ghost" onClick={() => handleAction("/signin")}>
          Login
        </Button>
        <Button onClick={() => handleAction("/signup")}>Sign Up</Button>
      </>
    );
  }

  return (
    <>
      <span className="text-sm text-gray-600 self-center">{user?.email}</span>
      <Button variant="ghost" onClick={() => handleAction(`/user/${user?.id}`)}>
        Profile
      </Button>
      <Button variant="ghost" onClick={() => handleAction("/", true)}>
        Logout
      </Button>
    </>
  );
}

export default NavItem;
