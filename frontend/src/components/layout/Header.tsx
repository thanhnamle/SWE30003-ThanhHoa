import { Menu, Bell, User } from "lucide-react";
import { useLocation } from "react-router";

export function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <header className="bg-card border-b border-border h-16 sticky top-0 z-10 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-muted rounded-md text-muted-foreground transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        {/* Breadcrumb */}
        <div className="hidden md:flex items-center text-sm text-muted-foreground">
          <span>Home</span>
          {pathnames.map((value, index) => {
            const isLast = index === pathnames.length - 1;
            return (
              <span key={value} className="flex items-center">
                <span className="mx-2">/</span>
                <span className={isLast ? "text-foreground font-medium capitalize" : "capitalize"}>
                  {value}
                </span>
              </span>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-muted rounded-md text-muted-foreground relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive"></span>
        </button>
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground cursor-pointer">
          <User className="h-4 w-4" />
        </div>
      </div>
    </header>
  );
}
