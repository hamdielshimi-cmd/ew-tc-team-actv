"use client";

import {
  AlertTriangle,
  BarChart3,
  Bell,
  Check,
  Clock3,
  Eye,
  FileCheck2,
  FileUp,
  LockKeyhole,
  MessageSquareText,
  Plus,
  Send,
  ShieldCheck,
  Upload,
  Users
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";

type User = {
  name: "Hamdi" | "Hadeer" | "Bakr" | "Asmaa";
  role: string;
  pin: string;
  color: string;
};

type Campaign = {
  account: string;
  adSet: string;
  cplTarget: number;
  killSwitch: number;
  reachTarget: string;
  action: string;
  currentCpl: number | null;
  spendToday: number;
  status: "Active" | "Paused" | "Holding" | "Learning";
};

type Brief = {
  id: number;
  title: string;
  assignee: User["name"];
  deadline: string;
  status: "Draft" | "Published" | "Seen" | "In Progress" | "Submitted" | "Approved" | "Revision Requested" | "Done";
  seenAt?: string;
  source: string;
};

type Submission = {
  id: number;
  briefId: number;
  uploader: User["name"];
  fileName: string;
  note: string;
  decision: "Pending" | "Approved" | "Needs Revision";
  reviewerComment?: string;
  createdAt: string;
};

type WeeklyReport = {
  id: number;
  week: string;
  campaign: string;
  channel: string;
  spend: number;
  qualifiedLeads: number;
  previousRealCpl: number;
};

type StatusUpdate = {
  id: number;
  member: User["name"];
  completed: string;
  today: string;
  blockers: string;
  createdAt: string;
};

type CreativeRequest = {
  id: number;
  title: string;
  description: string;
  creator: User["name"];
  assignee: User["name"];
  channel: string;
  status: "Pending" | "Returned" | "Approved" | "Published" | "Back for Update" | "Closed";
  managerComment?: string;
  fileName?: string;
  createdAt: string;
  greenLight: boolean;
};

type Activity = {
  id: number;
  actor: User["name"];
  action: string;
  target: string;
  createdAt: string;
};

const users: User[] = [
  { name: "Hamdi", role: "Admin", pin: "1001", color: "#0f8b6f" },
  { name: "Hadeer", role: "Media buyer", pin: "2002", color: "#3d7c9f" },
  { name: "Bakr", role: "Creative", pin: "3003", color: "#8a6f2a" },
  { name: "Asmaa", role: "Video", pin: "4004", color: "#a44b54" }
];

const campaignsSeed: Campaign[] = [
  { account: "Dr. Ihab", adSet: "Saudi Arabia", cplTarget: 22, killSwitch: 35, reachTarget: "250K/mo", action: "Refresh creative", currentCpl: 28, spendToday: 0, status: "Active" },
  { account: "Dr. Ihab", adSet: "Libya/Algeria", cplTarget: 25, killSwitch: 35, reachTarget: "90K/mo", action: "Pause now", currentCpl: null, spendToday: 0, status: "Paused" },
  { account: "Eye World LAZIK", adSet: "Cairo", cplTarget: 12, killSwitch: 20, reachTarget: "80K/mo", action: "Hold stable", currentCpl: 12, spendToday: 0, status: "Holding" },
  { account: "Eye World LAZIK", adSet: "Giza", cplTarget: 20, killSwitch: 35, reachTarget: "15K/mo", action: "Learning - wait", currentCpl: 23, spendToday: 0, status: "Learning" },
  { account: "Eye World LAZIK", adSet: "Fayom", cplTarget: 20, killSwitch: 35, reachTarget: "10K/mo", action: "Learning - wait", currentCpl: 24, spendToday: 0, status: "Learning" },
  { account: "Eye World LAZIK", adSet: "بنى سويف", cplTarget: 20, killSwitch: 35, reachTarget: "10K/mo", action: "Watch closely", currentCpl: 31, spendToday: 0, status: "Learning" },
  { account: "Eye World LAZIK", adSet: "بنها", cplTarget: 20, killSwitch: 35, reachTarget: "10K/mo", action: "Learning - wait", currentCpl: 24, spendToday: 0, status: "Learning" },
  { account: "Top Care", adSet: "Lasir", cplTarget: 5, killSwitch: 15, reachTarget: "200K/mo", action: "Scale budget +40%", currentCpl: 1.47, spendToday: 68.92, status: "Active" },
  { account: "Top Care Insurance", adSet: "Ismailia", cplTarget: 4, killSwitch: 8, reachTarget: "40K/mo", action: "Hold stable", currentCpl: 4, spendToday: 0, status: "Holding" },
  { account: "Top Care Insurance", adSet: "Port Said", cplTarget: 4, killSwitch: 8, reachTarget: "40K/mo", action: "Hold stable", currentCpl: 4, spendToday: 0, status: "Holding" },
  { account: "Top Care Insurance", adSet: "Suez", cplTarget: 4, killSwitch: 8, reachTarget: "40K/mo", action: "Hold stable", currentCpl: 4, spendToday: 0, status: "Holding" },
  { account: "Top Care Teeth", adSet: "mssg1", cplTarget: 20, killSwitch: 40, reachTarget: "5K/mo", action: "Learning - 7 days", currentCpl: null, spendToday: 0, status: "Learning" },
  { account: "Top Care Teeth", adSet: "mssg2", cplTarget: 20, killSwitch: 40, reachTarget: "5K/mo", action: "Pause now", currentCpl: null, spendToday: 0, status: "Paused" }
];

const activeAds = [
  { ad: "ليزر حروق", adSet: "lasir", campaign: "Topcare", budget: 300, spent: 68.92, impressions: 1995, results: 47 },
  { ad: "all top care - Copy", adSet: "ENG TEETH", campaign: "Topcare", budget: 150, spent: 0, impressions: 0, results: 0 }
];

const briefsSeed: Brief[] = [
  { id: 1, title: "Refresh creative - Dr. Ihab Saudi Arabia", assignee: "Bakr", deadline: "2026-06-02", status: "Published", source: "Target & Action Matrix" },
  { id: 2, title: "Scale budget +40% - Top Care Lasir", assignee: "Hadeer", deadline: "2026-06-02", status: "Seen", seenAt: "2026-05-26 09:20", source: "Target & Action Matrix" },
  { id: 3, title: "Old man vs. young woman A/B readout - Top Care Canal", assignee: "Asmaa", deadline: "2026-06-08", status: "In Progress", source: "Management Strategic Updates" }
];

const weeklyReportsSeed: WeeklyReport[] = [
  { id: 1, week: "2026-05-25", campaign: "Topcare / lasir", channel: "Paid", spend: 68.92, qualifiedLeads: 47, previousRealCpl: 0 }
];


const requestSeed: CreativeRequest[] = [
  { id: 1, title: "Refresh creative - Dr. Ihab Saudi Arabia", description: "New static/ad variation needed because the matrix action is Refresh creative.", creator: "Bakr", assignee: "Hadeer", channel: "Paid Social", status: "Pending", createdAt: "2026-05-27 10:15", greenLight: false },
  { id: 2, title: "Top Care Lasir scale support", description: "Prepare campaign assets before Scale budget +40% action.", creator: "Asmaa", assignee: "Hadeer", channel: "Paid Video", status: "Approved", createdAt: "2026-05-27 11:40", greenLight: true },
  { id: 3, title: "Top Care Canal organic A/B readout", description: "Old man vs. young woman visual interaction review.", creator: "Asmaa", assignee: "Hamdi", channel: "Organic", status: "Returned", managerComment: "Add clearer winner notes before publishing.", createdAt: "2026-05-27 12:05", greenLight: false }
];

const activitySeed: Activity[] = [
  { id: 1, actor: "Hamdi", action: "Published brief", target: "Refresh creative - Dr. Ihab Saudi Arabia", createdAt: "2026-05-27 10:00" },
  { id: 2, actor: "Hadeer", action: "Updated spend", target: "Top Care / Lasir", createdAt: "2026-05-27 10:30" }
];
const tabs: Array<{ id: string; label: string; Icon: LucideIcon }> = [
  { id: "dashboard", label: "Command Center", Icon: BarChart3 },
  { id: "briefs", label: "Brief Board", Icon: FileCheck2 },
  { id: "creative", label: "Creative Approval", Icon: Upload },
  { id: "reports", label: "Reception Report", Icon: MessageSquareText },
  { id: "feed", label: "Team Status", Icon: Users }
];

const formatEgp = (value: number) => `${value.toLocaleString("en-US", { maximumFractionDigits: 2 })} EGP`;

function health(campaign: Campaign) {
  if (campaign.currentCpl === null || campaign.status === "Paused") {
    return { label: "Paused / no CPL", tone: "neutral", className: "border-[#d7ddd8] bg-white" };
  }
  if (campaign.currentCpl >= campaign.killSwitch) {
    return { label: "Red", tone: "red", className: "border-[#f0b6b1] bg-[#fff0ee]" };
  }
  if (campaign.currentCpl >= campaign.killSwitch * 0.8) {
    return { label: "Amber", tone: "amber", className: "border-[#f0d28e] bg-[#fff7df]" };
  }
  return { label: "Green", tone: "green", className: "border-[#a8dac9] bg-[#eefaf6]" };
}

const briefStatuses: Brief["status"][] = ["Draft", "Published", "Seen", "In Progress", "Submitted", "Approved", "Revision Requested", "Done"];

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [pin, setPin] = useState("");
  const [loginError, setLoginError] = useState("");
  const [campaigns, setCampaigns] = useState(campaignsSeed);
  const [requests, setRequests] = useState(requestSeed);
  const [briefs, setBriefs] = useState(briefsSeed);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [reports, setReports] = useState(weeklyReportsSeed);
  const [updates, setUpdates] = useState<StatusUpdate[]>([]);
  const [activity, setActivity] = useState(activitySeed);
  const [activeTab, setActiveTab] = useState("dashboard");

  const totals = useMemo(() => {
    const red = campaigns.filter((campaign) => health(campaign).tone === "red").length;
    const amber = campaigns.filter((campaign) => health(campaign).tone === "amber").length;
    const green = campaigns.filter((campaign) => health(campaign).tone === "green").length;
    const spend = campaigns.reduce((sum, campaign) => sum + campaign.spendToday, 0);
    return { red, amber, green, spend };
  }, [campaigns]);

  function login(event: FormEvent) {
    event.preventDefault();
    const user = users.find((item) => item.pin === pin);
    if (!user) {
      setLoginError("PIN غير صحيح");
      return;
    }
    setCurrentUser(user);
    setPin("");
    setLoginError("");
  }

  function updateCampaign(index: number, key: keyof Campaign, value: string) {
    setCampaigns((items) =>
      items.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [key]: key === "currentCpl" || key === "spendToday" ? Number(value) : value
            }
          : item
      )
    );
  }


  function logActivity(action: string, target: string) {
    if (!currentUser) return;
    setActivity((items) => [
      { id: Date.now(), actor: currentUser.name, action, target, createdAt: new Date().toLocaleString("en-GB") },
      ...items
    ]);
  }

  function addRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentUser) return;
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "").trim();
    const description = String(form.get("description") || "").trim();
    const assignee = String(form.get("assignee") || "Hadeer") as User["name"];
    const channel = String(form.get("channel") || "Paid Social");
    const file = form.get("file") as File | null;
    if (!title || !description) return;
    setRequests((items) => [
      {
        id: Date.now(),
        title,
        description,
        creator: currentUser.name,
        assignee,
        channel,
        status: "Pending",
        fileName: file?.name || undefined,
        createdAt: new Date().toLocaleString("en-GB"),
        greenLight: false
      },
      ...items
    ]);
    logActivity("Created creative request", title);
    event.currentTarget.reset();
  }

  function decideRequest(id: number, status: CreativeRequest["status"], managerComment?: string) {
    const target = requests.find((request) => request.id === id);
    setRequests((items) => items.map((request) => request.id === id ? {
      ...request,
      status,
      managerComment: managerComment ?? request.managerComment,
      greenLight: status === "Approved" || status === "Published"
    } : request));
    if (target) logActivity(`Request ${status}`, target.title);
  }

  function addBrief(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "").trim();
    const assignee = String(form.get("assignee")) as User["name"];
    const deadline = String(form.get("deadline"));
    if (!title || !deadline) return;
    setBriefs((items) => [
      { id: Date.now(), title, assignee, deadline, status: "Published", source: "Manual ACTV brief" },
      ...items
    ]);
    logActivity("Published brief", title);
    event.currentTarget.reset();
  }

  function markSeen(briefId: number) {
    setBriefs((items) =>
      items.map((brief) =>
        brief.id === briefId
          ? { ...brief, status: "Seen", seenAt: new Date().toLocaleString("en-GB") }
          : brief
      )
    );
    logActivity("Acknowledged brief", briefs.find((brief) => brief.id === briefId)?.title || "Brief");
  }

  function submitCreative(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentUser) return;
    const form = new FormData(event.currentTarget);
    const file = form.get("file") as File | null;
    const briefId = Number(form.get("briefId"));
    const note = String(form.get("note") || "").trim();
    if (!file?.name || !briefId) return;
    setSubmissions((items) => [
      {
        id: Date.now(),
        briefId,
        uploader: currentUser.name,
        fileName: file.name,
        note,
        decision: "Pending",
        createdAt: new Date().toLocaleString("en-GB")
      },
      ...items
    ]);
    setBriefs((items) => items.map((brief) => (brief.id === briefId ? { ...brief, status: "Submitted" } : brief)));
    logActivity("Uploaded creative", file.name);
    event.currentTarget.reset();
  }

  function decideSubmission(id: number, decision: Submission["decision"]) {
    setSubmissions((items) =>
      items.map((submission) =>
        submission.id === id
          ? { ...submission, decision, reviewerComment: decision === "Needs Revision" ? "Revision requested by Hamdi" : "Approved by Hamdi" }
          : submission
      )
    );
    logActivity(`Creative ${decision}`, submissions.find((submission) => submission.id === id)?.fileName || "Submission");
  }

  function addReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const spend = Number(form.get("spend"));
    const qualifiedLeads = Number(form.get("qualifiedLeads"));
    if (!spend || !qualifiedLeads) return;
    setReports((items) => [
      {
        id: Date.now(),
        week: String(form.get("week")),
        campaign: String(form.get("campaign")),
        channel: String(form.get("channel")),
        spend,
        qualifiedLeads,
        previousRealCpl: Number(form.get("previousRealCpl") || 0)
      },
      ...items
    ]);
    logActivity("Submitted reception report", String(form.get("campaign")));
    event.currentTarget.reset();
  }

  function addStatus(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentUser) return;
    const form = new FormData(event.currentTarget);
    setUpdates((items) => [
      {
        id: Date.now(),
        member: currentUser.name,
        completed: String(form.get("completed")),
        today: String(form.get("today")),
        blockers: String(form.get("blockers")),
        createdAt: new Date().toLocaleString("en-GB")
      },
      ...items
    ]);
    logActivity("Posted daily status", "Team Status Feed");
    event.currentTarget.reset();
  }

  if (!currentUser) {
    return (
      <main className="min-h-screen px-5 py-8 md:px-10">
        <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c8d9d1] bg-white/75 px-4 py-2 text-sm text-[#50665c]">
              <ShieldCheck size={17} />
              <span>Internal campaign operations</span>
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-normal md:text-7xl">
                EW-TC Team ACTV
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[#50665c]">
                لوحة تشغيل يومية للحملات، البريفات، الموافقات، تقارير الاستقبال، وتحديثات الفريق.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Stat label="Active matrix rows" value={campaigns.length.toString()} />
              <Stat label="PDF active ads" value={activeAds.length.toString()} />
              <Stat label="Storage" value={isSupabaseConfigured ? "Supabase" : "Local demo"} />
            </div>
          </div>
          <form onSubmit={login} className="rounded-lg border border-[#d9e1dc] bg-white p-6 shadow-[0_24px_60px_rgba(30,55,45,0.12)]">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">تسجيل الدخول</h2>
                <p className="mt-1 text-sm text-[#66756d]">أدخل PIN المكون من 4 أرقام</p>
              </div>
              <LockKeyhole className="text-[#0f8b6f]" size={30} />
            </div>
            <input
              className="metric mb-3 h-14 w-full rounded-md border border-[#cfdad4] bg-[#fbfcfa] px-4 text-center text-2xl tracking-[0.35em] outline-none focus:border-[#0f8b6f]"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(event) => setPin(event.target.value.replace(/\D/g, ""))}
              placeholder="0000"
            />
            {loginError ? <p className="mb-3 text-sm text-[#bc3d35]">{loginError}</p> : null}
            <button className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#0f8b6f] px-4 font-semibold text-white">
              <Check size={18} />
              دخول
            </button>
            <div className="mt-5 grid gap-2 text-sm text-[#66756d]">
              {users.map((user) => (
                <div key={user.name} className="flex items-center justify-between rounded-md bg-[#f4f7f5] px-3 py-2">
                  <span>{user.name} - {user.role}</span>
                  <span className="metric">{user.pin}</span>
                </div>
              ))}
            </div>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-5 md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-5 flex flex-col gap-4 rounded-lg border border-[#d9e1dc] bg-white/80 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-[#66756d]">EW-TC Team ACTV</p>
            <h1 className="text-3xl font-semibold">مركز عمليات الحملات</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge icon={<Bell size={16} />} label={isSupabaseConfigured ? "Supabase connected" : "Local demo mode"} />
            <div className="flex items-center gap-3 rounded-md border border-[#d9e1dc] bg-white px-3 py-2">
              <span className="h-3 w-3 rounded-full" style={{ background: currentUser.color }} />
              <span className="font-semibold">{currentUser.name}</span>
              <span className="text-sm text-[#66756d]">{currentUser.role}</span>
            </div>
          </div>
        </header>

        <nav className="mb-5 grid gap-2 md:grid-cols-7">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex h-12 items-center justify-center gap-2 rounded-md border px-3 text-sm font-semibold ${
                activeTab === id ? "border-[#0f8b6f] bg-[#0f8b6f] text-white" : "border-[#d9e1dc] bg-white text-[#31443b]"
              }`}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>

        {activeTab === "dashboard" ? (
          <section className="space-y-5">
            <div className="grid gap-3 md:grid-cols-4">
              <Stat label="Spend today" value={formatEgp(totals.spend)} />
              <Stat label="Green rows" value={totals.green.toString()} />
              <Stat label="Amber rows" value={totals.amber.toString()} />
              <Stat label="Red rows" value={totals.red.toString()} />
            </div>
            <div className="overflow-hidden rounded-lg border border-[#d9e1dc] bg-white">
              <div className="flex items-center justify-between border-b border-[#e4ebe7] px-4 py-3">
                <h2 className="text-xl font-semibold">Campaign Command Center</h2>
                <span className="text-sm text-[#66756d]">Source: Marketing Status & Strategy Report</span>
              </div>
              <div className="scrollbar overflow-x-auto">
                <table className="w-full min-w-[980px] border-collapse text-sm">
                  <thead className="bg-[#f3f7f5] text-[#50665c]">
                    <tr>
                      {["Health", "Account", "Ad Set", "CPL", "Target", "Kill", "Spend today", "Reach target", "Action", "Status"].map((head) => (
                        <th key={head} className="px-3 py-3 text-right font-semibold">{head}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign, index) => {
                      const state = health(campaign);
                      return (
                        <tr key={`${campaign.account}-${campaign.adSet}`} className={`border-t ${state.className}`}>
                          <td className="px-3 py-3">
                            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                              state.tone === "red" ? "bg-[#bc3d35] text-white" : state.tone === "amber" ? "bg-[#b97807] text-white" : state.tone === "green" ? "bg-[#0f8b6f] text-white" : "bg-[#edf0ee] text-[#66756d]"
                            }`}>
                              {state.tone === "red" ? <AlertTriangle size={14} /> : <Check size={14} />}
                              {state.label}
                            </span>
                          </td>
                          <td className="px-3 py-3 font-semibold">{campaign.account}</td>
                          <td className="px-3 py-3">{campaign.adSet}</td>
                          <td className="px-3 py-3">
                            <input
                              className="metric w-24 rounded border border-[#cfdad4] bg-white px-2 py-1"
                              type="number"
                              value={campaign.currentCpl ?? ""}
                              placeholder="-"
                              onChange={(event) => updateCampaign(index, "currentCpl", event.target.value)}
                            />
                          </td>
                          <td className="metric px-3 py-3">{formatEgp(campaign.cplTarget)}</td>
                          <td className="metric px-3 py-3">{formatEgp(campaign.killSwitch)}</td>
                          <td className="px-3 py-3">
                            <input
                              className="metric w-28 rounded border border-[#cfdad4] bg-white px-2 py-1"
                              type="number"
                              value={campaign.spendToday}
                              onChange={(event) => updateCampaign(index, "spendToday", event.target.value)}
                            />
                          </td>
                          <td className="metric px-3 py-3">{campaign.reachTarget}</td>
                          <td className="px-3 py-3 font-semibold">{campaign.action}</td>
                          <td className="px-3 py-3">
                            <select
                              className="rounded border border-[#cfdad4] bg-white px-2 py-1"
                              value={campaign.status}
                              onChange={(event) => updateCampaign(index, "status", event.target.value)}
                            >
                              {["Active", "Paused", "Holding", "Learning"].map((status) => <option key={status}>{status}</option>)}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {activeAds.map((ad) => (
                <div key={ad.ad} className="rounded-lg border border-[#d9e1dc] bg-white p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{ad.ad}</h3>
                    <Badge icon={<Eye size={15} />} label={ad.adSet} />
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-sm">
                    <MiniMetric label="Budget" value={formatEgp(ad.budget)} />
                    <MiniMetric label="Spent" value={formatEgp(ad.spent)} />
                    <MiniMetric label="Impressions" value={ad.impressions.toLocaleString("en-US")} />
                    <MiniMetric label="Results" value={ad.results.toLocaleString("en-US")} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}


        {activeTab === "requests" ? (
          <section className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
            <form onSubmit={addRequest} className="rounded-lg border border-[#d9e1dc] bg-white p-4">
              <h2 className="mb-4 text-xl font-semibold">Creative Request</h2>
              <Field name="title" label="Title" placeholder="Campaign asset / post / video" />
              <label className="mb-3 block text-sm font-semibold">
                Description
                <textarea name="description" rows={4} className="mt-1 w-full rounded-md border border-[#cfdad4] bg-white px-3 py-2 outline-none focus:border-[#0f8b6f]" />
              </label>
              <Field name="channel" label="Channel" placeholder="Paid Social" />
              <label className="mb-3 block text-sm font-semibold">
                Assignee
                <select name="assignee" className="mt-1 h-11 w-full rounded-md border border-[#cfdad4] bg-white px-3">
                  {users.map((user) => <option key={user.name}>{user.name}</option>)}
                </select>
              </label>
              <label className="mb-3 block text-sm font-semibold">
                Attachment
                <input name="file" type="file" className="mt-1 w-full rounded-md border border-dashed border-[#9eb5aa] bg-[#fbfcfa] px-3 py-3" />
              </label>
              <button className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#0f8b6f] font-semibold text-white">
                <Plus size={17} />
                Submit
              </button>
            </form>
            <div className="space-y-3">
              {requests.map((request) => (
                <div key={request.id} className="rounded-lg border border-[#d9e1dc] bg-white p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{request.title}</h3>
                      <p className="mt-1 text-sm text-[#66756d]">{request.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge icon={<Users size={15} />} label={`${request.creator} -> ${request.assignee}`} />
                        <Badge icon={<Clock3 size={15} />} label={request.channel} />
                        {request.greenLight ? <Badge icon={<Check size={15} />} label="Green Light" /> : null}
                      </div>
                      {request.managerComment ? <p className="mt-3 rounded-md bg-[#fff7df] p-3 text-sm text-[#73510c]">{request.managerComment}</p> : null}
                    </div>
                    <Badge icon={<ShieldCheck size={15} />} label={request.status} />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {currentUser.name === "Hamdi" ? (
                      <>
                        <button onClick={() => decideRequest(request.id, "Approved", "Approved by Hamdi")} className="inline-flex h-9 items-center gap-2 rounded-md bg-[#0f8b6f] px-3 text-sm font-semibold text-white"><Check size={15} />Approve</button>
                        <button onClick={() => decideRequest(request.id, "Returned", "Needs revision before approval.")} className="inline-flex h-9 items-center gap-2 rounded-md bg-[#fff0ee] px-3 text-sm font-semibold text-[#bc3d35]"><AlertTriangle size={15} />Return</button>
                      </>
                    ) : null}
                    {currentUser.name === "Hadeer" && request.status === "Approved" ? (
                      <>
                        <button onClick={() => decideRequest(request.id, "Published")} className="inline-flex h-9 items-center gap-2 rounded-md bg-[#0f8b6f] px-3 text-sm font-semibold text-white"><Send size={15} />Publish</button>
                        <button onClick={() => decideRequest(request.id, "Back for Update")} className="inline-flex h-9 items-center gap-2 rounded-md bg-[#fff7df] px-3 text-sm font-semibold text-[#73510c]"><AlertTriangle size={15} />Back for Update</button>
                        <button onClick={() => decideRequest(request.id, "Closed")} className="inline-flex h-9 items-center gap-2 rounded-md bg-[#17201c] px-3 text-sm font-semibold text-white"><Check size={15} />Close</button>
                      </>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {activeTab === "activity" ? (
          <section className="rounded-lg border border-[#d9e1dc] bg-white">
            <div className="border-b border-[#e4ebe7] px-4 py-3">
              <h2 className="text-xl font-semibold">Global Activity Log</h2>
            </div>
            <div className="divide-y divide-[#e4ebe7]">
              {activity.map((item) => (
                <div key={item.id} className="grid gap-2 p-4 md:grid-cols-[180px_1fr_180px] md:items-center">
                  <span className="font-semibold">{item.actor}</span>
                  <span>{item.action}: <strong>{item.target}</strong></span>
                  <span className="metric text-sm text-[#66756d]">{item.createdAt}</span>
                </div>
              ))}
            </div>
          </section>
        ) : null}
        {activeTab === "briefs" ? (
          <section className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
            <form onSubmit={addBrief} className="rounded-lg border border-[#d9e1dc] bg-white p-4">
              <h2 className="mb-4 text-xl font-semibold">بريف جديد</h2>
              <Field name="title" label="Brief title" placeholder="مثال: Refresh creative - Dr. Ihab" />
              <label className="mb-3 block text-sm font-semibold">
                Assignee
                <select name="assignee" className="mt-1 h-11 w-full rounded-md border border-[#cfdad4] bg-white px-3">
                  {users.filter((user) => user.name !== "Hamdi").map((user) => <option key={user.name}>{user.name}</option>)}
                </select>
              </label>
              <Field name="deadline" label="Deadline" type="date" />
              <button className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#0f8b6f] font-semibold text-white">
                <Plus size={17} />
                Publish
              </button>
            </form>
            <div className="space-y-3">
              {briefs.map((brief) => (
                <div key={brief.id} className="rounded-lg border border-[#d9e1dc] bg-white p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{brief.title}</h3>
                      <p className="mt-1 text-sm text-[#66756d]">Assigned to {brief.assignee} - Deadline <span className="metric">{brief.deadline}</span></p>
                    </div>
                    <select
                      className="h-10 rounded-md border border-[#cfdad4] bg-white px-3"
                      value={brief.status}
                      onChange={(event) => setBriefs((items) => items.map((item) => item.id === brief.id ? { ...item, status: event.target.value as Brief["status"] } : item))}
                    >
                      {briefStatuses.map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Badge icon={<Clock3 size={15} />} label={brief.source} />
                    {brief.seenAt ? <Badge icon={<Check size={15} />} label={`Seen ${brief.seenAt}`} /> : null}
                    {brief.assignee === currentUser.name && !brief.seenAt ? (
                      <button onClick={() => markSeen(brief.id)} className="inline-flex h-9 items-center gap-2 rounded-md bg-[#dae8ff] px-3 text-sm font-semibold text-[#214c68]">
                        <Eye size={15} />
                        Seen
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {activeTab === "creative" ? (
          <section className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
            <form onSubmit={submitCreative} className="rounded-lg border border-[#d9e1dc] bg-white p-4">
              <h2 className="mb-4 text-xl font-semibold">رفع ملف</h2>
              <label className="mb-3 block text-sm font-semibold">
                Brief
                <select name="briefId" className="mt-1 h-11 w-full rounded-md border border-[#cfdad4] bg-white px-3">
                  {briefs.map((brief) => <option key={brief.id} value={brief.id}>{brief.title}</option>)}
                </select>
              </label>
              <label className="mb-3 block text-sm font-semibold">
                File
                <input name="file" type="file" className="mt-1 w-full rounded-md border border-dashed border-[#9eb5aa] bg-[#fbfcfa] px-3 py-3" />
              </label>
              <label className="mb-3 block text-sm font-semibold">
                Note
                <textarea name="note" rows={4} className="mt-1 w-full rounded-md border border-[#cfdad4] bg-white px-3 py-2" />
              </label>
              <button className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#0f8b6f] font-semibold text-white">
                <FileUp size={17} />
                Submit
              </button>
            </form>
            <div className="space-y-3">
              {submissions.length === 0 ? <EmptyState title="No submissions yet" /> : null}
              {submissions.map((submission) => (
                <div key={submission.id} className="rounded-lg border border-[#d9e1dc] bg-white p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{submission.fileName}</h3>
                      <p className="mt-1 text-sm text-[#66756d]">{briefs.find((brief) => brief.id === submission.briefId)?.title}</p>
                      <p className="mt-2 text-sm">{submission.note}</p>
                    </div>
                    <Badge icon={<ShieldCheck size={15} />} label={submission.decision} />
                  </div>
                  {currentUser.name === "Hamdi" ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button onClick={() => decideSubmission(submission.id, "Approved")} className="inline-flex h-9 items-center gap-2 rounded-md bg-[#0f8b6f] px-3 text-sm font-semibold text-white">
                        <Check size={15} />
                        Approve
                      </button>
                      <button onClick={() => decideSubmission(submission.id, "Needs Revision")} className="inline-flex h-9 items-center gap-2 rounded-md bg-[#fff0ee] px-3 text-sm font-semibold text-[#bc3d35]">
                        <AlertTriangle size={15} />
                        Revision
                      </button>
                    </div>
                  ) : null}
                  {submission.reviewerComment ? <p className="mt-3 text-sm text-[#66756d]">{submission.reviewerComment}</p> : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {activeTab === "reports" ? (
          <section className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
            <form onSubmit={addReport} className="rounded-lg border border-[#d9e1dc] bg-white p-4">
              <h2 className="mb-4 text-xl font-semibold">Weekly Reception Report</h2>
              <Field name="week" label="Week start" type="date" />
              <Field name="campaign" label="Campaign" placeholder="Topcare / lasir" />
              <Field name="channel" label="Channel" placeholder="Paid" />
              <Field name="spend" label="Spend" type="number" />
              <Field name="qualifiedLeads" label="Qualified leads" type="number" />
              <Field name="previousRealCpl" label="Previous Real CPL" type="number" />
              <button className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#0f8b6f] font-semibold text-white">
                <Send size={17} />
                Save report
              </button>
            </form>
            <div className="space-y-3">
              {reports.map((report) => {
                const realCpl = report.spend / report.qualifiedLeads;
                const delta = report.previousRealCpl ? realCpl - report.previousRealCpl : 0;
                return (
                  <div key={report.id} className="rounded-lg border border-[#d9e1dc] bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold">{report.campaign}</h3>
                        <p className="text-sm text-[#66756d]">Week <span className="metric">{report.week}</span> - {report.channel}</p>
                      </div>
                      <Badge icon={<BarChart3 size={15} />} label={`Delta ${delta.toFixed(2)} EGP`} />
                    </div>
                    <div className="mt-4 grid gap-2 sm:grid-cols-4">
                      <MiniMetric label="Spend" value={formatEgp(report.spend)} />
                      <MiniMetric label="Leads" value={report.qualifiedLeads.toLocaleString("en-US")} />
                      <MiniMetric label="Real CPL" value={formatEgp(realCpl)} />
                      <MiniMetric label="Previous" value={formatEgp(report.previousRealCpl)} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        {activeTab === "feed" ? (
          <section className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
            <form onSubmit={addStatus} className="rounded-lg border border-[#d9e1dc] bg-white p-4">
              <h2 className="mb-4 text-xl font-semibold">Daily status</h2>
              <TextArea name="completed" label="What did I complete yesterday?" />
              <TextArea name="today" label="What am I working on today?" />
              <TextArea name="blockers" label="Is anything blocking me?" />
              <button className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#0f8b6f] font-semibold text-white">
                <Send size={17} />
                Post
              </button>
            </form>
            <div className="space-y-3">
              {updates.length === 0 ? <EmptyState title="No status updates yet" /> : null}
              {updates.map((update) => (
                <div key={update.id} className="rounded-lg border border-[#d9e1dc] bg-white p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold">{update.member}</h3>
                    <span className="metric text-sm text-[#66756d]">{update.createdAt}</span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <MiniMetric label="Completed" value={update.completed} />
                    <MiniMetric label="Today" value={update.today} />
                    <MiniMetric label="Blockers" value={update.blockers} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#d9e1dc] bg-white p-4">
      <p className="text-sm text-[#66756d]">{label}</p>
      <p className="metric mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-[#f4f7f5] p-3">
      <p className="text-xs font-semibold uppercase text-[#66756d]">{label}</p>
      <p className="metric mt-1 break-words text-sm font-semibold">{value}</p>
    </div>
  );
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#d9e1dc] bg-white px-3 py-1 text-sm text-[#50665c]">
      {icon}
      {label}
    </span>
  );
}

function Field({ name, label, placeholder, type = "text" }: { name: string; label: string; placeholder?: string; type?: string }) {
  return (
    <label className="mb-3 block text-sm font-semibold">
      {label}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="metric mt-1 h-11 w-full rounded-md border border-[#cfdad4] bg-white px-3 outline-none focus:border-[#0f8b6f]"
      />
    </label>
  );
}

function TextArea({ name, label }: { name: string; label: string }) {
  return (
    <label className="mb-3 block text-sm font-semibold">
      {label}
      <textarea name={name} rows={4} className="mt-1 w-full rounded-md border border-[#cfdad4] bg-white px-3 py-2 outline-none focus:border-[#0f8b6f]" />
    </label>
  );
}

function EmptyState({ title }: { title: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[#b8c8c0] bg-white/70 p-8 text-center text-[#66756d]">
      {title}
    </div>
  );
}



