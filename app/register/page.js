'use client';
import { useRef,useState } from "react";
import { supabase } from "@/utils/supabaseClient";
export default function Register(){
    let file=useRef(null);
    let formData=useRef({});
    let [password,setPassword] = useState("");
    let [confirmPassword,setConfirmPassword] = useState("");

    const handleSubmit =async (e) =>{
        e.preventDefault();
    
        formData.current = Object.fromEntries(new FormData(e.target).entries());
        console.log(formData.current);
        const { data, error } = await supabase.storage
        .from("plantgramstorage") // Your bucket name
        .upload(`uploads/${Date.now()}_${file.current.name}`, file.current);
        let dataPath  = supabase.storage.from("plantgramstorage").getPublicUrl(data.path);
        let image = dataPath.data.publicUrl;
        console.log("Uploaded file URL:", image);
        await fetch(process.env.NEXT_URL+'/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({...formData.current,image
             
            })
          })
            .then(response => response.json())
            .then(data => console.log('Success:', data))
            .catch(error => console.error('Error:', error));
          
    }
    return <div className="max-w-[400px] mt-4">
        <form onSubmit={handleSubmit}>
            <input required name="name" className="mb-8  border-2 border-sky-500 w-full py-4 px-2 placeholder:italic" type="text" placeholder="Enter Name"/>
            <input required name="username" className="mb-8 border-2 border-sky-500 w-full py-4 px-2 placeholder:italic" type="text" placeholder="Enter username"/>
            <input required name="email" className="mb-8 border-2 border-sky-500 w-full py-4 px-2 placeholder:italic" type="text" placeholder="Enter email"/>
            <textarea required name="bio" className="mb-8 border-2 border-sky-500 w-full py-4 px-2 placeholder:italic" placeholder="Say something about yourself"></textarea>
            <input onChange={e => setPassword(e.target.value)} name="password" className="mb-8 border-2 border-sky-500 w-full py-4 px-2 placeholder:italic" type="password" placeholder="Enter Password"/>
            <input onChange={e => setConfirmPassword(e.target.value)} required name="password" className="mb-8 border-2 border-sky-500 w-full py-4 px-2 placeholder:italic" type="password" placeholder="Enter Password Again"/>
            {password !== confirmPassword && <p>Password do not match</p>}
            <input onChange={e =>{file.current = e.target.files[0];console.log(file);}} required  className="mb-8 w-full file:rounded-full file:border-0 file:bg-sky-500 file:text-white file:px-4 file:py-2 file:text-sm file:font-semibold" type="file"/>
            <button className="rounded-full border-0 bg-sky-500 text-white px-4 py-2 text-sm font-semibold disabled:opacity-50" type="submit">Register</button>
        </form>
    </div>
}