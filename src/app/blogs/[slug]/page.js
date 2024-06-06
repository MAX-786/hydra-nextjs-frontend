// src/app/blogs/[slug]/page.js
"use client";
import { notFound } from "next/navigation";
import ploneClient from "@plone/client";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

export default function Blog({ params }) {
  const client = ploneClient.initialize({
    apiPath: "http://localhost:8080/Plone/",
    token: process.env.AUTH_TOKEN,
  });
  const { getContentQuery } = client;
  const pathname = usePathname();
  const { data, isLoading } = useQuery(getContentQuery({ path: pathname }));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (data) {
    return (
      <div className="blog">
        <h1 className="blog-title">{data.title}</h1>
      </div>
    );
  } else {
    return notFound();
  }

  return "";
}
