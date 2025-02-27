import TravelContent from "./components/MedicineContent";
import Footer from "./components/FooterContent";
import { AuthProvider } from "../Auth/AuthProvider";

export default function Home() {
  return (
    <AuthProvider>
      <TravelContent />
      <Footer />
    </AuthProvider>
  );
}
