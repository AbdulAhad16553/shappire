type NhostRuntimeConfig = {
  graphqlUrl: string;
  authUrl?: string;
  storageUrl?: string;
  functionsUrl?: string;
  adminSecret?: string;
  subdomain?: string;
  region?: string;
};

const subdomain =
  process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN ?? process.env.NHOST_SUBDOMAIN;
const region = process.env.NEXT_PUBLIC_NHOST_REGION ?? process.env.NHOST_REGION;
const graphqlHostFromEnv =
  process.env.NEXT_PUBLIC_NHOST_GRAPHQL_URL ?? process.env.NEXT_PUBLIC_GRAPHQL_URL;

export const nhostConfig: NhostRuntimeConfig = {
  graphqlUrl:
    graphqlHostFromEnv ??
    (subdomain && region
      ? `https://${subdomain}.hasura.${region}.nhost.run/v1/graphql`
      : ""),
  authUrl:
    process.env.NEXT_PUBLIC_NHOST_AUTH_URL ??
    (subdomain && region
      ? `https://${subdomain}.auth.${region}.nhost.run/v1`
      : undefined),
  storageUrl:
    process.env.NEXT_PUBLIC_NHOST_STORAGE_URL ??
    process.env.NEXT_PUBLIC_GRAPHQL_STORAGE_URL ??
    process.env.NHOST_STORAGE_URL ??
    (subdomain && region
      ? `https://${subdomain}.storage.${region}.nhost.run/v1`
      : undefined),
  functionsUrl:
    process.env.NEXT_PUBLIC_NHOST_FUNCTIONS_URL ??
    (subdomain && region
      ? `https://${subdomain}.functions.${region}.nhost.run`
      : undefined),
  adminSecret:
    process.env.NHOST_ADMIN_SECRET ?? process.env.NEXT_PUBLIC_HASURA_SECRET,
  subdomain,
  region,
};

export function assertGraphqlUrl() {
  if (!nhostConfig.graphqlUrl) {
    throw new Error(
      "Missing GraphQL URL. Set NEXT_PUBLIC_NHOST_GRAPHQL_URL (or NEXT_PUBLIC_GRAPHQL_URL).",
    );
  }
}

export function toNhostFileUrl(fileId?: string | null) {
  if (!fileId || !nhostConfig.storageUrl) return null;
  return `${nhostConfig.storageUrl.replace(/\/$/, "")}/files/${fileId}`;
}
