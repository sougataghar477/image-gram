'use client';
import {  useEffect,useState } from "react";
import { useSession } from "next-auth/react";
import PostFeed from "./PostFeed";
import SignIn from "./SignIn";
export default  function Feed(){
    let [posts,setPosts]=useState([]);
    let {status,data} =useSession();
    
    let id=data?.user?.email;
    

    useEffect(() => {
      const sendData = async () => {
        if (status === "authenticated") {
          try {
            const response = await fetch(process.env.NEXT_PUBLIC_URL+"/api/fetchposts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id }),
            });
    
            const data = await response.json();
             
            setPosts(data.posts)
            console.log("Response:", data);
          } catch (error) {
            console.error("Error:", error);
          }
        }
      };
    
      sendData();
    }, [status, data,id]); // ✅ Correct dependencies
    
     
    return <div>
        {status==="loading"?<div className="fixed top-1/2 left-1/2">Loading</div>:status==="authenticated"?
        <>{posts.map((post,index) => <PostFeed post={post} key={post.id}/>)}</>
        : <SignIn/>}      
    </div>
}