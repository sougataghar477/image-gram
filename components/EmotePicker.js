'use client';
import { usePathname } from "next/navigation";
import EmojiPicker from "emoji-picker-react";
export default function EmotePicker({setPicker,setInputComment,fromCommentForm,setDescription,previewImage}){
    const path=usePathname();
    let classEmotePicker="";
    if(path==="/create"){
        if(previewImage){
            
        }
    }
    console.log(path)
    return <div className={`absolute ${path === '/create' ? (previewImage ? "bottom-0" : "") : "top-0"}`}
>
        <EmojiPicker onEmojiClick={emoji => {
            setPicker(false);
            fromCommentForm?
            setInputComment(prev => `${prev} ${emoji.emoji}`):
            setDescription(prev => `${prev} ${emoji.emoji}`)
        }}
        />
    </div>
}
