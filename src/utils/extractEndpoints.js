export default function extractEndpoints(url) {
    const baseUrl = "http://localhost:8080/Plone/";
    if (url.startsWith(baseUrl)) {
      return url.split(baseUrl)[1];
    } else {
      return url;
    }
  }
  