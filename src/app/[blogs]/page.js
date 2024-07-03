"use client";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { initBridge, getTokenFromCookie } from "#utils/hydra";
import BlocksList from "@/components/BlocksList";
import { fetchContent } from '#utils/api';

export default function Home({ params }) {
  const bridge = initBridge("https://hydra.pretagov.com");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(data);

  useEffect(() => {
    async function getData(token = null) {
      try {
        const apiPath = "https://hydra.pretagov.com";
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
    bridge.onEditChange((updatedData) => {
      if (updatedData) {
        setValue(updatedData);
      }
    });
  },[bridge]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!value) {
    setValue(data);
  }

  if (!data) {
    return notFound();
  } else {
    return (
      <div className="blog">
        <h1 className="blog-title">
          {value?.title ? value.title : data.title}
        </h1>
        <BlocksList data={value} />
      </div>
    );
  }
}
