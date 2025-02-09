import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Award,
  Shield,
  Users,
  Phone,
  Star,
  Trophy,
  Medal,
  Target,
} from "lucide-react";

const MainInspectorPage = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const carouselImages = [
    "https://th-i.thgim.com/public/incoming/nv3w0d/article66537043.ece/alternates/LANDSCAPE_1200/TAMIL%20NADU%20CHIEF%20MINISTERS%20CONSTABULARY%20MEDALS%20SHANKAR%20JIWAL%20POLICE_02.jpg",
    "https://wallpapers.com/images/hd/indian-police-marching-apeb5cqlngpun85m.jpg",
    "https://th.bing.com/th/id/OIP.OAxzBlxORRsdEkYejQEIhQHaEG?w=270&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    "https://th.bing.com/th/id/OIP.llWGyniw6HtZlHWcg5WwxQHaE3?w=264&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    "https://wallpapers.com/images/hd/indian-police-marching-apeb5cqlngpun85m.jpg",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextImage = () =>
    setCurrentImage((prev) => (prev + 1) % carouselImages.length);
  const prevImage = () =>
    setCurrentImage(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Enhanced Carousel */}
      <div className="relative h-[450px] bg-gray-900">
        <div className="relative w-full h-full overflow-hidden">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className={`absolute w-full h-full transition-all duration-1000 ${
                currentImage === index
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105"
              }`}
            >
              <img
                src={image}
                alt={`Indian Police Service ${index + 1}`}
                className="w-full h-full object-cover opacity-70"
              />
            </div>
          ))}

          <button
            onClick={prevImage}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full hover:bg-white transition-all shadow-lg"
          >
            <ChevronLeft className="w-7 h-7 text-gray-800" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full hover:bg-white transition-all shadow-lg"
          >
            <ChevronRight className="w-7 h-7 text-gray-800" />
          </button>

          <div className="absolute inset-0 flex items-center justify-center text-center bg-gradient-to-b from-transparent to-gray-900/50">
            <div className="max-w-5xl px-6">
              <h1 className="text-6xl font-bold text-white mb-6">
                Indian Police Service
              </h1>
              <p className="text-2xl text-white/95 font-medium">
                सेवा भक्ति सुरक्षा । Service Devotion Security
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        {/* About IPS Section */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-gray-900 border-l-4 border-blue-600 pl-6">
              About Indian Police Service
            </h2>
            <div className="space-y-4">
              <p className="text-lg text-gray-700 leading-relaxed">
                The Indian Police Service (IPS) is one of the three All India
                Services of the Government of India, established under Article
                312(2) of the Constitution of India. Since its inception in
                1948, IPS officers have been serving the nation with utmost
                dedication and valor.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our officers undergo rigorous training at the Sardar Vallabhbhai
                Patel National Police Academy, Hyderabad, preparing them for the
                challenges of maintaining law and order, preventing crime, and
                ensuring the safety of Indian citizens.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Shield className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                All India Service
              </h3>
              <p className="text-gray-600">
                Constitutional body serving across states
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Users className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Officer Strength
              </h3>
              <p className="text-gray-600">
                4,000+ serving officers nationwide
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Star className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Elite Service
              </h3>
              <p className="text-gray-600">Top 1% selected through UPSC</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Target className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mission</h3>
              <p className="text-gray-600">Serving citizens with integrity</p>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-2xl p-12 shadow-xl">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Notable Achievements
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
              <Trophy className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">
                Counter-Terrorism Excellence
              </h3>
              <p className="text-white/90">
                Successfully neutralized numerous terrorist threats and
                maintained internal security
              </p>
            </div>
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
              <Medal className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">Gallantry Awards</h3>
              <p className="text-white/90">
                Numerous officers decorated with President's Police Medals and
                Gallantry Awards
              </p>
            </div>
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
              <Award className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">UN Peacekeeping</h3>
              <p className="text-white/90">
                Distinguished service in UN Peacekeeping missions across the
                globe
              </p>
            </div>
          </div>
        </section>

        {/* Key Responsibilities */}
        <section className="space-y-12">
          <h2 className="text-4xl font-bold text-gray-900 text-center">
            Our Responsibilities
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Law Enforcement
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Crime prevention and detection</li>
                <li>• Maintaining public order</li>
                <li>• Traffic management</li>
                <li>• Anti-corruption operations</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Special Operations
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Counter-terrorism</li>
                <li>• Intelligence gathering</li>
                <li>• VIP security</li>
                <li>• Cyber crime prevention</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Community Service
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Community policing</li>
                <li>• Citizen assistance</li>
                <li>• Youth engagement</li>
                <li>• Public awareness</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Emergency Contact */}
        <section className="bg-red-600 text-white p-10 rounded-2xl text-center shadow-xl">
          <h2 className="text-3xl font-bold mb-6">Emergency Contact Numbers</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/10 p-4 rounded-xl">
              <Phone className="w-8 h-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">100</p>
              <p className="text-sm">Police Emergency</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl">
              <Phone className="w-8 h-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">112</p>
              <p className="text-sm">Universal Emergency</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl">
              <Phone className="w-8 h-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">1091</p>
              <p className="text-sm">Women Helpline</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MainInspectorPage;
// const { setUser, user, setIsAuthen, setLoading, setError, setIsAgent } =
//   useContext(UserContext);
