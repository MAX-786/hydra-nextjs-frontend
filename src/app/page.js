// src/app/page.js
"use client";
import { notFound } from "next/navigation";
import ploneClient from "@plone/client";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
// import { Slate, Editable, withReact } from "slate-react";
// import { createEditor } from "slate";
import { onEditChange } from "@/utils/hydra";
import Link from "next/link";
import { getTokenFromCookie } from "@/utils/hydra";
import { getEndpoint } from "@/utils/getEndpoints";

export default function Home() {
  const token = getTokenFromCookie();
  const client = ploneClient.initialize({
    apiPath: "https://hydra.pretagov.com/",
    token: token,
  });
  const { getContentQuery } = client;
  const { data, isLoading } = useQuery(getContentQuery({ path: "/" }));
  // const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState(data);
  useEffect(() => {
    onEditChange((updatedData) => {
      if (updatedData) {
        setValue(updatedData);
      }
    });
  }, [data]);

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
          {value?.items.map((blog, index) => {
            if (blog["@type"] === "Document") {
              return (
                <li key={index} className="blog-list-item">
                  <Link href={`/${getEndpoint(blog["@id"])}`} legacyBehavior>
                    <a>{blog.title}</a>
                  </Link>
                </li>
              );
            }
          })}
          {value?.blocks_layout.items.map((id, index) => {
            if (value.blocks[id]["@type"] === "slate") {
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
            } else if (value.blocks[id]["@type"] === "image") {
              const image_url = value.blocks[id].url;
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
