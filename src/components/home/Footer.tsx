export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center text-gray-600">
        <p>© {currentYear} SkillAlign. All rights reserved.</p>
        <p className="mt-2 text-sm">Your career success is our mission.</p>
      </div>
    </footer>
  );
}
