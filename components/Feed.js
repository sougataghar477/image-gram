"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import PostFeed from "./PostFeed";
import SignIn from "./SignIn";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state
  const { status, data } = useSession();
  const id = data?.user?.email;

  useEffect(() => {
    const fetchPosts = async () => {
      if (status === "authenticated") {
        try {
          const response = await fetch("http://localhost:3000" + "/api/fetchposts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          });

          const data = await response.json();
          setPosts(data.posts);
          console.log("Response:", data);
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setLoading(false); // Stop loading
        }
      } else {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [status, id]);

  // Loader Component
  if ((status === "loading" ) || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-white"></div>
      </div>
    );
  }

  return (
<div className="max-w-[640px]">
  {status === "unauthenticated" ? (
    <SignIn />
  ) : status === "authenticated" ? (
    posts.length > 0 ? (
      posts.map((post) => <PostFeed post={post} key={post.id} />)
    ) : (
      <p className="text-center mt-4 text-gray-500">No posts found.</p>
    )
  ) : status==="loading"?(
    <p className="text-center mt-4 text-gray-500">Loading...</p>
  ):null}
</div>
  );
}
