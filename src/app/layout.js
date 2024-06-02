// src/app/layout.js
"use client";
import '../styles.css';
import { useEffect } from 'react';
import Link from 'next/link';
import RouteChangeHandler from '@/utils/RouterChangeHandler';

export default function RootLayout({ children }) {
  useEffect(() => {
    RouteChangeHandler(); // Initialize the RouteChangeHandler
  }, []);
  
  return (<>
    <html lang="en">
      <head>
        <title>Blog Application</title>
      </head>
      <body>
      <header>
        <nav>
          <Link href="/" passHref legacyBehavior>
            <a className="home-button">Go to Home</a>
          </Link>
        </nav>
      </header>
        <div className="container">
          {children}
        </div>
      </body>
    </html>
  </>
  );
}
