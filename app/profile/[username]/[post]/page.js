"use client";
import { use,useEffect, useState } from "react";
import AddCommentForm from "@/components/AddCommentForm";
import LikePost from "@/components/LikePost";
import { FaRegHeart } from "react-icons/fa6";
import { FaRegComment } from "react-icons/fa";
import { FaRegPaperPlane } from "react-icons/fa6";
import Link from "next/link";

export default function Post({ params }) {
  // Destructure the params to get username and post id.
  const { username, post: postId } = use(params);
  const [eachPost, setPost] = useState({});
  const [commentsLength,setCommentsLength]=useState(null);
  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch("https://image-gram-neon.vercel.app/api/post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, id: postId })
        });
        const response = await res.json();
        console.log(response);
        setPost(response);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    }
    fetchPost();
  }, [username, postId]);

  return (
    <div className="flex mt-5 gap-5 flex-wrap">
      {/* Display post image */}
      <img
        className="max-w-[400px] object-cover"
        src={eachPost?.post?.[0]?.image}
        alt="Post Image"
      />

      <div className="relative h-screen overflow-scroll max-w-[400px]">
        <div className="flex gap-2">
          {/* User avatar */}
          <img
            className="w-10 h-10 rounded-full"
            src={eachPost?.avatar}
            alt="User Avatar"
          />
          <h1 className="font-bold">
            <Link href={`/profile/${username}`}>
              {eachPost?.username}
            </Link>
          </h1>
        </div>

        <p>
          {
           eachPost?.post?.[0]?.description ||
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
          }
        </p>

        <div className="py-8">
          <div className="flex gap-4 mb-4">
            <LikePost
              author={eachPost?.post?.[0]?.author}
              username={username}
              id={postId}
              likes={eachPost?.post?.[0]?.likes}
            />
            <div className="flex gap-1">
              <label htmlFor={`commentInput${postId}`}>
                <FaRegComment fontSize={20} />
              </label>
              <span>{commentsLength || eachPost?.post?.[0]?.comments?.length }</span>
            </div>
            <FaRegPaperPlane fontSize={20} />
          </div>

          <div>
            <h1 className="font-bold italic">Comments</h1>
          </div>

          <AddCommentForm
            showAllComments={true}
            author={eachPost?.post?.[0]?.author}
            id={eachPost?.post?.[0]?.id}
            comments={eachPost?.post?.[0]?.comments || []}
            setCommentsLength={setCommentsLength}
          />
        </div>
      </div>
    </div>
  );
}
