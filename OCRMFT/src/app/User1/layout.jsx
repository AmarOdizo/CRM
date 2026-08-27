import UserSidebar from "@/componenets/user/UserSidebar";
import UserNavbar from "@/componenets/user/UserNavbar";

export default function UserLayout({ children }) {
  return (
    <>
      <UserSidebar />
      <UserNavbar />

      <main className="ml-72 mt-20 p-8 bg-slate-100 min-h-screen">
        {children}
      </main>
    </>
  );
}
