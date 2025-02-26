"use client";
import { useState,useContext } from "react";
import { supabase } from "@/utils/supabaseClient";
import { AppContext } from "@/components/ContextWrapper";
import { ToastContainer, toast } from 'react-toastify';
export default function Create() {
const username = useContext(AppContext)?.state?.user?.username;
console.log(username)
  const [file, setFile] = useState(null);
  const [description,setDescription]=useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const notify = () => toast("Wow so easy!");
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
        setMessage("Please select a file!");
        return;
    }

    setUploading(true);
    setMessage("");

    try {
        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage
            .from("plantgramstorage") // Your bucket name
            .upload(`uploads/${Date.now()}_${file.name}`, file);

        if (error) {
            throw new Error(`Upload failed: ${error.message}`);
        }

        // Get the public URL of the uploaded file
        let dataPath  = supabase.storage.from("plantgramstorage").getPublicUrl(data.path);
        let image = dataPath.data.publicUrl;
        console.log("Uploaded file URL:", image);

        // Send POST request to your API
        const response = await fetch(process.env.NEXT_URL+"/api/create", {
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


  return (
    <div className="grid place-items-center basis-[480px] max-w-[480px]">
        <ToastContainer />
      <form className="w-full [&>*]:mt-4" onSubmit={handleUpload}>
        <h1>Create</h1>
        <textarea
          className="border-2 border-sky-500 w-full p-4 placeholder:italic"
          placeholder="Enter Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        ></textarea>
        <input
          className="w-full file:rounded-full file:border-0 file:bg-sky-500 file:text-white file:px-4 file:py-2 file:text-sm file:font-semibold"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button
          className="rounded-full border-0 bg-sky-500 text-white px-4 py-2 text-sm font-semibold disabled:opacity-50"
          type="submit"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
        {/* {message && <p className="text-sm mt-2 text-gray-700">{message}</p>} */}
      </form>
    </div>
  );
}
