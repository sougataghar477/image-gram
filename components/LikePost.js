'use client';
import { useContext,useState,useEffect } from "react";
import { FaRegHeart } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { AppContext } from "./ContextWrapper";
export default function LikePost({author,id,likes}){
 
    let [postLiked,setPostLiked]=useState([]);
    let userContext=useContext(AppContext);
    console.log(author,'Author From LikePost')
    let handlePostLikes =async ()=>{
        let response=await   fetch('https://image-gram-neon.vercel.app'+'/api/addLikestoPost', {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json'
         },
         body: JSON.stringify({
             author:author,
             self:author ===  userContext?.state?.user?.username, 
             username:  userContext?.state?.user?.username,
             postId: id,
             isPostLiked:postLiked?.includes(userContext?.state?.user?.username) || likes?.includes(userContext.state.user.username)})
     })
        let data =await response?.json();
        setPostLiked(data?.data[0]?.likes)
    
     }
    
     return <><span className="cursor-pointer" onClick={()=>{handlePostLikes()}} >
        {postLiked?.includes(userContext?.state?.user?.username) || likes?.includes(userContext?.state?.user?.username)?
        <div className="flex items-center gap-1"><FaHeart fill="red" fontSize={20}/><span className="font-bold">{postLiked?.length || likes?.length}</span></div>:
        <div className="flex items-center gap-1"><FaRegHeart fill="red" fontSize={20}/><span className="font-bold">{postLiked?.length || likes?.length}</span></div>}
        
     </span>
     
     </>
}