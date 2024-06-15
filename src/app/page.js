// src/app/page.js
"use client";
import { notFound } from "next/navigation";
import ploneClient from "@plone/client";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor } from "slate";
import { onEditChange } from "@/utils/hydra";

export default function Home() {
  const client = ploneClient.initialize({
    apiPath: "http://localhost:8080/Plone/",
    token: "",
  });
  const { getContentQuery } = client;
  const { data, isLoading } = useQuery(getContentQuery({ path: "/" }));
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState(data);
  useEffect(() => {
    onEditChange(data, (updatedData) => {
      if (updatedData) {
        setValue(updatedData);
      }
    });
  },[data]);
  
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
          {data.blocks_layout.items.map((id, index) => {
            if (data.blocks[id]["@type"] === "slate") {
              const slateValue = data.blocks[id].value;
              return (
                <li key={id} className="blog-list-item">
                  {/* <Slate editor={editor} initialValue={slateValue}>
                    <Editable readOnly={true} />
                  </Slate> */}
                  <pre className="pre-block">{JSON.stringify(slateValue, null, 2)}</pre>
                </li>
              );
            }
          })}
        </ul>
      </div>
    );
  }
}
