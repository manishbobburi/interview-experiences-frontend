import { useState } from "react";
import Button from "../../../components/Button";
import PasswordField from "./PasswordField";
import { changeUserPassword } from "../../../services/user/user.api";

function ChangePassword() {
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const [passwordFields, setPasswordFields] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [validationError, setValidationError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordFields((prev) => ({ ...prev, [name]: value }));
    setValidationError("");
  };

  const validate = () => {
    const oldPassword = passwordFields.oldPassword.trim();
    const newPassword = passwordFields.newPassword.trim();
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!oldPassword) return "Old password required";
    if (!newPassword) return "New password required";
    if (newPassword.length < 6) return "New password must be at least 6 chars";
    if (oldPassword === newPassword)
      return "Old and new password cannot be same";
    if (!strongPasswordRegex.test(newPassword))
      return "Password must contain uppercase, lowercase and number";

    return null;
  };

  const handleSubmit = async () => {
    setLoading(true);

    const error = validate();

    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError("");

    try {
      const response = await changeUserPassword(passwordFields);

      if (response.success) {
        setPasswordFields({
          oldPassword: "",
          newPassword: "",
        });

        setShowPasswordFields(false);
      }
    } catch (err: any) {
      const msg = err.message;
      setValidationError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={() => {
          setShowPasswordFields(!showPasswordFields);
        }}
        className="cursor-pointer text-left font-medium text-gray-800"
      >
        Change password
      </button>

      {showPasswordFields && (
        <div className="flex flex-col gap-5 w-full sm:gap-5">
          <PasswordField
            name="oldPassword"
            placeholder="Old password"
            value={passwordFields.oldPassword}
            onChange={handleChange}
          />

          <PasswordField
            name="newPassword"
            placeholder="New password"
            value={passwordFields.newPassword}
            onChange={handleChange}
          />
          {validationError && (
            <p className="text-xs text-red-600">{validationError}</p>
          )}
          <Button
            className="self-end"
            onClick={handleSubmit}
            disabled={loading}
            type="button"
          >
            Change
          </Button>
        </div>
      )}
    </div>
  );
}

export default ChangePassword;
