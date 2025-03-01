'use client';
import EmojiPicker from "emoji-picker-react";
export default function EmotePicker({setPicker,setInputComment,fromCommentForm,setDescription,previewImage}){
    return <div className={"absolute bottom-10"+previewImage?"top-0":''}>
        <EmojiPicker onEmojiClick={emoji => {
            setPicker(false);
            fromCommentForm?
            setInputComment(prev => `${prev} ${emoji.emoji}`):
            setDescription(prev => `${prev} ${emoji.emoji}`)
        }}
        />
    </div>
}
