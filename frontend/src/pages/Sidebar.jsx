import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Bell,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  User,
  Newspaper,
  HelpCircle,
  Upload,
  LucideLocate,
  LocateIcon,
  LocateFixedIcon,
  LocateOffIcon,
  LucideRollerCoaster,
  Briefcase,
  Calendar,
  AlertTriangle,
  PinOff,
  MapPin,
  GuitarIcon,
  PersonStanding,
} from "lucide-react";
import { cn } from "./Utils";

export function Sidebar({ className }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  return (
    <div
      className={cn(
        "group flex h-screen flex-col border-r bg-background px-3 py-4 transition-all duration-300 fixed top-0 left-0 z-50", // Add fixed, top-0, left-0, and z-50
        isExpanded ? "w-[240px]" : "w-[70px]",
        className
      )}
    >
      <button
        onClick={toggleSidebar}
        className="mb-8 flex  items-center justify-center rounded-lg bg-purple-600 p-3 text-white hover:bg-purple-700"
        aria-expanded={isExpanded}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <nav className="flex flex-1 flex-col gap-2">
        <NavItem to="/" icon={Home} label="Home" isExpanded={isExpanded} />
        <NavItem
          to="/dashboard"
          icon={Briefcase}
          label="Manage Cases"
          isExpanded={isExpanded}
        />
        <NavItem
          to="/crimes"
          icon={Upload}
          label="Upload"
          isExpanded={isExpanded}
        />
        <NavItem
          to="/chat"
          icon={MessageSquare}
          label="Chats"
          isExpanded={isExpanded}
        />
        <NavItem
          to="/crime-loc"
          icon={MapPin}
          label="Crime Location"
          isExpanded={isExpanded}
        />
        <NavItem
          to="/case-dashboard"
          icon={Newspaper}
          label="Dashboard"
          isExpanded={isExpanded}
        />
        <NavItem
          to="/schedule"
          icon={Calendar}
          label="Schedule"
          isExpanded={isExpanded}
        />
        <NavItem
          to="/hotspots"
          icon={AlertTriangle}
          label="Hotspots"
          isExpanded={isExpanded}
        />
        <NavItem
          to="/cases-ml"
          icon={PersonStanding}
          label="ML on Cases"
          isExpanded={isExpanded}
        />
      </nav>
      <div className="border-t pt-4">
        <NavItem
          to="/profile"
          icon={User}
          label="Profile"
          isExpanded={isExpanded}
        />
        <NavItem
          to="/logout"
          icon={LogOut}
          label="Logout"
          className="text-red-500 hover:bg-red-50"
          isExpanded={isExpanded}
        />
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, count, isExpanded, className, to }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to}>
      <button
        className={cn(
          "group flex w-full items-center rounded-lg p-3 text-gray-700 transition-colors hover:bg-purple-50",
          isActive && "bg-purple-100 text-purple-600",
          className
        )}
        title={!isExpanded ? label : undefined}
      >
        <Icon className="h-6 w-6" />
        {isExpanded && (
          <span className="ml-2 text-base font-medium flex-1">{label}</span>
        )}
        {count && isExpanded && (
          <span className="ml-auto rounded-full bg-purple-100 px-2 py-0.5 text-sm font-medium text-purple-600">
            {count}
          </span>
        )}
      </button>
    </Link>
  );
}
