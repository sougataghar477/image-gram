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
        let response=await   fetch(process.env.NEXT_PUBLIC_URL+'/api/addLikestoPost', {
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
    
     return <><span  onClick={()=>{handlePostLikes()}} >
        {postLiked?.includes(userContext?.state?.user?.username) || likes?.includes(userContext?.state?.user?.username)?
        <FaHeart fill="red" fontSize={20}/>:
        <FaRegHeart fill="red" fontSize={20}/>}
        
     </span>
     {postLiked?.toString()}
     </>
}