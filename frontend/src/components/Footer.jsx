/**
 * Footer Component
 *
 * Simple footer with copyright information and branding.
 * Features:
 * - Responsive layout with flexbox design
 * - Backdrop blur and border styling for visual depth
 * - Consistent content wrapper for alignment
 * - Typography styling with tracking and font weights
 * - Automatic bottom positioning with mt-auto
 * - Legal links and company information
 *
 * Used site-wide as part of the main layout structure.
 */

export default function Footer() {
  return (
    <>
      <footer className="relative z-10 border-t border-slate-800/50 bg-black/80 backdrop-blur-sm py-8 mt-auto">
        <div className="content-wrapper">
          <div className="flex flex-col space-y-6">
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-6 text-xs">
              <a
                href="#"
                className="text-slate-400 hover:text-cyan-400 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-cyan-400 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-cyan-400 transition-colors"
              >
                Cookie Policy
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-cyan-400 transition-colors"
              >
                DMCA
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-cyan-400 transition-colors"
              >
                API Terms
              </a>
            </div>

            {/* Copyright and Company Info */}
            <div className="text-center space-y-2">
              <p className="text-slate-500 text-sm font-light tracking-wider">
                &copy; 2025 CINEMIND. ALL RIGHTS RESERVED.
              </p>
              <p className="text-slate-500 text-xs">
                CineMind Analytics Inc. | 1600 Amphitheatre Parkway, Mountain
                View, CA 94043
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
