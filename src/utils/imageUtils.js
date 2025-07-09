// Utility function to handle image URLs
export const getImageUrl = (url) => {
  if (!url) return "";

  // If the URL is already using our proxy, return as is
  if (url.includes("wear2ndchance.vercel.app")) {
    return url;
  }

  // If the URL is from our backend server, use the proxy
  if (url.includes("45.119.82.37:8080")) {
    return url.replace(
      "http://45.119.82.37:8080",
      "https://wear2ndchance.vercel.app"
    );
  }

  // If the URL is relative, prepend the current origin
  if (url.startsWith("/")) {
    return `${window.location.origin}${url}`;
  }

  return url;
};
