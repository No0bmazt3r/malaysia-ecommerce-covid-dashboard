"use client";

import Image from "next/image";

const members = [
  { name: "Nurul Hawardah Binti Mohammad Yusoff", id: "22007264" },
  { name: "Wan Nur Ariana Sofea Binti Wan Zaki", id: "22011056" },
  { name: "Zuyyin Damia Binti Norazmi", id: "22007506", picture: "/Zuyyin.svg"},
  { name: "Muhammad Ibrahim Al-Imran Bin Mohd Isa", id: "22006656" },
  { name: "Sharvin A/L Kanesan", id: "22006930", picture: "/Sharvin.svg" },
];

function getInitials(name: string) {
  const parts = name.split(" ");
  // Use first and last name initials
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0][0].toUpperCase();
}

export default function TeamPage() {
  return (
    <section
      className="dashboard-surface w-full"
      style={{
        borderRadius: "var(--section-radius)",
        padding: "clamp(2rem, 5vw, 3.5rem)",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1
          className="display-heading"
          style={{
            fontSize: "clamp(2rem, 4vw, 2.75rem)",
            background: "var(--accent-gradient)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "0.5rem",
          }}
        >
          Group 8
        </h1>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "1.05rem",
            color: "var(--foreground)",
            opacity: 0.85,
            marginBottom: "0.25rem",
          }}
        >
          Bachelor of Computer Science (Hons.)
        </p>
        <p
          style={{
            fontSize: "0.85rem",
            color: "var(--accent)",
            fontWeight: 500,
            letterSpacing: "0.04em",
          }}
        >
          TEB3133 / TFB3133 Data Visualization
        </p>
      </div>

      {/* Members Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.5rem",
          justifyContent: "center",
        }}
      >
        {members.map((member, i) => (
          <div
            key={member.id}
            className="dashboard-card overflow-hidden"
            style={{
              borderRadius: "var(--card-radius)",
              display: "flex",
              flexDirection: "column",
              animation: "fade-up 0.5s ease-out both",
              animationDelay: `${i * 80}ms`,
            }}
          >
            {/* Avatar / Picture Header */}
            {member.picture ? (
              <div
                style={{
                  width: "100%",
                  height: 240,
                  position: "relative",
                  marginTop: "0.5rem",
                  marginBottom: "-1rem",
                }}
              >
                <Image
                  src={member.picture}
                  alt={member.name}
                  fill
                  style={{ objectFit: "contain" }}
                  priority={true}
                />
              </div>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: 140,
                  background: "var(--accent-gradient)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "2.5rem",
                    color: "#fff",
                    letterSpacing: "0.04em",
                  }}
                >
                  {getInitials(member.name)}
                </span>
              </div>
            )}

            {/* Info */}
            <div
              style={{
                padding: "1.5rem 1.25rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "0.5rem",
              }}
            >
              <p
                className="display-heading"
                style={{
                  fontSize: "1rem",
                  lineHeight: 1.35,
                }}
              >
                {member.name}
              </p>
              <span
                style={{
                  display: "inline-block",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  color: "var(--accent)",
                  background: "var(--accent-muted)",
                  padding: "0.3em 0.8em",
                  borderRadius: "999px",
                }}
              >
                {member.id}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
