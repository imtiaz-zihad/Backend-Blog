import CreateBlogFormServer from "@/components/modules/user/createBlog/CreateBlogFormServer";
import { blogService } from "@/services/blog.service";
import { BlogPost } from "@/types";

export default async function CreateBlogPage() {
  const { data } = await blogService.getBlogPosts();

  return (
    <div>
      <CreateBlogFormServer />

      {data.data.map((item: BlogPost) => (
        <p key={item.id}>{item.title}</p>
      ))}
    </div>
  );
}
