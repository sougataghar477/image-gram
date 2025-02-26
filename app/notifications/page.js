'use client';
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import { AppContext } from "@/components/ContextWrapper";
import { useEffect,useContext, useState } from "react";
import Link from "next/link";
export default function Notifications(){
let userContext = useContext(AppContext);
let setselectedElement =userContext?.setselectedElement;
   
let [notifications,setNotifications]=useState([]);
useEffect(() => {
    const fetchNotifications = async () => {
        try {
            const response = await fetch("https://image-gram-neon.vercel.app"+'/api/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    author: userContext?.state?.user?.username
                })
            });

            const data = await response.json();
            setNotifications(data?.notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markNotificationsAsSeen = async () => {
        try {
            const response = await fetch("https://image-gram-neon.vercel.app"+'/api/seenNotifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    author: userContext?.state?.user?.username
                })
            });

            const data = await response.json();
            console.log(data?.notifications);
        } catch (error) {
            console.error('Error marking notifications as seen:', error);
        }
    };

    if (userContext?.state?.user?.username) {
        fetchNotifications();
        markNotificationsAsSeen();
    }
}, [userContext?.state?.user?.username]);

    return <div className="mt-6 max-w-[480px] p-4">
        <h1 className="font-bold">Notifications</h1>
{notifications?.length>0 ? [...(notifications || [])].reverse()?.map((notification,index)=>{
    if(notification.notificationType==="like" && userContext.state.user.username !== notification.notifier){
        return <p onClick={() =>{console.log(notification);
          

        }}  key={index}>
            <Link href={'/profile/'+notification.notifier}><b>{notification.notifier}</b></Link> liked your <Link href={'http://localhost:3000/profile/'+userContext?.state?.user?.username+'/'+notification.postId}>post</Link>
{dayjs(notification?.createdAt).fromNow()}
        </p>
    }
    if(notification?.notificationType==='comment' && userContext.state.user.username !== notification.notifier){
        return <p onClick={() =>{console.log(dayjs(notification.createdAt).fromNow());
            setTimeout(() => {
            
                document?.querySelector("#p" + notification.commentId)?.scrollIntoView({ 
                  behavior: 'smooth',
                   
                });
              }, 4000);
        }}  key={index}>
            <Link href={'/profile/'+notification.notifier}><b>{notification.notifier}</b></Link> commented on your <Link className="underline" href={'http://localhost:3000/profile/'+userContext?.state?.user?.username+'/'+notification.postId}>post</Link>
           {' '} {notification.comment}{' '}{ dayjs(notification?.createdAt).fromNow()}
            </p>
    }
    if(notification?.notificationType==='reply' && userContext.state.user.username !== notification.notifier){
    return <p onClick={() =>{console.log(dayjs(notification.createdAt).fromNow());setTimeout(() => {
            
                document?.querySelector("#p" + notification.commentId)?.scrollIntoView({ 
                  behavior: 'smooth',
                   
                });
              }, 4000);}}  key={index}>
                
        <Link href={'/profile/'+notification?.notifier}><b>{notification?.notifier}</b></Link> replied to your comment {notification.reply} on your <Link href={'http://localhost:3000/profile/'+userContext?.state?.user?.username+'/'+notification.postId}>post</Link>{''} {dayjs(notification.createdAt).fromNow()}
    </p>
    }
    if(notification.notificationType==='liked comment' && userContext.state.user.username !== notification.notifier){
        return <p onClick={() =>{console.log(dayjs(notification.createdAt).fromNow());
            setTimeout(() => {
            
                document?.querySelector("#p" + notification?.commentId)?.scrollIntoView({ 
                  behavior: 'smooth',
                   
                });
              }, 4000);
        }}  key={index}>
            <Link href={'/profile/'+notification?.notifier}><b>{notification?.notifier}</b></Link> liked your comment `{notification.comment}` on your <Link href={'http://localhost:3000/profile/'+notification.postAuthor+'/'+notification.postId}>post</Link>
            {' '} {dayjs(notification?.createdAt).fromNow()}
        </p>
        }
        // Liked Reply
        if(notification?.notificationType==='liked reply' && userContext.state.user.username !== notification.notifier){
            return <p 
            key={index}
            onClick={() => {
              console.log(dayjs(notification?.createdAt).fromNow());
              setselectedElement(notification?.commentId);
              
              setTimeout(() => {
                document?.querySelector(`#p${notification?.commentId}`)?.scrollIntoView({ 
                  behavior: 'smooth',
                });
              }, 4000);
            }}
          >
            <Link href={`/profile/${notification?.notifier}`}>
              <b>{notification?.notifier}</b>
            </Link> liked your comment {notification?.comment} on your  
            <Link href={`/profile/${notification.postAuthor}/${notification.postId}`}>
              post
            </Link> {' '}
            {dayjs(notification?.createdAt).fromNow()}
          </p>
          
            }
}):<h1>No Notifications Yet</h1>}

    </div>
}