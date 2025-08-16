// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    interface Diagnostics {
      buildInfo: BuildInfoProps;
      extensions: Record<string, Extension>;
      serverInfo: ServerInfoProps;
    }

    interface BuildInfoProps {
      buildVersion: string;
    }

    interface ConfigurationProps {
      config: Record<string, string>;
    }

    type ExtensionProps = ExtensionInfo;

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

    interface ServerInfoProps {
      deploymentId: string;
      extensionSync: {
        totalSyncAllCount: number;
      };
      hostname: string;
      nodeVersions: string;
      serverId: string;
      uptime: number;
    }

    interface StageDefinitionProps {
      stageDefinition: Record<string, string[]>;
    }

    interface KeyValuePair<TValue> {
      key: string;
      value: TValue;
    }

    type KeyedNavLink = {
      key: string;
      name: string;
      url?: string;
      [prop: string]: unknown;
    };
  }
}

export {};
