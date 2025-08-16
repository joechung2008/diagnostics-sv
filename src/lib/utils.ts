type Extension = App.Extension;
type ExtensionInfo = App.ExtensionInfo;
type KeyedNavLink = App.KeyedNavLink;

export function byKey(a: KeyedNavLink, b: KeyedNavLink): number {
  return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
}

export async function fetchDiagnostics(environment: string) {
  const response = await fetch(environment);
  return response.json();
}

export function isExtensionInfo(
  value: Extension | undefined
): value is ExtensionInfo {
  return (
    value !== null && typeof value === "object" && "extensionName" in value
  );
}

export function toNavLink({ extensionName }: ExtensionInfo): KeyedNavLink {
  return {
    key: extensionName,
    name: extensionName,
    url: "",
  };
}
