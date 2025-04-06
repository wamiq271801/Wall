
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p>Last updated: April 5, 2025</p>
            
            <h2>Introduction</h2>
            <p>
              Welcome to WallpaperMarket. We respect your privacy and are committed to protecting your personal data.
              This privacy policy will inform you about how we look after your personal data when you visit our website
              and tell you about your privacy rights and how the law protects you.
            </p>
            
            <h2>The Data We Collect About You</h2>
            <p>
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul>
              <li><strong>Identity Data</strong> includes first name, last name, username, or similar identifier.</li>
              <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
              <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, 
              time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology 
              on the devices you use to access this website.</li>
              <li><strong>Usage Data</strong> includes information about how you use our website and services.</li>
            </ul>
            
            <h2>How We Use Your Personal Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul>
              <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
              <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>
            
            <h2>Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at privacy@wallpapermarket.com.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
