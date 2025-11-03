"use client";

import { useSession } from "next-auth/react";
import { useState, useContext } from "react";
import { supabase } from "@/utils/supabaseClient";
import { AppContext } from "@/components/ContextWrapper";
import { ToastContainer, toast } from "react-toastify";
import EmotePicker from "@/components/EmotePicker";
import { v4 as uuidv4 } from "uuid";
import "react-toastify/dist/ReactToastify.css";

export default function Create() {
  const { status } = useSession();
  const [showPicker, setPicker] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const username = useContext(AppContext)?.state?.user?.username;
  console.log("Username:", username);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      toast("Please select a file", {
        position: "bottom-right",
        style: { background: "#0ea5e9", color: "#fff" },
      });
      return;
    }

    if (status === "unauthenticated") {
      toast("You must be logged in to upload", {
        position: "bottom-right",
        style: { background: "#0ea5e9", color: "#fff" },
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast("Please upload an image file only", {
        position: "bottom-right",
        style: { background: "#0ea5e9", color: "#fff" },
      });
      return;
    }

    setUploading(true);

    try {
      // Create a unique file path
      const filePath = `uploads/${uuidv4()}_${file.name}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("plantgram-images")
        .upload(filePath, file);

      if (error) throw new Error(`Upload failed: ${error.message}`);

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("plantgram-images")
        .getPublicUrl(filePath);

      const image = publicUrlData.publicUrl;
      console.log("Uploaded file URL:", image);

      // Send POST request to API route
      const response = await fetch("https://image-gram-neon.vercel.app/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, description, image }),
      });

      if (!response.ok) throw new Error("Failed to create post.");

      const responseData = await response.json();
      console.log("Server Response:", responseData);

      toast.success("Successfully Uploaded", {
        position: "bottom-right",
        style: { background: "#0ea5e9", color: "#fff" },
      });

      // Reset form
      setFile(null);
      setPreviewImage(null);
      setDescription("");
    } catch (err) {
      console.error(err);
      toast.error(`Error: ${err.message}`, {
        position: "bottom-right",
        style: { background: "#ef4444", color: "#fff" },
      });
    } finally {
      setUploading(false);
    }
  };

  if (status === "authenticated") {
    return (
      <div className="grid place-items-center basis-[320px] flex-grow max-w-[640px] p-4">
        <ToastContainer />
        <form className="w-full [&>*]:mt-4" onSubmit={handleUpload}>
          <h1 className="text-xl font-semibold">Create Post</h1>

          {previewImage && (
            <div className="mt-4">
              <h2 className="font-bold">Preview</h2>
              <img
                className="mt-4 max-w-[320px] rounded-md border border-sky-200"
                src={previewImage}
                alt="Preview"
              />
            </div>
          )}

          <div className="relative">
            <textarea
              className="border-2 border-sky-500 w-full p-4 placeholder:italic rounded-md"
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {showPicker && (
              <EmotePicker
                previewImage={previewImage}
                setDescription={setDescription}
                setPicker={setPicker}
              />
            )}
            <span
              onClick={() => setPicker((prev) => !prev)}
              className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2"
            >
              😳
            </span>
          </div>

          <input
            className="w-full file:rounded-full file:border-0 file:bg-sky-500 file:text-white file:px-4 file:py-2 file:text-sm file:font-semibold"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) {
                setPreviewImage(URL.createObjectURL(selectedFile));
                setFile(selectedFile);
              }
            }}
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
    );
  } else {
    return <h1 className="text-center text-lg font-semibold">You Need To Be Logged In</h1>;
  }
}
