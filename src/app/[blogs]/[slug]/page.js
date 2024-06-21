// src/app/blogs/[slug]/page.js
"use client";
import { notFound } from "next/navigation";
import { usePathname } from "next/navigation";
import { onEditChange, getTokenFromCookie } from "@/utils/hydra";
import { useEffect, useState } from "react";
import { fetchContent } from "@/utils/api";

export default function Blog({ params }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  useEffect(() => {
    async function getData(token = null) {
      try {
        const apiPath = "https://hydra.pretagov.com";
        const path = pathname;
        const content = await fetchContent(apiPath, { token, path });
        setData(content);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    const url = new URL(window.location.href);
    const tokenFromUrl =
      url.searchParams.get("access_token") || getTokenFromCookie();
    getData(tokenFromUrl);
  }, [pathname]);

  const [value, setValue] = useState(data);

  useEffect(() => {
    onEditChange((updatedData) => {
      if (updatedData) {
        setValue(updatedData);
      }
    });
  });

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!value) {
    setValue(data);
  }
  if (data) {
    return (
      <div className="blog">
        <h1 className="blog-title">
          {value?.title ? value.title : data.title}
        </h1>
        <ul className="blog-list">
          {value?.items.map((blog, index) => (
            <li key={index} className="blog-list-item">
              {blog.title}
            </li>
          ))}
        </ul>
      </div>
    );
  } else {
    return notFound();
  }

  return "";
}
