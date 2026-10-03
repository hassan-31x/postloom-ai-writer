import { ImageResponse } from "next/og";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: "#6550d9",
        color: "#faf9fd",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 140,
        fontWeight: 700,
      }}
    >
      p
    </div>,
    size,
  );
}
