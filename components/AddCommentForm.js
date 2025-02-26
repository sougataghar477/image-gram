'use client';
 
import Comment from "./Comment";
import { AppContext } from "./ContextWrapper";
import { useState, useContext,useRef } from "react";
 
export default function AddCommentForm({ author,comments, id }) {

 
  let reversedComments = [...(comments || [])].reverse();

   
  const userContext = useContext(AppContext);
  const [replyFlag, setReplyflag] = useState({ flag: false, id: '',selectedElement:'' });
  const [replies,setReplies]=useState([])
  let submitComment = (e) => {
    e.preventDefault();
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
          
          
          
          setComments(data?.replies?.reverse());
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
        .then(data => { setComments(data?.comments?.reverse());e.target.parentElement.parentElement.scrollTo({top:0,behavior:'smooth'});setInputComment('') })
        .catch(error => console.error("Error:", error));
    }

  }
  let [inputComment, setInputComment] = useState("");
  let [postComments, setComments] = useState([]);
  // setComments(comments)
  let a = postComments.length > 0 ? postComments.reverse() : reversedComments;
 
  return <>
    {a?.map((comment, index) => {
      return <Comment
      commentAuthor={comment?.commenter}
      postAuthor={author}
      setReplyflag={setReplyflag}  
      setInputComment={setInputComment} 
      replies={replies}
      setReplies={setReplies} 
      comment={comment} 
      key={index}
      postId={id}
      setComments={setComments}
      />
    })}
    <form onSubmit={submitComment} className="flex gap-4">
      <input
        value={inputComment}
        id="commentInput"
        className="w-full p-2 border-slate-800 border-2 rounded-lg"
        onInput={e => {setInputComment(e.target.value);}} />
      <button type="submit" className=" rounded-lg px-4 bg-sky-600 text-white">Comment</button>
      
    </form>
    <div>

    </div>
    {JSON.stringify(replyFlag)}
  </>
}