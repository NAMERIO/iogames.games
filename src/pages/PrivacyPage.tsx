import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Shield, Lock, Eye, FileText } from 'lucide-react';
import Footer from '../components/Footer';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold gradient-text flex items-center">
            <Shield className="h-7 w-7 mr-3" />
            Privacy Policy
          </h1>
          <Link to="/" className="flex items-center text-indigo-400 hover:text-indigo-300 btn-hover-effect px-4 py-2 rounded-lg">
            <Home className="h-5 w-5 mr-2" />
            <span>Back to Games</span>
          </Link>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 shadow-lg glass-effect animate-slide-in-up">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-indigo-400 flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Introduction
              </h2>
              <p className="mb-4 text-gray-300">
                At IO Games Hub, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website.
              </p>
              <p className="text-gray-300">
                Last updated: June 15, 2025
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-indigo-400 flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Information We Collect
              </h2>
              <h3 className="text-xl font-semibold mb-2 text-white">Personal Information</h3>
              <p className="mb-4 text-gray-300">
                When you create an account, we collect:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
                <li>Email address</li>
                <li>Display name</li>
                <li>Authentication information</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 text-white">Usage Data</h3>
              <p className="mb-4 text-gray-300">
                We automatically collect certain information when you visit our website:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
                <li>Games you play and time spent</li>
                <li>Games you like</li>
                <li>Browser type and version</li>
                <li>Time and date of your visit</li>
                <li>Pages you visit</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-indigo-400 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                How We Use Your Information
              </h2>
              <p className="mb-4 text-gray-300">
                We use the information we collect for various purposes:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
                <li>To provide and maintain our service</li>
                <li>To notify you about changes to our service</li>
                <li>To allow you to participate in interactive features</li>
                <li>To provide customer support</li>
                <li>To gather analysis to improve our service</li>
                <li>To monitor the usage of our service</li>
                <li>To detect, prevent and address technical issues</li>
                <li>To personalize your experience</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-indigo-400">Data Security</h2>
              <p className="mb-4 text-gray-300">
                The security of your data is important to us. We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-indigo-400">Your Data Rights</h2>
              <p className="mb-4 text-gray-300">
                You have the following rights regarding your personal data:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
                <li>The right to access your personal data</li>
                <li>The right to rectification of inaccurate data</li>
                <li>The right to erasure of your data</li>
                <li>The right to restrict processing of your data</li>
                <li>The right to data portability</li>
                <li>The right to object to processing of your data</li>
              </ul>
              <p className="text-gray-300">
                You can exercise these rights through your account settings or by contacting us.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-indigo-400">Cookies</h2>
              <p className="mb-4 text-gray-300">
                We use cookies to enhance your experience on our website. Cookies are small text files that are placed on your computer by websites that you visit. They are widely used to make websites work more efficiently and provide information to the website owners.
              </p>
              <p className="text-gray-300">
                You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-indigo-400">Changes to This Privacy Policy</h2>
              <p className="mb-4 text-gray-300">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
              <p className="text-gray-300">
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-indigo-400">Contact Us</h2>
              <p className="text-gray-300">
                If you have any questions about this Privacy Policy, please contact us at privacy@iogameshub.com.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPage;