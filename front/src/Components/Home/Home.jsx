import CreatePost from "../CreatePost/CreatePost";
import UserPosts from "../UserPosts/UserPosts";
import { Helmet } from "react-helmet";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>SocialApp | Home</title>
      </Helmet>

      <CreatePost />
      <UserPosts />
    </>
  );
}
