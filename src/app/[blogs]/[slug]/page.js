// src/app/blogs/[slug]/page.js
"use client";
import { notFound } from "next/navigation";
import ploneClient from "@plone/client";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { initBridge, onEditChange } from "@/utils/hydra";
import { useEffect, useState } from "react";

export default function Blog({ params }) {
  const bridge = initBridge("http://localhost:3000");
  const token = bridge._getTokenFromCookie();
  const client = ploneClient.initialize({
    apiPath: "http://localhost:8080/Plone/",
    token: token,
  });
  const { getContentQuery } = client;
  const pathname = usePathname();
  const { data, isLoading } = useQuery(getContentQuery({ path: pathname }));
  const [value, setValue] = useState(data);

  useEffect(() => {
    onEditChange((updatedData) => {
      if (updatedData) {
        setValue(updatedData);
      }
    });
  });

  if (isLoading) {
    return <div></div>;
  }
  function getEndpoint(url) {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const parts = path.split("/");
    return parts[parts.length - 1];
  }
  if (data) {
    return (
      <div className="blog">
        <h1 className="blog-title">
          {value?.title ? value.title : data.title}
        </h1>
        <ul className="blog-list">
          {data?.items.map((blog, index) => (
            <li key={index} className="blog-list-item">
              <Link href={`blogs/${getEndpoint(blog["@id"])}`} legacyBehavior>
                <a>{blog.title}</a>
              </Link>
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
