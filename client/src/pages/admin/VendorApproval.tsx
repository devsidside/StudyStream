import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ServicesListing from "@/components/services/services-listing";

export default function Vendors() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ServicesListing 
        apiEndpoint="/api/vendors"
        title="Campus Services & Vendors"
        subtitle="Discover trusted services near your campus"
      />
      <Footer />
    </div>
  );
}
