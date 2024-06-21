"use client";
import { notFound } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Breadcrumb } from "semantic-ui-react";
import { getTokenFromCookie, onEditChange } from "@/utils/hydra";
import { getEndpoint } from "@/utils/getEndpoints";
import { fetchContent } from "@/utils/api";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData(token = null) {
      try {
        const apiPath = "http://localhost:8080/Plone";
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

  const renderBreadcrumb = () => (
    <Breadcrumb>
      <Breadcrumb.Section link>
        <Link href="/">Home</Link>
      </Breadcrumb.Section>
      <Breadcrumb.Divider />
      {value?.items.map(
        (item, index) =>
          item["@type"] === "Document" && (
            <React.Fragment key={index}>
              <Breadcrumb.Section link>
                <Link href={`/${getEndpoint(item["@id"])}`}>{item.title}</Link>
              </Breadcrumb.Section>
              {index < value.items.length - 1 && <Breadcrumb.Divider />}
            </React.Fragment>
          )
      )}
    </Breadcrumb>
  );

  return (
    <div className="home">
      <h1 className="home-title">{value?.title ? value.title : data.title}</h1>
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
              <li key={id} className="blog-list-item" data-block-uid={`${id}`}>
                <pre className="pre-block">
                  {JSON.stringify(slateValue, null, 2)}
                </pre>
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
