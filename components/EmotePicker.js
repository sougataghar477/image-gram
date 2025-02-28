'use client';
import EmojiPicker from "emoji-picker-react";
export default function({setPicker,setInputComment,fromCommentForm,setDescription}){
    return <div className={fromCommentForm?"absolute bottom-10":"absolute bottom-0"}>
        <EmojiPicker onEmojiClick={emoji => {
            setPicker(false);
            fromCommentForm?
            setInputComment(prev => `${prev} ${emoji.emoji}`):
            setDescription(prev => `${prev} ${emoji.emoji}`)
        }}
        />
    </div>
}
