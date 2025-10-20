function descomponerURL(url) {
  const urlObjeto = new URL(url);
  const protocol = urlObjeto.protocol.replace(":", "");
  const hostname = urlObjeto.hostname;
  const ipAdress = /^[0-9.]+$/.test(hostname) ? hostname : null;
  let subDomain = null;
  let domainName = null;
  if (!ipAdress) {
    const parts = hostname.split(".");
    if (parts.length > 2) {
      subDomain = parts.slice(0, parts.length - 2).join(".");
      domainName = parts.slice(-2).join(".");
    } else {
      domainName = hostname;
    }
  }
  const pathname = urlObjeto.pathname;
  const pathParts = pathname.split("/").filter(Boolean);
  let folderTree = "/";
  let targetFile = null;
  if (pathParts.length > 0) {
    const lastPart = pathParts[pathParts.length - 1];
    if (lastPart.includes(".")) {
      targetFile = lastPart;
      folderTree += pathParts.slice(0, -1).join("/") + (pathParts.length > 1 ? "/" : "");
    } else {
      folderTree += pathParts.join("/") + "/";
    }
  }
  const argumentsFile = urlObjeto.search.length > 0 ? urlObjeto.search.substring(1) : null;
  return {
    protocol,
    ipAdress,
    subDomain,
    domainName,
    folderTree,
    targetFile,
    argumentsFile,
  };
}
const urlEjemplo = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
console.log(descomponerURL(urlEjemplo));
