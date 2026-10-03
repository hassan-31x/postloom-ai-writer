import { ImageResponse } from "next/og";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#f7f7fb",
        color: "#292636",
        padding: 80,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 36, fontWeight: 700 }}>postloom.</div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 76,
          fontWeight: 700,
          letterSpacing: -3,
        }}
      >
        <span>Good ideas deserve</span>
        <span style={{ color: "#6550d9" }}>better posts.</span>
      </div>
      <div style={{ fontSize: 25, color: "#6d687d" }}>
        Your ideas. Your voice. A little help with the words.
      </div>
    </div>,
    size,
  );
}
