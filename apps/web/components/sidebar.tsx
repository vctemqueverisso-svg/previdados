"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Briefcase, FileText, Home, Menu, MessageSquare, Scale, ShieldCheck, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "./utils";

const items = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/atendimentos", label: "Atendimentos", icon: MessageSquare },
  { href: "/casos", label: "Casos", icon: Briefcase },
  { href: "/documentos", label: "Documentos", icon: FileText },
  { href: "/peritos", label: "Peritos", icon: Scale },
  { href: "/estatisticas", label: "Estatisticas", icon: BarChart3 },
  { href: "/seguranca", label: "LGPD", icon: ShieldCheck }
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        onClick={() => setOpen((value) => !value)}
        className="fixed left-5 top-5 z-50 flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(24,38,63,0.08)] bg-[linear-gradient(180deg,#11203a_0%,#162847_100%)] text-white shadow-[0_18px_40px_rgba(17,32,58,0.25)]"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-[rgba(8,14,26,0.42)] backdrop-blur-[2px] transition-opacity",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setOpen(false)}
      />

      <aside
        className={cn(
          "fixed inset-y-3 left-3 z-40 flex w-[min(340px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[30px] bg-[linear-gradient(180deg,#111d35_0%,#12213d_58%,#0d172b_100%)] p-3 text-white shadow-[0_24px_80px_rgba(16,25,46,0.35)] transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-[120%]"
        )}
      >
        <div className="glass-line rounded-[22px] border bg-white/[0.045] p-3">
          <div className="flex items-center justify-between gap-3 pr-12">
            <p className="text-[11px] uppercase tracking-[0.28em] text-stone-300">PREVIDAS</p>
            <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-slate-300">
              painel
            </span>
          </div>
          <div className="mt-4 rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))] px-4 py-4">
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Plataforma</p>
            <h1 className="mt-3 text-[1.24rem] font-semibold leading-[1.04] tracking-[-0.02em]">Inteligencia previdenciaria aplicada</h1>
          </div>
          <p className="mt-3 text-[13px] leading-6 text-slate-300">
            Operacao juridica, base documental e leitura estatistica em um so lugar.
          </p>
        </div>

        <nav className="mt-3 flex-1 space-y-1.5 overflow-y-auto pr-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm text-slate-200 hover:bg-white/7",
                  active && "bg-[linear-gradient(135deg,#be8335_0%,#9b6322_100%)] text-white shadow-[0_14px_30px_rgba(183,122,47,0.28)]"
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-slate-300 transition group-hover:bg-white/10",
                    active && "bg-white/15 text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="font-medium tracking-[0.01em]">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-3 rounded-[18px] border border-white/10 bg-white/[0.04] p-3">
          <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Objetivo</p>
          <p className="mt-2 text-[12px] leading-5 text-slate-200">
            Organizar clientes, registrar atendimentos e acompanhar casos com mais clareza e previsibilidade.
          </p>
        </div>
      </aside>
    </>
  );
}
