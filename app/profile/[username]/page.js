'use client';
import {use,useState,useEffect, useContext} from "react";
 
import Link from "next/link";
import { AppContext } from "@/components/ContextWrapper";
export default  function Profile({params}){
    let {username}= use(params);
    let [theirProfile,setTheirProfile]=useState({});
    let userContext=useContext(AppContext);
    let yourProfile=userContext?.state?.user;
    let setUserdata=userContext?.setUserdata;
 
    let followedProfiles=yourProfile?.follows;
    
    useEffect(()=>{
        
    const data =  fetch("https://image-gram-neon.vercel.app"+"/api/user", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username:username })
      }).then(a => a.json()).then(a => { setTheirProfile(a)})
 
     
    },[username])
    
    let handlefollowOrUnfollow = (e) => {
        fetch("https://image-gram-neon.vercel.app/api/followUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            followerUsername: yourProfile?.username, // The user who is following
            followingUsername: theirProfile?.user?.username, // The user being followed
            followStatus:e?.target?.textContent
        }),
        })
          .then((res) => res.json()) // Convert response to JSON
          .then((data1) => {
            console.log("Followed successfully:", data1);
            setUserdata({...data1})
             
          })
          .catch((error) => console.error("Error:", error));
      }

    return <div className="mt-5 basis-[640px]">
        <div className="flex">
            <div className="">
                <img className="rounded-full w-24 h-24 object-cover" src={theirProfile?.user?.avatar}/>
            </div>
            <div>
                <div className="flex gap-2">
                    <h1>{theirProfile?.user?.username}</h1>
                    {theirProfile?.user?.username !== yourProfile?.username?
                    (followedProfiles?.includes(theirProfile?.user?.username)?
                    <button 
                    onClick={handlefollowOrUnfollow}
                      
                    className="border-none bg-slate-800 rounded-md text-white px-2 py-1">Following</button>
                  :<button 
                  onClick={handlefollowOrUnfollow}
                  className="border-none bg-slate-800 rounded-md text-white px-2 py-1">Follow</button>)
                    :null}
                </div>
                <p>{theirProfile?.user?.posts.length} posts</p>
                <p className="font-bold italic">{theirProfile?.user?.name}</p>
                <p className="font-bold">{theirProfile?.user?.bio}</p>
            </div>
        </div>
        <div className="flex flex-wrap mt-5">
            {theirProfile?.user?.posts.length>0?theirProfile?.user?.posts.map((post,index) => 
            <Link key={index} href={`/profile/${username}/${post.id}`}>
                <img className="object-cover object-top w-[300px] h-[300px]" key={index} src={post.image}/>
            </Link>):<h2 className="font-bold">No Posts. <Link className="underline" href={'/create'}>Create one</Link></h2>}
        </div>
    </div>
}