"use client";

const members = [
  { name: "Nurul Hawardah Binti Mohammad Yusoff", id: "22007264" },
  { name: "Wan Nur Ariana Sofea Binti Wan Zaki", id: "22011056" },
  { name: "Zuyyin Damia Binti Norazmi", id: "22007506" },
  { name: "Muhammad Ibrahim Al-Imran Bin Mohd Isa", id: "22006656" },
  { name: "Sharvin A/L Kanesan", id: "22006930" },
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
      className="dashboard-surface"
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
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {members.map((member, i) => (
          <div
            key={member.id}
            className="dashboard-card"
            style={{
              borderRadius: "var(--card-radius)",
              padding: "2rem 1.25rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "1rem",
              animation: "fade-up 0.5s ease-out both",
              animationDelay: `${i * 80}ms`,
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "var(--accent-gradient)",
                display: "grid",
                placeItems: "center",
                boxShadow: "0 4px 20px var(--accent-muted)",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "1.15rem",
                  color: "#fff",
                  letterSpacing: "0.04em",
                }}
              >
                {getInitials(member.name)}
              </span>
            </div>

            {/* Info */}
            <div>
              <p
                className="display-heading"
                style={{
                  fontSize: "0.92rem",
                  lineHeight: 1.35,
                  marginBottom: "0.35rem",
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
                  padding: "0.2em 0.7em",
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
