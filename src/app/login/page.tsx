import { Login1 } from "@/components/login-1";

export default function LoginPage() {
  return (
    <Login1
      heading="Selamat Datang"
      logo={{
        url: "/",
        src: "https://res.cloudinary.com/dujp9ydkx/image/upload/v1759767613/dinuslogo_ywakje.png",
        alt: "Logo UDINUS",
        title: "UDINUS SITEMU",
        
      }}
      googleText="Login dengan Google Kampus"
    />
  );
}
