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
 *
 * Used site-wide as part of the main layout structure.
 */

export default function Footer() {
  return (
    <>
      <footer className="relative z-10 border-t border-slate-800/50 bg-black/80 backdrop-blur-sm py-6 mt-auto">
        <div className="content-wrapper">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-slate-500 text-sm font-light tracking-wider">
                &copy; 2025 CINEMIND. ALL RIGHTS RESERVED.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
