interface ExtensionsProps {
  extensions: Record<string, Extension>;
  onLinkClick?(item?: KeyedNavLink): void;
}

interface ExtensionInfo {
  extensionName: string;
  config: Record<string, string> | undefined;
  stageDefinition: Record<string, string[]> | undefined;
}

interface ExtensionError {
  lastError: {
    errorMessage: string;
    time: string;
  };
}

type Extension = ExtensionInfo | ExtensionError;
