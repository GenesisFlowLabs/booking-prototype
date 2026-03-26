import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Book Your Home Inspection - GreenWorks Inspections";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #1a3a2a 0%, #2E7D32 50%, #1a3a2a 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle pattern overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.08,
            backgroundImage:
              "radial-gradient(circle at 25% 25%, #ffffff 1px, transparent 1px), radial-gradient(circle at 75% 75%, #ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            display: "flex",
          }}
        />

        {/* Top bar accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #43A047, #66BB6A, #43A047)",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            padding: "60px 80px",
            gap: "24px",
          }}
        >
          {/* Logo area */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                backgroundColor: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                fontWeight: 800,
                color: "#66BB6A",
              }}
            >
              GW
            </div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "white",
                letterSpacing: "-0.5px",
              }}
            >
              GreenWorks Inspections
            </div>
          </div>

          {/* Main headline */}
          <div
            style={{
              fontSize: "56px",
              fontWeight: 800,
              color: "white",
              textAlign: "center",
              lineHeight: 1.15,
              maxWidth: "900px",
              letterSpacing: "-1px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span>Book Your Home Inspection</span>
            <span style={{ color: "#A5D6A7" }}>in Minutes, Not Hours</span>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: "40px",
              marginTop: "16px",
            }}
          >
            {[
              { value: "4.9 ★", label: "Google Rating" },
              { value: "7,183+", label: "Reviews" },
              { value: "6", label: "States" },
              { value: "#1", label: "Independent" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span
                  style={{
                    fontSize: "28px",
                    fontWeight: 800,
                    color: "#A5D6A7",
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.6)",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    fontWeight: 600,
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA pill */}
          <div
            style={{
              marginTop: "12px",
              padding: "12px 32px",
              borderRadius: "999px",
              backgroundColor: "rgba(255,255,255,0.15)",
              border: "2px solid rgba(255,255,255,0.25)",
              color: "white",
              fontSize: "18px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            greenworksinspections.com
          </div>
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, transparent, #66BB6A, transparent)",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
