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
  const [commentsLength,setCommentsLength] = useState(post?.comments?.length);
  if (!post) return null; // Prevents errors if post is undefined
 
  return (
    <div className="mt-5 max-w-[400px] mx-auto">
      {/* Post Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <img className="w-12 h-12 rounded-full object-cover" src={post.avatar} alt="User Avatar" />
          <div>
            <Link href={`/profile/${post.username}`}>
              <span className="font-bold">{post.author}</span>
            </Link>
          </div>
        </div>
         <span className="font-bold">{dayjs(post.createdAt).fromNow()}</span>
      </div>

      {/* Post Image */}
      <Link target="_blank" href={`/profile/${post.username}/${post.id}`}>
        <div className="my-2 max-w-[400px]">
          <img className="object-cover" src={post.image} alt="Post" />
        </div>
      </Link>
      <p>{post.description}</p>
      {/* Like Button */}
      <div className="flex gap-2 my-4 items-center">
      <LikePost author={post.author} id={post?.id} likes={post?.likes} />
      <div className="flex items-center gap-1">
      <label className="cursor-pointer" htmlFor={"commentInput"+post?.id}><FaRegComment fontSize={20}/></label>
      <span className="font-bold"> {commentsLength || post?.comments.length} </span>
      </div>
      </div>
      
      {/* Comments Section */}
            {/* Toggle Comments Button */}
            {post.comments?.length > 3 && (
        <span
          onClick={() => setShowAllComments((prev) => !prev)}
        >
          {showAllComments ? "Show Less" : "Show All Comments"}
        </span>
      )}
      <AddCommentForm 
       author={post?.author}
       showAllComments={showAllComments} 
       setCommentsLength={setCommentsLength} 
       comments={post?.comments} 
       id={post?.id} />
    </div>
  );
}
