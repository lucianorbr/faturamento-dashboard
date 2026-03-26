import "../index.css";

export const metadata = {
  title: "Dashboard Faturamento",
  description: "Dashboard de Faturamento",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
