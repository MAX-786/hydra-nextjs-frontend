"use client";
import { notFound } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Breadcrumb } from "semantic-ui-react";
import { getTokenFromCookie, onEditChange } from "@/utils/hydra";
import { getEndpoint } from "@/utils/getEndpoints";
import { fetchContent } from "@/utils/api";
import SlateBlock from "@/components/SlateBlock";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData(token = null) {
      try {
        const apiPath = "https://hydra.pretagov.com";
        const path = "";
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
  }, []);

  const [value, setValue] = useState(data);

  useEffect(() => {
    onEditChange((updatedData) => {
      if (updatedData) {
        setValue(updatedData);
      }
    });
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!value) {
    setValue(data);
  }

  if (!data) {
    return notFound();
  }

  return (
    <div className="home">
      <h1 className="home-title">{value?.title ? value.title : data.title}</h1>
      <ul className="blog-list">
        {value?.blocks_layout.items.map((id, index) => {
          if (value.blocks[id]["@type"] === "slate") {
            const slateValue = value.blocks[id].value;
            return (
              <li key={id} className="blog-list-item" data-block-uid={`${id}`}>
                <SlateBlock value={slateValue} />
              </li>
            );
          } else if (value.blocks[id]["@type"] === "image") {
            const image_url = value.blocks[id].url;
            return (
              <li key={id} className="blog-list-item" data-block-uid={`${id}`}>
                <img src={image_url} alt="" width={100} height={100} />
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
}
