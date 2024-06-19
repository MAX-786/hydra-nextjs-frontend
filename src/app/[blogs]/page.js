"use client";
import Link from "next/link";
import { notFound } from "next/navigation";
import ploneClient from "@plone/client";
import { useQuery } from "@tanstack/react-query";
import { initBridge, getToken } from "@/utils/hydra";
import { useEffect, useState } from "react";
import { onEditChange } from "@/utils/hydra";

export default function Home({params}) {
  const bridge = initBridge("http://localhost:3000");
  const [token, setToken] = useState(bridge._getTokenFromCookie());
  const client = ploneClient.initialize({ apiPath: "http://localhost:8080/Plone/", token: token });

  useEffect(() => {
    getToken().then((token) => {
      setToken(token);
    });
  }, []);

  const { getContentQuery } = client;
  const { data, isLoading } = useQuery(getContentQuery({ path: `/${params.blogs}` }));

  const [value, setValue] = useState(data);
  useEffect(() => {
    onEditChange((updatedData) => {
      if (updatedData) {
        setValue(updatedData);
      }
    });
  });

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
        <h1 className="home-title">{value?.title ? value.title: data.title}</h1>
        <ul className="blog-list">
          {data?.items.map((blog, index) => (
            <li key={index} className="blog-list-item">
              <Link href={`${params.blogs}/${getEndpoint(blog["@id"])}`} legacyBehavior>
                <a>{blog.title}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
