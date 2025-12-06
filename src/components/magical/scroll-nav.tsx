'use client';

import type { ReactElement } from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { Gift, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  emoji: string;
}

const navItems: NavItem[] = [
  { href: '#hero', label: 'Home', emoji: '🏠' },
  { href: '#workshop', label: 'Workshop', emoji: '🏭' },
  { href: '#elves', label: 'Elves', emoji: '🧝' },
  { href: '#sleigh', label: 'Sleigh', emoji: '🛷' },
  { href: '#reindeer', label: 'Reindeer', emoji: '🦌' },
  { href: '#inventory', label: 'Gifts', emoji: '🎁' },
];

interface ScrollNavProps {
  onStartJourney: () => void;
}

export function ScrollNav({ onStartJourney }: ScrollNavProps): ReactElement {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);

      // Determine active section
      const sections = navItems.map((item) => item.href.slice(1));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-transparent'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="#hero"
              className="flex items-center gap-2 group"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <motion.span
                className="text-2xl"
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎅
              </motion.span>
              <span
                className={cn(
                  'font-bold transition-colors',
                  isScrolled ? 'text-gray-900' : 'text-white'
                )}
              >
                Santa&apos;s Workshop
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    const target = document.getElementById(item.href.slice(1));
                    target?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5',
                    activeSection === item.href.slice(1)
                      ? isScrolled
                        ? 'bg-red-100 text-red-700'
                        : 'bg-white/20 text-white'
                      : isScrolled
                      ? 'text-gray-600 hover:bg-gray-100'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <span>{item.emoji}</span>
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="flex items-center gap-2">
              <Button
                onClick={onStartJourney}
                size="sm"
                className={cn(
                  'hidden sm:flex transition-all',
                  isScrolled
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30'
                )}
              >
                <Gift className="w-4 h-4 mr-1.5" />
                Start
              </Button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  'md:hidden p-2 rounded-lg transition-colors',
                  isScrolled
                    ? 'text-gray-600 hover:bg-gray-100'
                    : 'text-white hover:bg-white/10'
                )}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-30 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.nav
              className="absolute top-16 left-4 right-4 bg-white rounded-2xl shadow-xl p-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    const target = document.getElementById(item.href.slice(1));
                    target?.scrollIntoView({ behavior: 'smooth' });
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    activeSection === item.href.slice(1)
                      ? 'bg-red-100 text-red-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  <span className="text-xl">{item.emoji}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onStartJourney();
                  }}
                  className="w-full"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Start Your Gift Journey
                </Button>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
