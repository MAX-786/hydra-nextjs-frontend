export default function extractEndpoints(url) {
    const baseUrl = "https://hydra.pretagov.com/";
    if (url.startsWith(baseUrl)) {
      return url.split(baseUrl)[1];
    } else {
      return url;
    }
  }
  