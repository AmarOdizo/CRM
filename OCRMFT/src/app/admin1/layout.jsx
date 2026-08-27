import AdminSidebar from "@/componenets/admin/AdminSidebar";
import AdminNavbar from "@/componenets/admin/AdminNavbar";

export default function AdminLayout({ children }) {
  return (
    <div>
      <AdminSidebar />

      <AdminNavbar />

      <main className="ml-72 mt-20 p-8 bg-slate-100 min-h-screen">
        {children}
      </main>
    </div>
  );
}
