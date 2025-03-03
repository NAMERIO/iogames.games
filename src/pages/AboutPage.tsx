import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Info, Users, Code, Award, Globe, Heart } from 'lucide-react';
import Footer from '../components/Footer';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold gradient-text flex items-center">
            <Info className="h-7 w-7 mr-3" />
            About IO Games Hub
          </h1>
          <Link to="/" className="flex items-center text-indigo-400 hover:text-indigo-300 btn-hover-effect px-4 py-2 rounded-lg">
            <Home className="h-5 w-5 mr-2" />
            <span>Back to Games</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-8 shadow-lg glass-effect animate-slide-in-up">
              <h2 className="text-2xl font-bold mb-6 gradient-text">Our Mission</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                IO Games Hub was created with a simple mission: to bring together the best .io games from around the web in one convenient platform. We believe that gaming should be accessible, fun, and community-driven.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Our platform is designed to help players discover new games, connect with other gamers, and enjoy a seamless gaming experience without the need for downloads or installations. We're passionate about the .io gaming genre and committed to supporting its growth and evolution.
              </p>

              <h2 className="text-2xl font-bold mb-6 mt-10 gradient-text flex items-center">
                <Users className="h-6 w-6 mr-2" />
                Our Team
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-700 p-6 rounded-lg">
                  <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl mb-4">
                    N
                  </div>
                  <h3 className="text-xl font-bold text-white">NAMERIO</h3>
                  <p className="text-gray-400">Developer</p>
                  <p className="mt-3 text-gray-300">
                    Gamer with a passion for creating accessible web games and building communities.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-6 mt-10 gradient-text flex items-center">
                <Code className="h-6 w-6 mr-2" />
                Technology
              </h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                IO Games Hub is built using modern web technologies to ensure a fast, responsive, and secure experience:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <div className="text-indigo-400 text-4xl mb-2">⚛️</div>
                  <h3 className="font-semibold">React</h3>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <div className="text-indigo-400 text-4xl mb-2">🔥</div>
                  <h3 className="font-semibold">Firebase</h3>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <div className="text-indigo-400 text-4xl mb-2">🎨</div>
                  <h3 className="font-semibold">Tailwind CSS</h3>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <div className="text-indigo-400 text-4xl mb-2">📦</div>
                  <h3 className="font-semibold">Vite</h3>
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-6 mt-10 gradient-text flex items-center">
                <Award className="h-6 w-6 mr-2" />
                Our Values
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="bg-indigo-900 p-2 rounded-full mr-4 mt-1">
                    <Globe className="h-5 w-5 text-indigo-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Accessibility</h3>
                    <p className="text-gray-300">We believe games should be accessible to everyone, regardless of device or technical knowledge.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-indigo-900 p-2 rounded-full mr-4 mt-1">
                    <Users className="h-5 w-5 text-indigo-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Community</h3>
                    <p className="text-gray-300">We foster a positive, inclusive community where gamers can connect and share experiences.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-indigo-900 p-2 rounded-full mr-4 mt-1">
                    <Heart className="h-5 w-5 text-indigo-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Passion</h3>
                    <p className="text-gray-300">We're passionate about .io games and dedicated to supporting developers and players alike.</p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-6 mt-10 gradient-text">Contact Us</h2>
              <p className="text-gray-300 mb-4">
                Have questions, suggestions, or feedback? We'd love to hear from you!
              </p>
              <div className="bg-gray-700 p-6 rounded-lg">
                <p className="mb-2">
                  <span className="font-semibold text-indigo-400">Email:</span> 
                  <a href="mailto:contact@iogameshub.com" className="text-white ml-2 hover:text-indigo-300 transition-colors">
                      (comming-soon)
                  </a>
                </p>
                <p className="mb-2">
                  <span className="font-semibold text-indigo-400">Discord:</span> 
                  <a href="https://discord.gg/iogames" target="_blank" rel="noopener noreferrer" className="text-white ml-2 hover:text-indigo-300 transition-colors">
                    (comming-soon)
                  </a>
                </p>
                {/* <p>
                  <span className="font-semibold text-indigo-400">Twitter:</span> 
                  <a href="https://twitter.com/iogameshub" target="_blank" rel="noopener noreferrer" className="text-white ml-2 hover:text-indigo-300 transition-colors">
                   (comming-soon)
                  </a>
                </p> */}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg glass-effect animate-slide-in-up">
              <h2 className="text-xl font-bold mb-4 gradient-text">Platform Stats</h2>
              <div className="space-y-4 mb-8">
                <div className="bg-gray-700 p-4 rounded-lg flex items-center justify-between">
                  <span className="text-gray-300">Games Available</span>
                  <span className="text-2xl font-bold text-indigo-400">20+</span>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg flex items-center justify-between">
                  <span className="text-gray-300">Active Users</span>
                  <span className="text-2xl font-bold text-indigo-400">N/A</span>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg flex items-center justify-between">
                  <span className="text-gray-300">Game Categories</span>
                  <span className="text-2xl font-bold text-indigo-400">8</span>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg flex items-center justify-between">
                  <span className="text-gray-300">Founded</span>
                  <span className="text-2xl font-bold text-indigo-400">2025</span>
                </div>
              </div>

              <h2 className="text-xl font-bold mb-4 gradient-text mt-8">For Game Developers</h2>
              <p className="text-gray-300 mb-4">
                Are you a game developer interested in featuring your game on IO Games Hub?
              </p>
              <a 
                href="https://github.com/io-games-community/submit-game" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full bg-indigo-600 text-white py-3 px-4 rounded-lg text-center hover:bg-indigo-700 transition-colors btn-hover-effect"
              >
                Submit Your Game (Comming soon)
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;