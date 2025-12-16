import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { UserContext } from "./../../Context/UserContext";
import { useNavigate } from "react-router-dom";

export default function DropdownEdit({
  mediaId,
  isPost,
  commentId,
  setIsEditComment,
  setIsEditPost,
}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { userData } = useContext(UserContext);
  const queryClient = useQueryClient();

  const dropdownRef = useRef(null);

  //========= Handle Outside Click =========
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);
  //==========================================

  const { mutate: handleDelete } = useMutation({
    mutationFn: deleteApi,
    onSuccess: () => {
      toast(`${isPost ? "post" : "comment"} deleted successfully`, {
        type: "success",
        theme: "dark",
      });

      queryClient.invalidateQueries("getAllPosts");
      queryClient.invalidateQueries("getUserPosts");

      if (isPost) navigate("/");
    },
    onError: (error) => {
      toast("something went wrong" + error, {
        type: "error",
        theme: "dark",
      });
    },
  });

  async function deleteApi() {
    const endPoint = isPost ? "post" : "comment";
    const id = isPost ? mediaId._id : commentId;
    return await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/${endPoint}/${id}`,
      {
        headers: {
          token: `testPrefix ${localStorage.getItem("token")}`,
        },
      }
    );
  }

  return (
    <>
      {userData?._id === mediaId?.owner?._id && (
        <div className="relative inline-block" ref={dropdownRef}>
          {/* Dropdown Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <i className="fa-solid fa-ellipsis-vertical text-white text-2xl"></i>
          </button>

          {/* Dropdown Menu */}
          {open && (
            <div className="absolute right-0 mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600">
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                <li
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => {
                    if (isPost) {
                      setIsEditPost(true);
                    } else {
                      setIsEditComment(true);
                    }
                    setOpen(false);
                  }}
                >
                  Edit
                </li>
                <li
                  onClick={() => {
                    handleDelete();
                    setOpen(false); // close dropdown
                  }}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Delete
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
}
