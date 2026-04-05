import type { Metadata } from "next";
import Image from "next/image";
import "./globals.css";
import { Sidebar } from "../components/sidebar";

export const metadata: Metadata = {
  title: "PreviDados",
  description: "Sistema juridico-previdenciario para advocacia previdenciaria"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <Sidebar />
        <main className="min-h-screen px-3 py-3 md:px-5 md:py-5 lg:px-6 lg:py-6">
          <div className="section-shell relative min-h-[calc(100vh-1.5rem)] px-5 py-5 md:px-7 md:py-7 lg:pt-20">
            <div className="pointer-events-none absolute right-4 top-5 flex items-center justify-center md:right-7 md:top-8 lg:right-8 lg:top-9">
              <Image
                src="/brand/mark-dark.svg"
                alt="Joao Carvalho Advocacia e Consultoria Juridica"
                width={92}
                height={92}
                priority
                className="h-auto w-[3.75rem] object-contain opacity-95 drop-shadow-[0_10px_24px_rgba(16,27,46,0.10)] sm:hidden"
              />
              <Image
                src="/brand/logo-dark.svg"
                alt="Joao Carvalho Advocacia e Consultoria Juridica"
                width={340}
                height={180}
                priority
                className="hidden h-auto w-[8.5rem] object-contain opacity-95 drop-shadow-[0_10px_24px_rgba(16,27,46,0.10)] sm:block md:w-[13rem] lg:w-[18rem]"
              />
            </div>
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
