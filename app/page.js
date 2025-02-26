import Feed from "@/components/Feed";
export default async function Home() {
  // const data = await fetch('http://localhost:3000/api/hello')
  // const posts = await data.json();
  // console.log(posts)
  return (
    <>
      <Feed/>
    </>
  );
}
