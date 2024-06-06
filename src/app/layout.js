// src/app/layout.js
"use client";
import "../styles.css";
import { useEffect } from "react";
import Link from "next/link";
import { initBridge } from "@/utils/hydra";
import TranstackProviders from "@/providers/TranstackProviders";

export default function RootLayout({ children }) {
  useEffect(() => {
    initBridge("https://hydra.pretagov.com");
  }, []);

  return (
    <>
      <html lang="en">
        <head>
          <title>Blog Application</title>
        </head>
        <body>
          <TranstackProviders>
            <header>
              <nav>
                <Link href="/" passHref legacyBehavior>
                  <a className="home-button">Go to Home</a>
                </Link>
                {/* <Link href="/blogs" passHref legacyBehavior>
                  <a className="home-button">Go to Blogs</a>
                </Link> */}
              </nav>
            </header>
            <div className="container">{children}</div>
          </TranstackProviders>
        </body>
      </html>
    </>
  );
}
