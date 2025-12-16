import { Link } from "react-router-dom";
import Comment from "../Comment/Comment";
import AddComment from "../AddComment/AddComment";
import DropdownEdit from "../DropdownEdit/DropdownEdit";
import { useState } from "react";
import PostEdit from "../PostEdit/PostEdit";
import LikeButton from "../LikeButton/LikeButton";
import SharePostButton from "../SharePostButton/SharePostButton";

export default function SinglePost({ post }) {
  const [isEditPost, setIsEditPost] = useState(false);

  return (
    <div className="w-full md:w-[80%] lg:w-[60%] my-10 p-5 mx-auto rounded-md bg-gray-800">
      {/* ======== Header Post .. userImage, userName, createdAt ======== */}
      <div className="flex items-center justify-between">
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <img
              src={
                post.owner.image?.url
                  ? post.owner.image.url
                  : "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              }
              className="size-[35px] rounded-full"
              alt={post.owner.name}
            />
            <span className="font-bold">{post.owner.name}</span>
          </div>
          <Link to={`/postdetails/${post._id}`}>
            <span className="mt-1 ms-12 text-sm hover:underline">
              {post.createdAt.split("T")[0]}
            </span>
          </Link>
        </div>
        <DropdownEdit
          mediaId={post}
          isPost={true}
          setIsEditPost={setIsEditPost}
        />
      </div>
      {/* ===================== Edit Mode ===================== */}
      {isEditPost ? (
        <PostEdit post={post} setIsEditPost={setIsEditPost} />
      ) : (
        <>
          {/* ================ Shared Post Section ================ */}
          {post.isShared && post.sharedFrom && post.sharedFrom.owner && (
            <div className="bg-gray-800 p-3 rounded-lg mb-3 border border-gray-700">
              <p className="text-sm text-gray-300 mb-2">
                Shared from {post.sharedFrom.owner.name}
              </p>

              <div className="flex items-center gap-3">
                <img
                  className="w-10 h-10 rounded-full"
                  src={
                    post.sharedFrom.owner.image?.url ||
                    "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  }
                  alt="original owner"
                />

                <div>
                  <p className="font-semibold text-white">
                    {post.sharedFrom.owner.name}
                  </p>

                  <p className="text-xs text-gray-400">
                    {new Date(post.sharedFrom.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ===================== Post Body ===================== */}
          {post.body && <h2 className="mb-5">{post.body}</h2>}

          <Link to={`/postdetails/${post._id}`}>
            {post.image && (
              <img
                src={post.image.url}
                className="w-full rounded-md"
                alt={post.body}
              />
            )}
          </Link>
          <div className="flex items-center justify-between mt-5">
            <LikeButton post={post} size="medium" />
            <Link to={`/postdetails/${post._id}`}>
              <i className="fa-solid fa-comment">
                <span className="ms-2">{post.comments.length}</span>
              </i>
            </Link>
            <SharePostButton post={post} />
          </div>
          {/* ===================== Post Comments ===================== */}
          <AddComment postId={post._id} />

          {/* == Show Last Comment == */}
          {post.comments.length > 0 && <Comment comment={post.comments[0]} />}
        </>
      )}
    </div>
  );
}
