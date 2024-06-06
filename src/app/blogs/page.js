// src/app/page.js
"use client";
import Link from "next/link";
import axios from "axios";
import { notFound } from "next/navigation";
import ploneClient from "@plone/client";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const client = ploneClient.initialize({
    apiPath: "http://localhost:8080/Plone/",
    token: process.env.AUTH_TOKEN,
  });
  const { getContentQuery } = client;
  const { data, isLoading } = useQuery(getContentQuery({ path: "/blogs" }));

  function getEndpoint(url) {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const parts = path.split("/");
    return parts[parts.length - 1];
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return notFound();
  } else {
    return (
      <div className="home">
        <h1 className="home-title">{data?.title}</h1>
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
  }
}
