import { useEffect, useState } from "react";
import { useAuth } from "../../auth/auth.context";
import Button from "../../../components/Button";
import EditableField from "./EditableField";
import ChangePassword from './ChangePassword';
import { changeUserDetails } from "../../../services/user/user.api";

function UserDetails() {
  const { user } = useAuth();

  const [userDetails, setUserDetails] = useState({
    userId: user?.id,
    name: "",
    email: "",
  });

  const [editing, setEditing] = useState({
    name: false,
    email: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUserDetails({
        userId: user?.id,
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEdit = (field: "name" | "email") => {
    setEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validate = () => {
    const name = userDetails.name.trim();
    const email = userDetails.email.trim();

    if (!userDetails.userId) return "User not loaded";
    if (!name) return "Name required";
    if (name.length < 2) return "Name cannot be less than 2 characters";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email";

    return null;
  };

  const handleSubmit = async () => {
    const name = userDetails.name;
    const email = userDetails.email;

    const error = validate();
    if (error) {
      console.log(error);
      return;
    }

    const normalized = {
      ...userDetails,
      name,
      email,
    }

    setLoading(true);

    try {
      const response = await changeUserDetails(normalized);

      if (response.success) {
        setEditing({ name: false, email: false });
        return;
      } else {
        console.log("Update failed", response);
      }
    } finally {
      setLoading(false);
    }
  };

  const isEditing = editing.name || editing.email;

  return (
    <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto bg-white shadow-md rounded-xl p-4 sm:p-6 lg:p-8 flex flex-col gap-4 sm:gap-6">
      <div className="flex justify-center">
        <div
          className="
        w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28
        bg-gray-200 rounded-full flex items-center justify-center 
        overflow-hidden"
        ></div>
      </div>

      <div className="flex flex-col gap-4 sm:gap-5">
        <EditableField
          label="Name"
          name="name"
          value={userDetails.name}
          isEditing={editing.name}
          onChange={handleChange}
          onToggle={() => toggleEdit("name")}
        />

        <EditableField
          label="Email"
          name="email"
          value={userDetails.email}
          isEditing={editing.email}
          onChange={handleChange}
          onToggle={() => toggleEdit("email")}
        />

        <ChangePassword />
      </div>

      {isEditing && (
        <div className="flex justify-stretch sm:justify-end">
          <Button
            size="sm"
            disabled={loading}
            onClick={handleSubmit}
            className="
          h-10 px-6 
          w-full sm:w-auto
        "
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
}

export default UserDetails;
