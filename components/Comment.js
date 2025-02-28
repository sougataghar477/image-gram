'use client';
import { useState,useContext,useEffect } from "react";
 
import { AppContext } from "./ContextWrapper";
import Link from "next/link";
export default function Comment({ commentAuthor,postAuthor,comment, replies,setComments, setInputComment, setReplyflag,postId }) {
  let userContext=useContext(AppContext);
  let username =userContext?.state?.user?.username;
  let selectedElementRefId=userContext.selectedElementRefId;
 
  let [showReplies, setShowReplies] = useState(false);
  
   console.log(comment.replies);
    useEffect(() => {
      if (selectedElementRefId ===comment.commentId) {
        setShowReplies(true);
      }
    }, [selectedElementRefId,comment.commentId]);
  let handleLikes=(comment,commentType,commentId,replyId,isLiked)=>{

    if(commentType==='Main Comment'){
      fetch('https://image-gram-neon.vercel.app'+'/api/addLikes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          commentAuthor:commentAuthor,
          postAuthor:postAuthor,
          self:commentAuthor === postAuthor,
          comment:comment,
          commentType:commentType,
          username:username,
          postId:postId,
         commentId:commentId,
         isLiked:isLiked
        
        })
      })
      .then(response => response.json())
      .then(data => { setComments(data.data.reverse())})
      .catch(error => console.error('Error:', error));
    }
    else{
      fetch('https://image-gram-neon.vercel.app'+'/api/addLikes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          commentAuthor:commentAuthor,
          postAuthor:postAuthor,
          self:commentAuthor === postAuthor,
          comment:comment,
          commentType:commentType,
          username:username,
          postId:postId,
          replyId:replyId,
         commentId:commentId,
         isLiked:isLiked
        
        })
      })
      .then(response => response.json())
      .then(data => { setComments(data?.data?.reverse())})
      .catch(error => console.error('Error:', error));
    }
    
  }
  return <>
    <div className="flex">
      {comment?.avatar &&       <img className="w-12 h-12 rounded-full object-cover"
        src={comment?.avatar}

      />}

      <div>
        <Link href={"/profile/" + comment.commenter}>
          <b>{comment?.commenter}</b>
        </Link>
        <p id={'p'+comment.commentId}>{comment.comment}</p>
        <div className="flex gap-4 text-sm font-semibold">
{ comment?.likes &&        <span
  className={`${comment?.likes?.includes(username) ? 'text-red-600' : ''} cursor-pointer`}
  onClick={() => handleLikes(comment.comment,'Main Comment', comment.commentId, '', comment?.likes?.includes(username))}
>
 
  {comment?.likes?.length > 1
    ? `${comment?.likes?.length} likes`
    : comment?.likes?.length === 0 || !comment?.likes
      ? 'Like'
      : '1 Like'}
</span>
}
{comment?.comment && <label
  className="cursor-pointer"
  onClick={() => {
    setInputComment(`@${comment.commenter} `);
    setReplyflag({ flag: true, id: comment.commentId });
  }}
  htmlFor={"commentInput"}
>
  <span>Reply</span>
</label>}

        </div>
        <div className="ml-4">
        <p className="cursor-pointer text-sky-600" onClick={() => {setShowReplies(prev => !prev) }}>
            {comment?.replies?.length > 0 ?
              (showReplies ?
                'Hide ' + (replies?.replies?.length || comment?.replies?.length) +
                (replies?.replies?.length === 1 || comment?.replies?.length === 1 ? ' Reply' : ' Replies')
                : 'Show ' + (replies?.replies?.length || comment.replies.length) +
                (replies?.replies?.length === 1 || comment.replies?.length === 1 ? ' Reply' : ' Replies')
              )
              : null}
          </p>
          {/* {.toString()} */}
          {
            
            comment.replies && (showReplies)
              ? comment.replies.map((commentReplyfromProps) => (
              <div key={commentReplyfromProps.replyId}>
                <div className="flex">
                   
                  <img className="w-12 h-12 rounded-full object-cover" src={commentReplyfromProps.avatar}/>
                  <div>
                 <Link href={'/profile/'+commentReplyfromProps.replier}><b>{commentReplyfromProps.replier}</b></Link>
                 <p id={'p'+commentReplyfromProps.replyId}>{commentReplyfromProps.reply}</p>
                  <div className="flex gap-4 text-sm">
                  <span 
                  className={`${commentReplyfromProps?.likes?.includes(username) ? 'text-red-600' : ''} cursor-pointer`}
                  onClick={()=>{handleLikes(commentReplyfromProps.reply,'Nested Comment',comment.commentId,commentReplyfromProps.replyId,commentReplyfromProps?.likes?.includes(username)); }}>
                             
                              {(commentReplyfromProps?.likes?.length > 1) 
            ? `${commentReplyfromProps?.likes?.length} likes`
            : (commentReplyfromProps?.likes?.length === 0) 
              ? 'Like' 
              : '1 Like'
          }
                    </span>

                 <label
                   className="cursor-pointer"
                   onClick={(e) => {
                    console.log(commentReplyfromProps.replyId)
                    
                   setInputComment("@" + e.target.parentElement.parentElement.parentElement.children[0].textContent + " ");
                setReplyflag({ flag: true, id: comment.commentId,selectedElement:commentReplyfromProps.replyId });

                }
                  } htmlFor="commentInput">
                  <span>Reply</span>
                </label>
              </div>
                </div>
                </div>
                

                </div>
              ))
              : null}

        </div>
      </div>

    </div>




  </>
}