"use client";
import { useSession } from "next-auth/react";
import { useState,useContext } from "react";
import { supabase } from "@/utils/supabaseClient";
import { AppContext } from "@/components/ContextWrapper";
import { ToastContainer, toast } from 'react-toastify';
import EmotePicker from "@/components/EmotePicker";
export default function Create() {
  const {status}=useSession();
  const [showPicker,setPicker]= useState(false)
  const [previewImage,setPreviewImage]=useState(null);
  const username = useContext(AppContext)?.state?.user?.username;
  console.log(username)
  const [file, setFile] = useState(null);
  const [description,setDescription]=useState('');
  const [uploading, setUploading] = useState(false);
 
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || status === "unauthenticated") {
       
        toast("Please select a file", { position: "bottom-right",style: {
          background: "#0ea5e9",  
          color: "#fff", // White text
        }, },);
        return;
    }

    setUploading(true);
    setMessage("");

    try {
        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage
            .from("imagegram") // Your bucket name
            .upload(`uploads/${Date.now()}_${file.name}`, file);

        if (error) {
            throw new Error(`Upload failed: ${error.message}`);
        }

        // Get the public URL of the uploaded file
        let dataPath  = supabase.storage.from("imagegram").getPublicUrl(data.path);
        let image = dataPath.data.publicUrl;
        console.log("Uploaded file URL:", image);

        // Send POST request to your API
        const response = await fetch("https://image-gram-neon.vercel.app"+"/api/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username, // Ensure username is defined
                description, // Ensure description is defined
                image
            })
        });

        if (!response.ok) {
            throw new Error("Failed to create post.");
        }

        const responseData = await response.json();
        console.log("Server Response:", responseData);
        setMessage("Upload successful!");
        toast("Successfully Uploaded", { position: "bottom-right",style: {
            background: "#0ea5e9",  
            color: "#fff", // White text
          }, },);
         
        
    } catch (err) {
        setMessage(err.message);
        console.error(err);
    } finally {
        setUploading(false);
    }
};
if(status==="authenticated"){
  return <div className="grid place-items-center basis-[320px] flex-grow max-w-[640px]">
  <ToastContainer />
<form className="w-full [&>*]:mt-4" onSubmit={handleUpload}>
  <h1>Create</h1>
  {previewImage && <div className="mt-4">
    <h1 className="font-bold">Preview</h1>
  <img className="mt-4 max-w-[320px]" src={previewImage}/></div>}
  <div className="relative">
  <textarea
    className="border-2 border-sky-500 w-full p-4 placeholder:italic"
    placeholder="Enter Description"
    value={description}
    onChange={e => setDescription(e.target.value)}
  >
  </textarea>
    {/* {showPicker && <EmotePicker setDescription={setDescription} setPicker={setPicker}/>} */}
    <span onClick={()=> setPicker(prev => !prev)} className="absolute right-2 top-1/2 -translate-y-1/2">😳</span>
  </div>
  
  <input
    className="w-full file:rounded-full file:border-0 file:bg-sky-500 file:text-white file:px-4 file:py-2 file:text-sm file:font-semibold"
    type="file"
    onChange={(e) => {setPreviewImage((URL.createObjectURL(e.target.files[0])));setFile(e.target.files?.[0] || null)}}
  />
  <button
    className="rounded-full border-0 bg-sky-500 text-white px-4 py-2 text-sm font-semibold disabled:opacity-50"
    type="submit"
    disabled={uploading}
  >
    {uploading ? "Uploading..." : "Upload"}
  </button>

</form>


</div>
}
 else{
  return <h1>You Need To Be Logged In</h1>
 }
}
