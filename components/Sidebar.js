'use client'; 
import { use, useContext,useEffect,useState } from "react";
import { AppContext } from "./ContextWrapper";
import Link from "next/link"
export default function Sidebar(){
    const userContext  = useContext(AppContext);
    const username=userContext?.state?.user?.username;
    let [notificationsLength,setNotificationsLength]=useState(0)
    useEffect(()=>{
        fetch('http://localhost:3000/api/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
             author:userContext?.state?.user?.username
            })
        })
        .then(response => response.json())
        .then(data => {setNotificationsLength(data?.notifications?.length)})
        .catch(error => console.error('Error:', error));
        
    },[userContext?.state?.user?.username,notificationsLength])
    return <aside className="max-w-fit font-bold leading-7">
                <ul>
                    <Link href={'/'}><li className="mt-4">Home</li></Link>
                    <li className="mt-4">Search</li>
                    <Link href={'/notifications'}><li className="mt-4 relative">
                        Notifications
                        <span className="absolute text-xs rounded-full p-[0.5px] bg-sky-400 text-white">{notificationsLength}</span>
                        </li></Link>
                     
                    <Link href={'/create'}><li className="mt-4">Create</li></Link>
                    <Link href={'/profile/'+username}><li className="mt-4">Profile</li></Link>
                </ul>
          </aside>
}
