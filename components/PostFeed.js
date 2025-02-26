"use client";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import { useState } from "react";
import Link from "next/link";
import AddCommentForm from "./AddCommentForm";
import LikePost from "./LikePost";
import { FaRegComment } from "react-icons/fa6";
 

export default function PostFeed({ post }) {
  console.log(post)
  const [showAllComments, setShowAllComments] = useState(false);

  if (!post) return null; // Prevents errors if post is undefined

  const commentsToShow = showAllComments ? post?.comments : post?.comments?.slice(0, 3);

  return (
    <div className="mt-5 max-w-[400px] mx-auto">
      {/* Post Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <img className="w-12 h-12 rounded-full object-cover" src={post.avatar} alt="User Avatar" />
          <div>
            <Link href={`http://localhost:3000/profile/${post.username}`}>
              <span className="font-bold">{post.author}</span>
            </Link>
          </div>
        </div>
         <span className="font-bold">{dayjs(post.createdAt).fromNow()}</span>
      </div>

      {/* Post Image */}
      <Link target="_blank" href={`http://localhost:3000/profile/${post.username}/${post.id}`}>
        <div className="my-2 max-w-[400px]">
          <img className="object-cover" src={post.image} alt="Post" />
        </div>
      </Link>

      {/* Like Button */}
      <div className="flex gap-2 my-4">
      <LikePost id={post?.id} likes={post?.likes} />
      <label className="cursor-pointer" htmlFor="commentInput"><FaRegComment fontSize={20}/></label>
      </div>
      
      {/* Comments Section */}
      <AddCommentForm author={post?.author} comments={commentsToShow} id={post?.id} />

      {/* Toggle Comments Button */}
      {post.comments?.length > 3 && (
        <span
          onClick={() => setShowAllComments((prev) => !prev)}
        >
          {showAllComments ? "Show Less" : "Show All Comments"}
        </span>
      )}

       
 
    </div>
  );
}
