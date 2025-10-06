import { Login1 } from "@/components/login-1";

export default function LoginPage() {
  return (
    <Login1
      heading="Selamat Datang"
      logo={{
        url: "/",
        src: "https://dinus.ac.id/wp-content/uploads/2023/11/LogoUdinus.png",
        alt: "Logo UDINUS",
        title: "UDINUS Lost & Found",
      }}
      googleText="Login dengan Google Kampus"
    />
  );
}
