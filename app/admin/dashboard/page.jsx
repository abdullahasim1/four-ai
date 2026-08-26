"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import {
  FaBan,
  FaCheck,
  FaSearch,
  FaSignOutAlt,
  FaUserShield,
  FaUsers,
} from "react-icons/fa";

import PageShell, { PageHeader } from "@/components/PageShell";
import { toast } from "@/lib/toast";
import { adminApi } from "@/lib/api";
import { clearSession, isAdmin } from "@/lib/auth-client";

function AnimatedNumber({ value, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = value;
      return;
    }
    const state = { v: Number(el.textContent) || 0 };
    const tween = gsap.to(state, {
      v: value,
      duration: 0.9,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = Math.round(state.v);
      },
    });
    return () => tween.kill();
  }, [value]);

  return (
    <p ref={ref} className={className}>
      0
    </p>
  );
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [authed, setAuthed] = useState(false);
  const router = useRouter();

  const loadUsers = useCallback(
    async (query = search) => {
      setLoading(true);
      try {
        const data = await adminApi.getUsers(query);
        if (data.success) setUsers(data.users);
        else toast.error(data.message || "Failed to load users");
      } catch (err) {
        if (err.status === 401 || err.status === 403) {
          clearSession();
          router.replace("/login");
          return;
        }
        toast.error("Couldn't reach the server");
      } finally {
        setLoading(false);
      }
    },
    [router, search]
  );

  useEffect(() => {
    if (!isAdmin()) {
      router.replace("/login");
      return;
    }
    setAuthed(true);
    loadUsers("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!authed) {
    return (
      <PageShell contentClassName="flex min-h-screen items-center justify-center">
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-400/30 border-t-indigo-400" />
      </PageShell>
    );
  }

  const handleBanToggle = async (user) => {
    setBusyId(user.id);
    try {
      const data = await adminApi.banUser(user.id, !user.banned);
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, banned: !user.banned } : u))
        );
        toast.success(`${user.name} ${!user.banned ? "banned" : "unbanned"}`);
      } else {
        toast.error(data.message || "Action failed");
      }
    } catch {
      toast.error("Action failed. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  return (
    <PageShell contentClassName="mx-auto max-w-4xl px-4 py-12">
      <div className="flex items-center justify-between">
        <PageHeader
          icon={<FaUserShield className="gradient-text" />}
          title="Admin Dashboard"
          subtitle="All registered users, synced live with the database."
        />
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loadUsers(search);
          }}
          className="relative flex-1"
        >
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="input-field !pl-11"
          />
        </form>
        <button onClick={handleLogout} className="btn-secondary shrink-0">
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Stats */}
      <div data-reveal-group className="mb-6 grid grid-cols-3 gap-3 text-center">
        <div className="glass-card p-4">
          <AnimatedNumber value={users.length} className="text-2xl font-bold text-white" />
          <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-slate-400"><FaUsers /> Total</p>
        </div>
        <div className="glass-card p-4">
          <AnimatedNumber value={users.filter((u) => !u.banned).length} className="text-2xl font-bold text-emerald-300" />
          <p className="mt-1 text-xs text-slate-400">Active</p>
        </div>
        <div className="glass-card p-4">
          <AnimatedNumber value={users.filter((u) => u.banned).length} className="text-2xl font-bold text-rose-300" />
          <p className="mt-1 text-xs text-slate-400">Banned</p>
        </div>
      </div>

      {/* Users */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card h-24 animate-pulse !bg-white/[0.04]" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <FaUsers className="mx-auto mb-3 text-4xl text-indigo-400/40" />
          <p className="text-sm text-slate-400">No users match your search.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className={`glass-card flex flex-col gap-4 p-5 transition-colors md:flex-row md:items-center md:justify-between ${
                user.banned ? "!border-rose-500/30 !bg-rose-500/[0.06]" : ""
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-semibold text-white">{user.name}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      user.banned
                        ? "bg-rose-500/20 text-rose-300"
                        : "bg-emerald-500/20 text-emerald-300"
                    }`}
                  >
                    {user.banned ? "Banned" : "Active"}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-sm text-slate-400">{user.email}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Joined {formatDate(user.createdAt)} · {user.activityCount} activities
                </p>
              </div>

              <button
                onClick={() => handleBanToggle(user)}
                disabled={busyId === user.id}
                className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                  user.banned
                    ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                    : "bg-rose-500/20 text-rose-300 hover:bg-rose-500/30"
                } disabled:opacity-50`}
              >
                {busyId === user.id ? (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : user.banned ? (
                  <>
                    <FaCheck className="mr-1.5 inline" /> Unban
                  </>
                ) : (
                  <>
                    <FaBan className="mr-1.5 inline" /> Ban
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
