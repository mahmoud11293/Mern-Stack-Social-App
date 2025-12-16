import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import SinglePost from "../SinglePost/SinglePost";
import Error from "../../Error/Error";
import Loader from "../../Loader/Loader";

export default function UserPosts({ isHome = true }) {
  async function getUserPosts() {
    const apiUrl = isHome
      ? `${import.meta.env.VITE_BASE_URL}/post`
      : `${import.meta.env.VITE_BASE_URL}/user/posts`;

    return await axios.get(apiUrl, {
      headers: {
        token: `testPrefix ${localStorage.getItem("token")}`,
      },
    });
  }

  const { data, isLoading, error, isError } = useQuery({
    queryKey: isHome ? ["getAllPosts"] : ["getUserPosts"],
    queryFn: getUserPosts,
    select: (data) => data?.data?.posts,
    retry: 4,
    retryDelay: 2000,
  });

  if (isError) return <Error error={error} />;
  if (isLoading) return <Loader />;

  return (
    <>
      {data?.map((post) => (
        <SinglePost key={post._id} post={post} />
      ))}
    </>
  );
}
