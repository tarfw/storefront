import type { Route } from "./+types/home";

type LoaderData = {
  title: string;
  description: string;
};

const PRIMARY_DOMAIN = "tarai.space";
const PRIMARY_DOMAIN_LABELS = PRIMARY_DOMAIN.split(".");
const DEFAULT_CONTENT: LoaderData = {
  title: "Storefront",
  description: "Storefront home page",
};

export function meta({ data }: Route.MetaArgs) {
  const title = data?.title ?? DEFAULT_CONTENT.title;
  const description = data?.description ?? DEFAULT_CONTENT.description;

  return [
    { title },
    { name: "description", content: description },
  ];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const { STOREFRONT } = context.cloudflare.env;
  if (!STOREFRONT) {
    console.warn("STOREFRONT KV binding missing");
    return DEFAULT_CONTENT;
  }

  const url = new URL(request.url);
  const host = url.hostname.toLowerCase();
  const hostLabels = host.split(".").filter(Boolean);

  let tenant = "";
  if (hostLabels.length > PRIMARY_DOMAIN_LABELS.length) {
    const base = hostLabels.slice(-PRIMARY_DOMAIN_LABELS.length).join(".");
    if (base === PRIMARY_DOMAIN) {
      tenant = hostLabels
        .slice(0, hostLabels.length - PRIMARY_DOMAIN_LABELS.length)
        .join(".");
    }
  } else {
    // Check if it's a custom domain with direct data
    const domainKey = `domain:${host}`;
    console.info("Checking custom domain", { host, domainKey });
    const domainData = await STOREFRONT.get<LoaderData>(domainKey, { type: "json" });
    if (domainData) {
      console.info("Custom domain data found", { domainData });
      return domainData;
    }
  }

  if (!tenant) {
    console.info("No tenant derived from host or custom domain mapping", { host });
    return DEFAULT_CONTENT;
  }

  const key = `tenant:${tenant}`;
  console.info("Fetching tenant data", { host, tenant, key });
  const stored = await STOREFRONT.get<LoaderData>(key, { type: "json" });

  if (!stored) {
    console.warn("Tenant record missing", { tenant, key });
    return DEFAULT_CONTENT;
  }

  const title = stored.title?.trim();
  const description = stored.description?.trim();

  const content: LoaderData = {
    title: title && title.length > 0 ? title : DEFAULT_CONTENT.title,
    description:
      description && description.length > 0
        ? description
        : DEFAULT_CONTENT.description,
  };

  console.info("Tenant content resolved", { tenant, content });
  return content;
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { title } = loaderData;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
      }}
    >
      <span style={{ color: "#000000", fontSize: "2rem", fontWeight: 600 }}>
        {title}
      </span>
    </div>
  );
}
