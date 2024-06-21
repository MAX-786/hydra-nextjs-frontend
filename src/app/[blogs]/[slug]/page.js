// src/app/blogs/[slug]/page.js
"use client";
import { notFound } from "next/navigation";
import ploneClient from "@plone/client";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { onEditChange, getTokenFromCookie } from "@/utils/hydra";
import { useEffect, useState } from "react";

export default function Blog({ params }) {
  const url = new URL(window.location.href);
  const token = url.searchParams.get("access_token") || getTokenFromCookie();
  const client = ploneClient.initialize({
    apiPath: "https://hydra.pretagov.com/",
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
