import Header from './Header';
import Footer from './Footer';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-sand-50 text-slate-900">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
