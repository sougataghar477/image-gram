'use client';
import { signIn } from "next-auth/react";
import Link from "next/link";
 
import { useState } from "react";
export default  function SignIn(){
    let [email,setEmail]=useState("");
    let [password,setPassword]=useState("");
 
    let handleSign= function(e){
        e.preventDefault();
        const result =signIn("credentials", {
            redirect: false,
            email,
            password,
          });
      
 
    }
    return <form className="mt-[25%]" onSubmit={handleSign}>
        <h1 className="mb-8 font-bold">Sign In</h1>
        <input className="max-w-[480px] mx-auto mb-8 border-2 border-sky-500 w-full py-4 px-2 placeholder:italic" onInput={e => setEmail(e.target.value)} placeholder="Email" type="email"/>
        <input className="max-w-[480px] mx-auto mb-8 border-2 border-sky-500 w-full py-4 px-2 placeholder:italic" onInput={e => setPassword(e.target.value)} placeholder="Password" type="password"/>
        <button className="block rounded-full border-0 bg-sky-500 text-white px-4 py-2 text-sm font-semibold disabled:opacity-50" type="submit">Submit</button>
        <Link href={'/register'}><span className="font-bold">Need an account ? Register</span></Link>
    </form>
}