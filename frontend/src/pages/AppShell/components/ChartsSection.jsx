import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Skeleton } from "./Skeleton";

export function ChartsSection({
  chartTab,
  onTabChange,
  cashflow,
  weekly,
  breakdown,
  isLoading,
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 320px",
        gap: 16,
        marginBottom: 24,
      }}
    >
      {/* Area/Bar Chart */}
      <div
        style={{
          background: "white",
          borderRadius: 16,
          boxShadow: "0 1px 4px rgba(13,33,55,0.06)",
          border: "1px solid #e2e8f0",
          padding: "20px 22px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 800,
                fontSize: 15,
                color: "#0D2137",
              }}
            >
              Arus Keuangan
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
              7 bulan terakhir
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 4,
              background: "#f0f4f8",
              borderRadius: 8,
              padding: 3,
            }}
          >
            {["area", "bar"].map((t) => (
              <button
                key={t}
                onClick={() => onTabChange(t)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 6,
                  border: "none",
                  background: chartTab === t ? "white" : "none",
                  color: chartTab === t ? "#0D2137" : "#64748b",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'DM Sans',sans-serif",
                  boxShadow:
                    chartTab === t
                      ? "0 1px 4px rgba(13,33,55,0.08)"
                      : "none",
                }}
              >
                {t === "area" ? "Tren" : "Mingguan"}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <Skeleton h={200} r={10} />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            {chartTab === "area" ? (
              <AreaChart
                data={cashflow}
                margin={{ top: 5, right: 5, bottom: 0, left: -20 }}
              >
                <defs>
                  <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C896" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#00C896" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff5c7a" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ff5c7a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
                <XAxis
                  dataKey="bln"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}jt`}
                />
                <Tooltip
                  formatter={(v, n) => [
                    `Rp ${v}jt`,
                    n === "pendapatan" ? "Pendapatan" : "Pengeluaran",
                  ]}
                  contentStyle={{
                    background: "#0D2137",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10,
                    fontFamily: "DM Sans",
                  }}
                  labelStyle={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 11,
                  }}
                  itemStyle={{ color: "white" }}
                />
                <Area
                  type="monotone"
                  dataKey="pendapatan"
                  stroke="#00C896"
                  strokeWidth={2.5}
                  fill="url(#gP)"
                  dot={{ r: 3, fill: "#00C896" }}
                />
                <Area
                  type="monotone"
                  dataKey="pengeluaran"
                  stroke="#ff5c7a"
                  strokeWidth={2}
                  fill="url(#gE)"
                  dot={{ r: 3, fill: "#ff5c7a" }}
                />
              </AreaChart>
            ) : (
              <BarChart
                data={weekly}
                margin={{ top: 5, right: 5, bottom: 0, left: -20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
                <XAxis
                  dataKey="hari"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}jt`}
                />
                <Tooltip
                  formatter={(v) => [`Rp ${v}jt`, "Penjualan"]}
                  contentStyle={{
                    background: "#0D2137",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10,
                  }}
                  labelStyle={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 11,
                  }}
                  itemStyle={{ color: "white" }}
                />
                <Bar dataKey="val" fill="#00C896" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>

      {/* Pie Chart */}
      <div
        style={{
          background: "white",
          borderRadius: 16,
          boxShadow: "0 1px 4px rgba(13,33,55,0.06)",
          border: "1px solid #e2e8f0",
          padding: "20px 22px",
        }}
      >
        <div
          style={{
            fontFamily: "'Syne',sans-serif",
            fontWeight: 800,
            fontSize: 15,
            color: "#0D2137",
            marginBottom: 4,
          }}
        >
          Komposisi Pendapatan
        </div>
        <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8 }}>
          Bulan ini
        </div>

        {isLoading ? (
          <Skeleton h={160} r={10} />
        ) : (
          <>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={breakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {breakdown.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => [`${v}%`, ""]}
                  contentStyle={{
                    background: "#0D2137",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10,
                  }}
                  itemStyle={{ color: "white" }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginTop: 8,
              }}
            >
              {breakdown.map((d, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: d.color,
                      flexShrink: 0,
                    }}
                  />
                  <div
                    style={{ flex: 1, fontSize: 12, color: "#64748b" }}
                  >
                    {d.name}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      fontFamily: "'Syne',sans-serif",
                      color: d.color,
                    }}
                  >
                    {d.value}%
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}