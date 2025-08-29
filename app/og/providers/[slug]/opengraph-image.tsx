import { ImageResponse } from "@vercel/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function titleCase(input: string) {
  return input
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b([a-z])/g, (m) => m.toUpperCase());
}

export default function Image({ params }: { params: { slug: string } }) {
  const providerName = titleCase(decodeURIComponent(params.slug || "Provider"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#F4E0B8",
          color: "#0b0b0b",
          position: "relative",
          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 48,
            left: 48,
            padding: "8px 16px",
            borderRadius: 999,
            background: "#00A89D",
            color: "#fff",
            fontSize: 32,
            fontWeight: 800,
          }}
        >
          MuppeClub
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: 999,
              background: "#00A89D",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            }}
          >
            <span style={{ color: "#F4E0B8", fontSize: 64, fontWeight: 900 }}>MC</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 48, color: "#00A89D", fontWeight: 900 }}>
              {providerName}
            </div>
            <div style={{ fontSize: 28, color: "#1f2937", marginTop: 8 }}>
              Professional on MuppeClub
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}


