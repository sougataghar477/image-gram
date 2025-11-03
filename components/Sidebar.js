'use client';
import { useContext, useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppContext } from "./ContextWrapper";
import { FaHouseChimney } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { IoIosNotifications, IoIosCreate } from "react-icons/io";
import { CgProfile, CgSun } from "react-icons/cg";
import { FaRegRegistered, FaMoon } from "react-icons/fa";
import { PiSignOutBold } from "react-icons/pi";

export default function Sidebar() {
  const router = useRouter();
  const { status } = useSession();
  const userContext = useContext(AppContext);
  const theme = userContext?.theme;
  const themeHandler = userContext?.themeHandler;
  const username = userContext?.state?.user?.username;

  const [notificationsLength, setNotificationsLength] = useState(0);

  useEffect(() => {
    fetch("https://image-gram-neon.vercel.app/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        author: userContext?.state?.user?.username,
      }),
    })
      .then((res) => res.json())
      .then((data) => setNotificationsLength(data?.notifications?.length || 0))
      .catch((err) => console.error("Error:", err));
  }, [userContext?.state?.user?.username]);

  return (
    <>
      {/* Mobile Navbar Toggle Button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <label htmlFor="sidebar-toggle" className="cursor-pointer text-2xl">
          ☰
        </label>
      </div>

      {/* Hidden checkbox to control sidebar visibility */}
      <input type="checkbox" id="sidebar-toggle" className="peer hidden" />

      {/* Overlay for mobile */}
      <label
        htmlFor="sidebar-toggle"
        className="fixed z-50 hidden peer-checked:block md:hidden"
      ></label>

      {/* Sidebar */}
      <aside className="
        fixed top-0 left-0 h-full w-72 bg-sky-900 text-white font-bold leading-7 
        transform -translate-x-full peer-checked:translate-x-0 transition-transform duration-300
        md:translate-x-0 md:static md:w-fit md:bg-transparent md:text-inherit z-40
      ">
        {/* Close button (visible only on mobile) */}
        <div className="flex justify-end p-4 md:hidden">
          <label htmlFor="sidebar-toggle" className="cursor-pointer text-xl">✕</label>
        </div>

        <ul className="p-6 space-y-3">
  <Link href={"/"}>
    <li className="flex items-center gap-3 h-8">
      <FaHouseChimney /> <span>Home</span>
    </li>
  </Link>

  <Link href={"/search"}>
    <li className="flex items-center gap-3 h-8">
      <FaSearch /> <span>Search</span>
    </li>
  </Link>

  {status === "authenticated" && (
    <Link href={"/notifications"}>
      <li className="flex items-center gap-3 h-8">
        <div className="relative flex items-center gap-3">
          <IoIosNotifications /> <span>Notifications</span>
          <span className="text-[10px]  bg-sky-400 text-white rounded-full px-[5px]">
            {notificationsLength}
          </span>
        </div>
      </li>
    </Link>
  )}

  {status === "unauthenticated" && (
    <Link href={"/register"}>
      <li className="flex items-center gap-3 h-8">
        <FaRegRegistered /> <span>Register</span>
      </li>
    </Link>
  )}

  {status === "authenticated" && (
    <>
      <Link href={"/create"}>
        <li className="flex items-center gap-3 h-8">
          <IoIosCreate /> <span>Create</span>
        </li>
      </Link>

      <Link href={`/profile/${username}`}>
        <li className="flex items-center gap-3 h-8">
          <CgProfile /> <span>Profile</span>
        </li>
      </Link>

      <li
        onClick={() => {
          signOut();
          router.push("/");
        }}
        className="flex items-center gap-3 h-8 cursor-pointer"
      >
        <PiSignOutBold /> <span>Sign Out</span>
      </li>
    </>
  )}

  <li
    onClick={() => themeHandler()}
    className="flex items-center gap-3 h-8 cursor-pointer"
  >
    {theme === "light" ? (
      <>
        <FaMoon /> <span>Dark Mode</span>
      </>
    ) : (
      <>
        <CgSun /> <span>Light Mode</span>
      </>
    )}
  </li>
</ul>

      </aside>
    </>
  );
}
