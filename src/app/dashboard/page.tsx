"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Pie, PieChart } from "recharts"
import { Inter } from 'next/font/google'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const inter = Inter({ subsets: ["latin"] })

const chartData = [
  { day: "Monday",    events: 186, logins: 80  },
  { day: "Tuesday",   events: 305, logins: 200 },
  { day: "Wednesday", events: 237, logins: 120 },
  { day: "Thursday",  events: 73,  logins: 190 },
  { day: "Friday",    events: 209, logins: 130 },
  { day: "Saturday",  events: 214, logins: 140 },
  { day: "Sunday",    events: 214, logins: 140 },
]

const piechartData = [
  { role: "owner", users: 1, fill: "#1d4ed8" },
  { role: "admin", users: 0, fill: "#3b82f6" },
  { role: "user",  users: 4, fill: "#93c5fd" },
]

const chartConfig = {
  events: { label: "Events", color: "#3b82f6" },
  logins: { label: "Logins", color: "#93c5fd" },
} satisfies ChartConfig

const piechartConfig = {
  users:  { label: "Users"  },
  owner:  { label: "Owner", color: "#1d4ed8" },
  admin:  { label: "Admin", color: "#3b82f6" },
  user:   { label: "User",  color: "#93c5fd" },
} satisfies ChartConfig

export default function page() {
  return (
    <div className={inter.className}>

      {/* ── Top 4 stat cards ── */}
      <div className="flex flex-row m-2 gap-3">

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <div className="bg-blue-50 p-2 rounded-full" />
          </CardHeader>
          <CardContent className="pb-2">
            <h2 className="text-3xl font-bold">5</h2>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-blue-500 font-semibold pr-2">+1 this week</span>
              {"1 owner · 0 admins · 4 users"}
            </p>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Activity Events
            </CardTitle>
            <div className="bg-blue-50 p-2 rounded-full" />
          </CardHeader>
          <CardContent className="pb-2">
            <h2 className="text-3xl font-bold">234</h2>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-blue-500 font-semibold pr-2">+12.4%</span>
              {"Last 30 days"}
            </p>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Logins This Week
            </CardTitle>
            <div className="bg-blue-50 p-2 rounded-full" />
          </CardHeader>
          <CardContent className="pb-2">
            <h2 className="text-3xl font-bold">47</h2>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-blue-500 font-semibold pr-2">+8 vs last week</span>
              {"Across all users"}
            </p>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Failed Logins
            </CardTitle>
            <div className="bg-blue-50 p-2 rounded-full" />
          </CardHeader>
          <CardContent className="pb-2">
            <h2 className="text-3xl font-bold">3</h2>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-blue-500 font-semibold pr-2">-2 vs yesterday</span>
              {"Last 24 hours"}
            </p>
          </CardContent>
        </Card>

      </div>

      <div className="flex flex-row gap-4 p-4">

        <div className="flex-[2]">
          <Card>
            <CardHeader>
              <CardTitle>Activity this week</CardTitle>
              <CardDescription>Daily logins and total events</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{ left: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <defs>
                    <linearGradient id="fillEvents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="var(--color-events)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-events)" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="fillLogins" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="var(--color-logins)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-logins)" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="logins"
                    type="natural"
                    fill="url(#fillLogins)"
                    fillOpacity={0.4}
                    stroke="var(--color-logins)"
                    stackId="a"
                  />
                  <Area
                    dataKey="events"
                    type="natural"
                    fill="url(#fillEvents)"
                    fillOpacity={0.4}
                    stroke="var(--color-events)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="flex-[1]">
          <Card className="flex flex-col h-full">
            <CardHeader className="items-center pb-0">
              <CardTitle>User roles</CardTitle>
              <CardDescription>Distribution by role</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer
                config={piechartConfig}
                className="mx-auto aspect-square max-h-[200px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={piechartData}
                    dataKey="users"
                    nameKey="role"
                    innerRadius={50}
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 pt-4">
              {[
                { label: "Owner", count: 1, percent: "20%", color: "bg-blue-700" },
                { label: "Admin", count: 0, percent: "0%",  color: "bg-blue-500" },
                { label: "User",  count: 4, percent: "80%", color: "bg-blue-300" },
              ].map((item) => (
                <div key={item.label} className="flex w-full items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                    <span className="text-muted-foreground">{item.label}</span>
                  </div>
                  <div className="flex gap-4 text-muted-foreground">
                    <span className="font-medium text-foreground">{item.count}</span>
                    <span>{item.percent}</span>
                  </div>
                </div>
              ))}
            </CardFooter>
          </Card>
        </div>

      </div>
    </div>
  )
}