'use client';
 import EmotePicker from "./EmotePicker";
import Comment from "./Comment";
import { AppContext } from "./ContextWrapper";
import { useState, useContext,useRef } from "react";
import { useSession } from "next-auth/react";
export default function AddCommentForm({ author,comments,id,showAllComments,setCommentsLength }) {
let {status}=useSession()
 
  let reversedComments = [...(comments || [])].reverse();

  const [showEmojiPicker,setPicker] =useState(false);
  const userContext = useContext(AppContext);
  const [replyFlag, setReplyflag] = useState({ flag: false, id: '',selectedElement:'' });
  const [replies,setReplies]=useState([])
  let submitComment = (e) => {
    e.preventDefault();
    if(status==="unauthenticated"){
              toast("You need to be logged in to like or comment", { position: "bottom-right",style: {
                background: "#0ea5e9",  
                color: "#fff", // White text
              }, },);
              return
    }
    if(status==="authenticated"){
    if (replyFlag.flag) {
      fetch("https://image-gram-neon.vercel.app"+"/api/addReply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          author:author,
          self:author === userContext.state.user.username,
          avatar: userContext.state.user.avatar,
          replier: userContext.state.user.username,
          reply: inputComment,
          postId: id,
          commentId: replyFlag.id
        })
      })
        .then(response => response.json())
        .then(data => {
          setTimeout(() => {
            
            e.target.parentElement.querySelector("#p" + (replyFlag.selectedElement || replyFlag.id))?.scrollIntoView({ 
              behavior: 'smooth',
               
            });
          }, 300); // Adjust the delay (300ms) as needed
          
          
          
          setComments(data.replies);
          setReplyflag({ flag: false, id: '',selectedElement:'' });

        })
        
        .catch(error => console.error("Error:", error));
    }
    else {
      fetch("https://image-gram-neon.vercel.app"+"/api/addComment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          author:author,
          self:author === userContext.state.user.username,
          avatar: userContext.state.user.avatar,
          commenter: userContext.state.user.username,
          comment: inputComment,
          postId: id
        })
      })
        .then(response => response.json())
        .then(data => {setCommentsLength(data?.comments?.length); setComments(data.comments);e.target.parentElement.parentElement.scrollTo({top:0,behavior:'smooth'});setInputComment('') })
        .catch(error => console.error("Error:", error));
    }
}
  }
  let [inputComment, setInputComment] = useState("");
  let [postComments, setComments] = useState([]);
  // setComments(comments)
  let a = postComments.length > 0 ? [...postComments].slice().reverse() : reversedComments;
  const displayedComments = showAllComments ? a.slice() : a.slice(0, 3);
  return <>
{displayedComments.map((comment, index) => (
  <Comment
    key={index}
    commentAuthor={comment?.commenter}
    postAuthor={author}
    setReplyflag={setReplyflag}
    setInputComment={setInputComment}
    replies={replies}
    setReplies={setReplies}
    comment={comment}
    postId={id}
    setComments={setComments}
  />
))}
    <form onSubmit={submitComment} className="relative flex gap-2 items-center">
      <input
        value={inputComment}
        required
        id={"commentInput"+id}
        className="w-full p-2 border-slate-800 border-2 rounded-lg"
        onInput={e => {setInputComment(e.target.value);}} />
        <span className="cursor-pointer" onClick={()=> setPicker(prev => !prev)} title="Click me to select emojis">😀</span>
        {showEmojiPicker && <EmotePicker setPicker={setPicker} setInputComment={setInputComment} fromCommentForm={true} />}
      <button type="submit" className=" rounded-lg p-2 bg-sky-600 text-white">Comment</button>
      
    </form>
 
  </>
}