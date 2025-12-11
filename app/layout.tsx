import "./globals.css";
import Footer from "../components/Footer";
import { Providers } from "./providers";

export const metadata = {
  title: "Tutor Scheduler",
  description: "Assignment Project by Parish Gawari",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-100">
        <Providers>
          <main className="flex-1 mx-auto w-full">{children}</main>
        </Providers>

        <Footer />
      </body>
    </html>
  );
}
