"use client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { onEditChange, getTokenFromCookie } from "@/utils/hydra";
import { getEndpoint } from "@/utils/getEndpoints";
import { fetchContent } from "@/utils/api";

export default function Home({ params }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(data);

  useEffect(() => {
    async function getData(token = null) {
      try {
        const apiPath = "http://localhost:8080/Plone";
        const path = `${params.blogs}`;
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
  }, [params.blogs]);

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
      <div className="blog">
        <h1 className="blog-title">
          {value?.title ? value.title : data.title}
        </h1>
        <ItemList />
      </div>
    );
  }
}
