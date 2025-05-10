import type { Metadata } from "next";
import {
  Almendra_SC,
  IM_Fell_English,
  MedievalSharp,
  Wix_Madefor_Display,
} from "next/font/google";
import "./globals.css";
import Providers from "./components/Provider";
import { ThemeProvider } from "./ThemeProvider";
import ClientSessionProvider from "./ClientSessionProvider";

const defaultfont = Wix_Madefor_Display({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--default-font", // Define the font variable
});

const medievalfont = MedievalSharp({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--medieval-font", // Define the font variable
});

const alemendra = Almendra_SC({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--alemendra-font", // Define the font variable
});

const imefellenglish = IM_Fell_English({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--imfellenglish-font", // Define the font variable
});

export const metadata: Metadata = {
  title: "StoryChat",
  description: "Your AI Storyteller",
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
const setInitialTheme = `
  (function() {
    try {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = savedTheme || (prefersDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);

      const updateThemeVariables = (theme) => {
        const isDark = theme === 'dark';
        document.documentElement.style.setProperty('--color-custom-background-primary', isDark ? 'var(--color-custom-background-primary-dark)' : 'var(--color-custom-background-primary-light)');
        document.documentElement.style.setProperty('--color-custom-background-secondary', isDark ? 'var(--color-custom-background-secondary-dark)' : 'var(--color-custom-background-secondary-light)');
        document.documentElement.style.setProperty('--color-custom-accent-primary', isDark ? 'var(--color-custom-accent-primary-dark)' : 'var(--color-custom-accent-primary-light)');
        document.documentElement.style.setProperty('--color-custom-accent-secondary', isDark ? 'var(--color-custom-accent-secondary-dark)' : 'var(--color-custom-accent-secondary-light)');
        document.documentElement.style.setProperty('--color-custom-accent-tertiary', isDark ? 'var(--color-custom-accent-tertiary-dark)' : 'var(--color-custom-accent-tertiary-light)');
        document.documentElement.style.setProperty('--color-custom-accent-quartiary', isDark ? 'var(--color-custom-accent-quartiary-dark)' : 'var(--color-custom-accent-quartiary-light)');
      };

      updateThemeVariables(theme);

      // Listen for theme changes and update variables dynamically
      window.addEventListener('storage', (event) => {
        if (event.key === 'theme') {
          const newTheme = event.newValue || (prefersDark ? 'dark' : 'light');
          document.documentElement.setAttribute('data-theme', newTheme);
          updateThemeVariables(newTheme);
        }
      });

      console.log('Applied theme:', theme);
    } catch (e) {
      console.error('Error applying theme:', e);
    }
  })();`;
  return (
    <html
      lang="en"
      suppressHydrationWarning={true}
      className={`${defaultfont.variable} ${medievalfont.variable} ${alemendra.variable} ${imefellenglish.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{__html: setInitialTheme}}/>
      </head>
      <body className="antialiased">
        <Providers>
          <ClientSessionProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </ClientSessionProvider>
        </Providers>
      </body>
    </html>
  );
}
