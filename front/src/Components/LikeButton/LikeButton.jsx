import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function LikeButton({ post, size = "medium" }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const queryClient = useQueryClient();

  // Sync with post data
  useEffect(() => {
    if (post) {
      setIsLiked(Boolean(post.isLiked));
      setLikesCount(post.likesCount ?? post.likes?.length ?? 0);
    }
  }, [post]);

  // Toggle like
  const toggleLikeMutation = useMutation({
    mutationFn: async () => {
      return await axios.post(
        `${import.meta.env.VITE_BASE_URL}/post/toggle-like/${post._id}`,
        {},
        {
          headers: {
            token: `testPrefix ${localStorage.getItem("token")}`,
          },
        }
      );
    },

    onSuccess: (res) => {
      const { isLiked: newIsLiked, likesCount: newLikesCount } = res.data;

      // Update local UI
      setIsLiked(newIsLiked);
      setLikesCount(newLikesCount);

      // Refresh related queries
      queryClient.invalidateQueries(["getAllPosts"]);
      queryClient.invalidateQueries(["getUserPosts"]);
      queryClient.invalidateQueries(["getPostDetails", post._id]);
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to toggle like", {
        theme: "dark",
      });
    },
  });

  const handleLikeToggle = () => {
    if (!toggleLikeMutation.isLoading) {
      toggleLikeMutation.mutate();
    }
  };

  const isLoading = toggleLikeMutation.isLoading;

  const sizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  const iconSizeClasses = {
    small: "text-base",
    medium: "text-lg",
    large: "text-xl",
  };

  return (
    <button
      onClick={handleLikeToggle}
      disabled={isLoading}
      className={`flex items-center gap-2 transition-all duration-300 
        ${isLiked ? "text-blue-500" : "text-gray-400"}
        ${sizeClasses[size]}
        
      `}
    >
      <i
        className={`
          fa-solid fa-thumbs-up
          ${iconSizeClasses[size]}
          ${isLiked ? "text-blue-500" : "text-gray-400"}
          transition-transform duration-200
          ${isLoading ? "animate-pulse" : "hover:scale-110"}
        `}
      />
      <span className="font-medium">
        {likesCount > 0 ? likesCount.toLocaleString() : "Like"}
      </span>
    </button>
  );
}
