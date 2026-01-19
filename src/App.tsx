import { lazy, Suspense } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";

// Loading Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-muted-foreground">جاري التحميل...</p>
    </div>
  </div>
);

// Public Pages (Lazy loaded for better performance)
const Index = lazy(() => import("./pages/Index"));
const IndexPremium = lazy(() => import("./pages/IndexPremium"));
const Destinations = lazy(() => import("./pages/Destinations"));
const DestinationDetails = lazy(() => import("./pages/DestinationDetails"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const Honeymoon = lazy(() => import("./pages/Honeymoon"));
const Offers = lazy(() => import("./pages/Offers"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Booking = lazy(() => import("./pages/Booking"));
const BookingConfirmation = lazy(() => import("./pages/BookingConfirmation"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const ApiPage = lazy(() => import("./pages/Api"));
const Hotels = lazy(() => import("./pages/Hotels"));
const Programs = lazy(() => import("./pages/Programs"));
const CarRental = lazy(() => import("./pages/CarRental"));
const Visas = lazy(() => import("./pages/Visas"));
const Insurance = lazy(() => import("./pages/Insurance"));
const Flights = lazy(() => import("./pages/Flights"));
const FlightBooking = lazy(() => import("./pages/FlightBooking"));
const SearchPage = lazy(() => import("./pages/Search"));
const Careers = lazy(() => import("./pages/Careers"));
const Tabby = lazy(() => import("./pages/Tabby"));
const Tamara = lazy(() => import("./pages/Tamara"));
const Loyalty = lazy(() => import("./pages/Loyalty"));
const AmadeusFlights = lazy(() => import("./pages/AmadeusFlights"));
const CustomerSupport = lazy(() => import("./pages/CustomerSupport"));
const ServiceGuarantee = lazy(() => import("./pages/ServiceGuarantee"));
const ServiceInfo = lazy(() => import("./pages/ServiceInfo"));
const Services = lazy(() => import("./pages/Services"));
const ProgramDetails = lazy(() => import("./pages/ProgramDetails"));
const HotelDetails = lazy(() => import("./pages/HotelDetails"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const NotFound = lazy(() => import("./pages/NotFound"));
const MyBookings = lazy(() => import("./pages/MyBookings"));

// Southeast Asia Pages
const Thailand = lazy(() => import("./pages/countries/Thailand"));
const Malaysia = lazy(() => import("./pages/countries/Malaysia"));
const Indonesia = lazy(() => import("./pages/countries/Indonesia"));
const Vietnam = lazy(() => import("./pages/countries/Vietnam"));
const Philippines = lazy(() => import("./pages/countries/Philippines"));
const Singapore = lazy(() => import("./pages/countries/Singapore"));

// Middle East / Turkey
const Turkey = lazy(() => import("./pages/countries/Turkey"));

// City Template
const CityDetails = lazy(() => import("./components/templates/CityTemplate"));

// Auth Pages (Lazy loaded)
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));

// Admin Pages (Lazy loaded)
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminBookings = lazy(() => import("./pages/admin/Bookings"));
const AdminDestinations = lazy(() => import("./pages/admin/Destinations"));
const AdminPrograms = lazy(() => import("./pages/admin/Programs"));
const AdminHotels = lazy(() => import("./pages/admin/Hotels"));
const AdminOffers = lazy(() => import("./pages/admin/Offers"));
const AdminPayments = lazy(() => import("./pages/admin/Payments"));
const AdminReviews = lazy(() => import("./pages/admin/Reviews"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminMessages = lazy(() => import("./pages/admin/Messages"));
const AdminReports = lazy(() => import("./pages/admin/Reports"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const AdminDestinationNew = lazy(() => import("./pages/admin/DestinationNew"));
const AdminProgramNew = lazy(() => import("./pages/admin/ProgramNew"));
const AdminFlights = lazy(() => import("./pages/admin/Flights"));
const AdminOfferNew = lazy(() => import("./pages/admin/OfferNew"));
const AdminArticles = lazy(() => import("./pages/admin/Articles"));
const AdminAISettings = lazy(() => import("./pages/admin/AISettings"));
const AdminDestinationEdit = lazy(() => import("./pages/admin/DestinationEdit"));
const AdminProgramEdit = lazy(() => import("./pages/admin/ProgramEdit"));
const AdminOfferEdit = lazy(() => import("./pages/admin/OfferEdit"));
const AdminSoutheastAsiaCountries = lazy(() => import("./pages/admin/SoutheastAsiaCountries"));
const AdminSoutheastAsiaCities = lazy(() => import("./pages/admin/SoutheastAsiaCities"));

// Components
import AIChat from "./components/AIChat";
import MobileNav from "./components/MobileNav";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AIChat />
          <MobileNav />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/premium" element={<IndexPremium />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/destinations/:id" element={<DestinationDetails />} />
              <Route path="/destinations/:slug" element={<DestinationDetails />} />
              <Route path="/programs/:id" element={<ProgramDetails />} />
              <Route path="/hotels/:id" element={<HotelDetails />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/honeymoon" element={<Honeymoon />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/booking/confirmation" element={<BookingConfirmation />} />
              <Route path="/sitemap" element={<Sitemap />} />
              <Route path="/flights" element={<Flights />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/car-rental" element={<CarRental />} />
              <Route path="/visas" element={<Visas />} />
              <Route path="/insurance" element={<Insurance />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/flight-booking" element={<FlightBooking />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/tabby" element={<Tabby />} />
              <Route path="/tamara" element={<Tamara />} />
              <Route path="/loyalty" element={<Loyalty />} />
              <Route path="/amadeus-flights" element={<AmadeusFlights />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/customer-support" element={<CustomerSupport />} />
              <Route path="/service-guarantee" element={<ServiceGuarantee />} />
              <Route path="/service-info" element={<ServiceInfo />} />
              <Route path="/services" element={<Services />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />

              {/* Southeast Asia Routes */}
              <Route path="/country/thailand" element={<Thailand />} />
              <Route path="/country/malaysia" element={<Malaysia />} />
              <Route path="/country/indonesia" element={<Indonesia />} />
              <Route path="/country/vietnam" element={<Vietnam />} />
              <Route path="/country/philippines" element={<Philippines />} />
              <Route path="/country/singapore" element={<Singapore />} />

              {/* Turkey Route */}
              <Route path="/country/turkey" element={<Turkey />} />

              {/* City Details Route */}
              <Route path="/country/:countryId/city/:cityId" element={<CityDetails />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/auth/callback" element={<AuthCallback />} />

              {/* Admin Routes (Protected) */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="destinations" element={<AdminDestinations />} />
                <Route path="destinations/new" element={<AdminDestinationNew />} />
                <Route path="programs" element={<AdminPrograms />} />
                <Route path="programs/new" element={<AdminProgramNew />} />
                <Route path="flights" element={<AdminFlights />} />
                <Route path="hotels" element={<AdminHotels />} />
                <Route path="offers" element={<AdminOffers />} />
                <Route path="offers/new" element={<AdminOfferNew />} />
                <Route path="offers/edit/:id" element={<AdminOfferEdit />} />
                <Route path="destinations/edit/:id" element={<AdminDestinationEdit />} />
                <Route path="programs/edit/:id" element={<AdminProgramEdit />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="articles" element={<AdminArticles />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="ai-settings" element={<AdminAISettings />} />
                <Route path="southeast-asia-countries" element={<AdminSoutheastAsiaCountries />} />
                <Route path="southeast-asia-cities" element={<AdminSoutheastAsiaCities />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;