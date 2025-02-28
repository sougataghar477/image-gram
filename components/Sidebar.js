'use client'; 
import { use, useContext,useEffect,useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AppContext } from "./ContextWrapper";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { FaHouseChimney } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { IoIosCreate } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { FaRegRegistered } from "react-icons/fa";
import { PiSignOutBold } from "react-icons/pi";
import { CgSun } from "react-icons/cg";
import { FaMoon } from "react-icons/fa";
export default function Sidebar(){
    const router = useRouter();
    const {status}=useSession();
    const userContext  = useContext(AppContext);
    const theme = userContext?.theme;
    const themeHandler = userContext?.themeHandler;
    const username=userContext?.state?.user?.username;
    let [notificationsLength,setNotificationsLength]=useState(0)
    useEffect(()=>{
        fetch('https://image-gram-neon.vercel.app'+'/api/notifications', {
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
    return <aside className="max-w-fit font-bold leading-7 fixed left-[15%]">
                <ul>
                    <Link href={'/'}><li className="flex items-center gap-2 mt-4"><FaHouseChimney/><span>Home</span></li></Link>
                    <Link href={'/search'}><li className="flex items-center gap-1 mt-4"><FaSearch/><span>Search</span></li></Link>
                    {status === "authenticated" &&<Link href={'/notifications'}><li className="flex items-center gap-1 mt-4 relative">
                    <IoIosNotifications/> <span>Notifications</span>
                        <span className="absolute right-[-12px] bottom-3 text-xs rounded-full p-[0.5px] bg-sky-400 text-white">{notificationsLength}</span>
                        </li></Link>}
                    {status=== "unauthenticated" && <Link href={'/register'}><li  className="flex gap-1 items-center mt-4"><FaRegRegistered/><span>Register</span></li></Link>}
                    {status === "authenticated" && <Link href={'/create'}><li className="flex items-center gap-1 mt-4"><IoIosCreate /><span>Create</span></li></Link>}
                    {status === "authenticated" && <Link href={'/profile/'+username}><li className="flex items-center gap-1 mt-4"><CgProfile/><span>Profile</span></li></Link>}
                    {status === "authenticated" && <li className="flex items-center gap-1 cursor-pointer mt-4" onClick={()=> {signOut();router.push('/')}}><PiSignOutBold/><span>Sign Out</span></li>}
                    <li onClick={()=> themeHandler()} className="cursor-pointer mt-4 flex gap-1 items-center">{theme==="light"?<><FaMoon /><span>Dark Mode</span></>:<><CgSun/><span>Light Mode</span></>}</li>
                </ul>
          </aside>
}
