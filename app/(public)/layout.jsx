import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PublicLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
