function Footer() {
  return (
    <footer className="bg-pastelBlue-600 text-white py-4 mt-8">
      <div className="container mx-auto text-center text-sm">
        © {new Date().getFullYear()} JobMatch. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
