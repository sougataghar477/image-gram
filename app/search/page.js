'use client';
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
export default function Search(){
    let [input,setInput] = useState("");
    const [searchedUsers,setSearchedUsers]= useState([]);
    let handleSearchUser =async (e) =>{
        e.preventDefault();
        try {
            const response = await fetch("https://image-gram-neon.vercel.app"+ "/api/search", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ query:input.trim() }),
            });
  
            const data = await response.json();
            setSearchedUsers(data?.users); 
            console.log("Response:", data);
          } catch (error) {
            console.error("Error:", error);
          }
    }
    return <div className="w-80 mx-auto">
        <form className="mt-4" onSubmit={handleSearchUser}>
        <h1>Search</h1>
            <input placeholder="Enter Username or Name" value={input} onChange={e => setInput(e.target.value)} className="mx-auto mb-8 border-2 border-sky-500 w-full py-4 px-2 placeholder:italic" type="text"/>
            <button className="block rounded-full border-0 bg-sky-500 text-white px-4 py-2 text-sm font-semibold disabled:opacity-50" type="submit">Search User</button>
        </form>
        <div className="mt-4">
        {searchedUsers?.map((user,index)=> <Link href={`/profile/${user.username}`} key={index}><div className="flex items-center mt-4">
            <Image alt="alt" className="object-cover w-10 h-10 rounded-full" src={user.avatar}/>
            <div>
                <p>{user.username}</p>
                <p>{user.name}</p>
            </div>
        </div></Link>)}
        </div>

    </div>
}