// src/app/page.js
"use client";
import { notFound } from "next/navigation";
import ploneClient from "@plone/client";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor } from "slate";
import { onEditChange } from "@/utils/hydra";
import Link from "next/link";
import { initBridge, getToken, enableBlockClickListener } from "@/utils/hydra";

// window.location.search.includes("_edit")

export default function Home() {
  const bridge = initBridge("http://localhost:3000");
  const [token, setToken] = useState(bridge._getTokenFromCookie());
  const client = ploneClient.initialize({
    apiPath: "http://localhost:8080/Plone/",
    token: token,
  });
  const { getContentQuery } = client;
  const { data, isLoading } = useQuery(getContentQuery({ path: "/" }));
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState(data);
  useEffect(() => {
    onEditChange((updatedData) => {
      if (updatedData) {
        setValue(updatedData);
      }
    });
  }, [data]);

  useEffect(() => {
    if (
      typeof window !== undefined &&
      window.location.search.includes("_edit")
    ) {
      enableBlockClickListener();
    }
  }, []);

  function getEndpoint(url) {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const parts = path.split("/");
    return parts[parts.length - 1];
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!value) {
    setValue(data);
  }
  if (!data) {
    return notFound();
  } else {
    return (
      <div className="home">
        <h1 className="home-title">
          {value?.title ? value.title : data.title}
        </h1>
        <ul className="blog-list">
          {data?.items.map((blog, index) => (
            <li key={index} className="blog-list-item">
              <Link href={`/${getEndpoint(blog["@id"])}`} legacyBehavior>
                <a>{blog.title}</a>
              </Link>
            </li>
          ))}
          {value?.blocks_layout.items.map((id, index) => {
            if (data.blocks[id]["@type"] === "slate") {
              const slateValue = data.blocks[id].value;
              return (
                <li
                  key={id}
                  className="blog-list-item"
                  data-block-uid={`${id}`}>
                  {/* <Slate editor={editor} initialValue={slateValue}>
                    <Editable readOnly={true} />
                  </Slate> */}
                  <pre className="pre-block">
                    {JSON.stringify(slateValue, null, 2)}
                  </pre>
                </li>
              );
            } else if (data.blocks[id]["@type"] === "image") {
              const image_url = data.blocks[id].url;
              return (
                <li
                  key={id}
                  className="blog-list-item"
                  data-block-uid={`${id}`}>
                  <img src={image_url} alt="" width={100} height={100} />
                </li>
              );
            }
          })}
        </ul>
      </div>
    );
  }
}
