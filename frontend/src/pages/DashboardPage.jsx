import { useState } from "react";
import { useDashboard } from "../hooks/useDashboard";
import { TrialBanner } from "./AppShell/components/TrialBanner";
import { PageHeader } from "./AppShell/components/PageHeader";
import { StatCards } from "./AppShell/components/StatCards";
import { ChartsSection } from "./AppShell/components/ChartsSection";
import { TransactionsList } from "./AppShell/components/TransactionsList";
import { PiutangAging } from "./AppShell/components/PiutangAging";
import { ErrorCard } from "./AppShell/components/ErrorCard";

export default function DashboardPage() {
  const [chartTab, setChartTab] = useState("area");
  const { data, isLoading, isError, error, refetch } = useDashboard();

  const tenant = data?.tenant ?? {};
  const stats = data?.stats ?? {};
  const cashflow = data?.cashflow_chart ?? [];
  const weekly = data?.weekly_sales ?? [];
  const breakdown = data?.income_breakdown ?? [];
  const txns = data?.recent_transactions ?? [];
  const aging = data?.piutang_aging ?? [];

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px 48px" }}>
      {isError && (
        <div className="error-wrapper">
          <ErrorCard
            message={`Gagal memuat data: ${error?.message ?? "Koneksi bermasalah"}`}
            onRetry={refetch}
          />
        </div>
      )}

      {tenant.trial_ends_at && (
        <TrialBanner daysLeft={tenant.trial_days_left} />
      )}

      <PageHeader userName={data?.user?.first_name} />

      <StatCards stats={stats} isLoading={isLoading} />

      <ChartsSection
        chartTab={chartTab}
        onTabChange={setChartTab}
        cashflow={cashflow}
        weekly={weekly}
        breakdown={breakdown}
        isLoading={isLoading}
      />

      <div className="grid-2col">
        <TransactionsList transactions={txns} isLoading={isLoading} />
        <PiutangAging aging={aging} isLoading={isLoading} />
      </div>
    </div>
  );
}