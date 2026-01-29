import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import { useAuth } from "../../auth/auth.context";

function CreatePostButton() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isPoster = user?.role === "poster";

  const handleCreate = () => {
    if (user?.role !== "poster") {
      console.warn("Unauthorized");
      return;
    }

    navigate("/post");
  };

  return (
    <>
      {isPoster && (
        <button
          onClick={handleCreate}
          className="
            fixed bottom-6 right-6
            sm:bottom-10 sm:right-10
            lg:bottom-20 lg:right-20

            inline-flex items-center justify-center rounded-full
            bg-black backdrop-blur-md border border-white/20 shadow-lg

            p-3 sm:p-4 lg:p-5"
        >
          <Plus
            className="
            text-white
              w-5 h-5
              sm:w-7 sm:h-7
              lg:w-8 lg:h-8"
            strokeWidth={2.5}
          />
        </button>
      )}
    </>
  );
}

export default CreatePostButton;
