import {
  useEffect,
  useState,
} from "react";

import {
  Users,
  Boxes,
  Folder,
  Download,
} from "lucide-react";

import StatCard
from "../components/StatCard";

import AnalyticsChart
from "../components/AnalyticsChart";

import RecentComponents
from "../components/RecentComponents";

import {
  getDashboardStats,
} from "../api/dashboardApi";

export default function Dashboard() {

  const [stats, setStats] =
    useState(null);

  useEffect(() => {

    load();

  }, []);

  const load =
    async () => {

      try {

        const data =
          await getDashboardStats();

        setStats(data);

      } catch (
        error
      ) {

        console.log(error);

      }

    };

  if (!stats) {

    return (
      <div>
        Loading...
      </div>
    );

  }

  return (

    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-zinc-500">
          Overview of your platform
        </p>

      </div>

      <div className="grid lg:grid-cols-4 gap-5">

        <StatCard
          title="Users"
          value={stats.stats.users}
          icon={<Users />}
        />

        <StatCard
          title="Components"
          value={stats.stats.components}
          icon={<Boxes />}
        />

        <StatCard
          title="Projects"
          value={stats.stats.projects}
          icon={<Folder />}
        />

        <StatCard
          title="Downloads"
          value={stats.stats.downloads || 0}
          icon={<Download />}
        />

      </div>

      <AnalyticsChart
        data={[
          {
            name:"Jan",
            value:30,
          },
          {
            name:"Feb",
            value:60,
          },
          {
            name:"Mar",
            value:100,
          },
        ]}
      />

      <RecentComponents
        items={
          stats.recentComponents
        }
      />

    </div>

  );

}