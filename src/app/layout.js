// src/app/layout.js
import '../styles.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Blog Application</title>
      </head>
      <body>
        <div className="container">
          {children}
        </div>
      </body>
    </html>
  );
}
