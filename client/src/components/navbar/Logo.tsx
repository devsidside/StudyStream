import { Link } from "wouter";

interface LogoProps {
  className?: string;
  dataTestId?: string;
}

export function Logo({ className = "", dataTestId = "link-home" }: LogoProps) {
  return (
    <Link href="/">
      <div className={`flex items-center space-x-3 ${className}`} data-testid={dataTestId}>
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
        </div>
        <span className="text-xl font-bold text-foreground">StudyConnect</span>
      </div>
    </Link>
  );
}