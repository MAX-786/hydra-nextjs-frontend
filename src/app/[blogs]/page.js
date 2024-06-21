"use client";
import Link from "next/link";
import { notFound } from "next/navigation";
import ploneClient from "@plone/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { onEditChange, getTokenFromCookie } from "@/utils/hydra";
import { getEndpoint } from "@/utils/getEndpoints";

export default function Home({ params }) {
  const client = ploneClient.initialize({
    apiPath: "http://localhost:8080/Plone/",
    token: getTokenFromCookie(),
  });

  const { getContentQuery } = client;
  const { data, isLoading } = useQuery(
    getContentQuery({ path: `/${params.blogs}` })
  );

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

  const ItemList = () => {
    const valueItems = value?.items ? value.items : data.items;
    return (
      <ul className="blog-list">
        {valueItems.map((blog, index) => (
          <li key={index} className="blog-list-item">
            <Link
              href={`${params.blogs}/${getEndpoint(blog["@id"])}`}
              legacyBehavior>
              <a>{blog.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  if (!data) {
    return notFound();
  } else {
    return (
      <div className="home">
        <h1 className="home-title">
          {value?.title ? value.title : data.title}
        </h1>
        <ItemList />
      </div>
    );
  }
}
