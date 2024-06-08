// src/app/page.js
"use client";
import { notFound } from "next/navigation";
import ploneClient from "@plone/client";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor } from "slate";

export default function Home() {

  const client = ploneClient.initialize({
    apiPath: "http://localhost:8080/Plone/",
    token: "",
  });
  const { getContentQuery } = client;
  const { data, isLoading } = useQuery(getContentQuery({ path: "/" }));
  const editor = useMemo(() => withReact(createEditor()), []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return notFound();
  } else {
    return (
      <div className="home">
        <h1 className="home-title">{data.title}</h1>
        <ul className="blog-list">
          {data.blocks_layout.items.map((id, index) => {
            if (data.blocks[id]["@type"] === "slate") {
              const slateValue = data.blocks[id].value;
              return (
                <li key={index} className="blog-list-item">
                  <Slate editor={editor} initialValue={slateValue}>
                    <Editable readOnly={true} />
                  </Slate>
                </li>
              );
            }
          })}
        </ul>
      </div>
    );
  }
}
