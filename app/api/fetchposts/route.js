import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import db from "@/utils/mongo";
export async function POST(request) {
    const body = await request.json();
    
   const email=body.id;
  const user =await db.collection("users").findOne({email:email});
 
  let followedUsers= user.follows;
  const users =await db.collection("users").find().toArray();
   
 
  let posts=[];
  let posts2 = []
  for(let i= 0 ;i<followedUsers.length;i++){
        let currentUser = users.filter(user => user.username === followedUsers[i])[0];
      
        let lastPost= currentUser.posts[currentUser.posts.length-1];
         for(let j = 0;j<currentUser.posts.length;j++){
            let currentPost = currentUser.posts[j]
            posts2.push({...currentPost,avatar:currentUser.avatar,username:currentUser.username})
      }
        posts.push({...lastPost,avatar:currentUser.avatar,username:currentUser.username});
  }
  let sortedPostbyDate = [...posts2].sort((a, b) => (dayjs(b.createdAt).valueOf()) - (dayjs(a.createdAt).valueOf())
);

  console.log('Posts 23',sortedPostbyDate)
  return Response.json({posts:sortedPostbyDate })
  }