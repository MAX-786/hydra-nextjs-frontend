// src/app/layout.js
"use client";
import '../styles.css';
import { useEffect } from 'react';
import Link from 'next/link';

export default function RootLayout({ children }) {

  
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
