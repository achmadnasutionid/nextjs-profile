import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <svg
        width="32"
        height="32"
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="20" cy="20" r="20" fill="#0f6354" />
        <path
          d="M20 8c5 4 8 9 8 13.5A8 8 0 0 1 12 21.5C12 17 15 12 20 8Z"
          fill="#b9dd45"
        />
        <path
          d="M20 32c-2.5-3-4-6.5-4-9.5"
          stroke="#0c4f43"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    ),
    { ...size },
  );
}
