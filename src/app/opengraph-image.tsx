import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const alt = "Book Your Home Inspection - GreenWorks Inspections";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // Read logo from public directory
  const logoPath = join(process.cwd(), "public", "gw-logo.png");
  const logoData = readFileSync(logoPath);
  const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          background: "linear-gradient(145deg, #0d1f17 0%, #1a3a2a 40%, #2E7D32 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            display: "flex",
          }}
        />

        {/* Green glow accent */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(76,175,80,0.2) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Left side - Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "380px",
            padding: "60px",
            flexShrink: 0,
          }}
        >
          <img
            src={logoBase64}
            alt="GreenWorks"
            width={260}
            height={260}
            style={{
              filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.3))",
            }}
          />
        </div>

        {/* Right side - Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            padding: "50px 60px 50px 0",
            gap: "20px",
          }}
        >
          {/* Tagline */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "3px",
                backgroundColor: "#66BB6A",
                display: "flex",
              }}
            />
            <span
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#66BB6A",
                textTransform: "uppercase",
                letterSpacing: "3px",
              }}
            >
              Online Booking
            </span>
          </div>

          {/* Main headline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <span
              style={{
                fontSize: "48px",
                fontWeight: 800,
                color: "white",
                lineHeight: 1.1,
                letterSpacing: "-1px",
              }}
            >
              Book Your Home
            </span>
            <span
              style={{
                fontSize: "48px",
                fontWeight: 800,
                color: "white",
                lineHeight: 1.1,
                letterSpacing: "-1px",
              }}
            >
              Inspection
            </span>
            <span
              style={{
                fontSize: "40px",
                fontWeight: 700,
                color: "#A5D6A7",
                lineHeight: 1.2,
                letterSpacing: "-0.5px",
              }}
            >
              in Minutes
            </span>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: "32px",
              marginTop: "8px",
            }}
          >
            {[
              { value: "4.9 Stars", label: "Rating" },
              { value: "7,183+", label: "Reviews" },
              { value: "6 States", label: "Covered" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "2px",
                }}
              >
                <span
                  style={{
                    fontSize: "24px",
                    fontWeight: 800,
                    color: "white",
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.5)",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    fontWeight: 600,
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Domain */}
          <div
            style={{
              marginTop: "8px",
              padding: "8px 20px",
              borderRadius: "999px",
              border: "1.5px solid rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.7)",
              fontSize: "14px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              alignSelf: "flex-start",
              gap: "6px",
            }}
          >
            greenworksinspections.com
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #2E7D32, #66BB6A, #2E7D32)",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
