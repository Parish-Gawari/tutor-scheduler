import "./globals.css";
import Footer from "../components/Footer";

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
      <body className="min-h-screen flex flex-col bg-gray-100 overflow-x-hidden">
        {/* Main Content */}
        <main className="flex-1 w-full">{children}</main>
        <Footer />

        {/* Global Footer */}
      </body>
    </html>
  );
}
