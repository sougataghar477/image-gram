'use client';
import { usePathname } from "next/navigation";
import EmojiPicker from "emoji-picker-react";
export default function EmotePicker({setPicker,setInputComment,fromCommentForm,setDescription,previewImage}){
    const path=usePathname();
    console.log(path)
    return <div className={`absolute  ${previewImage ? "bottom-0" : ""}`}>
        <EmojiPicker onEmojiClick={emoji => {
            setPicker(false);
            fromCommentForm?
            setInputComment(prev => `${prev} ${emoji.emoji}`):
            setDescription(prev => `${prev} ${emoji.emoji}`)
        }}
        />
    </div>
}
