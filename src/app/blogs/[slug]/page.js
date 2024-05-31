// src/app/blogs/[slug]/page.js
import axios from 'axios';
import { notFound } from 'next/navigation';

async function fetchBlog(slug) {
  try {
    const res = await axios.get(`http://localhost:8080/Plone/++api++/blogs/${slug}`);
    return {
      id: res.data.id,
      title: res.data.title,
      text: res.data.text,
    };
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

export default async function Blog({ params }) {
  const blog = await fetchBlog(params.slug);

  if (!blog) {
    return notFound();
  }

  return (
    <div className="blog">
      <h1 className="blog-title">{blog.title}</h1>
    </div>
  );
}
