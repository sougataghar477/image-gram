import AddCommentForm from "@/components/AddCommentForm";
import LikePost from "@/components/LikePost";
import { FaRegHeart } from "react-icons/fa6";
import { FaRegComment } from "react-icons/fa";
import { FaRegPaperPlane } from "react-icons/fa6";
import Link from "next/link";
export default async function Post({ params }) {
    let post = await params;
    const data = await fetch(process.env.NEXT_URL+'/api/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: post.username, id: post.post })
    });
    
    const response = await data?.json();
     console.log(response?.post[0])

    return <div className="flex mt-5 gap-5 flex-wrap">
        <img className="max-w-[400px] object-cover" src={response?.post[0]?.image} />
        <div className="relative h-screen overflow-scroll max-w-[400px]">
            <div className="flex gap-2">
                <img className="w-10 h-10 rounded-full" src={response?.avatar} />
                <h1 className="font-bold"><Link href={'/profile/' + post.username}>{response?.username}</Link></h1>
            </div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </p>


            <div className=" bottom-0  bg-white py-8">
                <div className="flex gap-4 mb-4">
                    <LikePost author={response?.post[0]?.author} username={post?.username} id={post?.post} likes={response?.post[0]?.likes}/>
                    <label htmlFor="commentInput"><FaRegComment fontSize={20}/></label>
                    <FaRegPaperPlane fontSize={20}/>
                </div>
                <div>
                <h1 className="font-bold italic">Comments</h1>
 
            </div>
                <AddCommentForm author={response?.post[0]?.author}  id={response?.post[0]?.id} comments={response?.post[0]?.comments || []}/>
            </div>
        </div>

    </div>
}