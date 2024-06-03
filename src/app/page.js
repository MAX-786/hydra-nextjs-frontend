// src/app/page.js
import Link from "next/link";
import axios from "axios";
import { notFound } from "next/navigation";

async function fetchBlogs() {
  try {
    const res = await axios.get("http://localhost:8080/Plone/++api++/blogs");
    return res.data.items.map((item) => ({
      id: item.id,
      title: item.title,
      url: item["@id"],
    }));
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return null;
  }
}

export default async function Home() {
  const blogs = await fetchBlogs();

  if (!blogs) {
    return notFound();
  }
  function getEndpoint(url) {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const parts = path.split("/");
    return parts[parts.length - 1];
  }
  return (
    <div className="home">
      <h1 className="home-title">Home</h1>
      <ul className="blog-list">
        {blogs.map((blog,index) => (
          <li key={index} className="blog-list-item">
            <Link href={`blogs/${getEndpoint(blog.url)}`} legacyBehavior>
              <a>{blog.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
