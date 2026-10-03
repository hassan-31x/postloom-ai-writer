"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FeatherIcon,
  BookmarkSimpleIcon,
  FolderSimpleIcon,
  ImageIcon,
  SlidersHorizontalIcon,
  SignOutIcon,
  ArrowUpRightIcon,
} from "@phosphor-icons/react";
import { Brand } from "@/components/brand";
import { logout } from "@/actions/account";
const links = [
  { href: "/dashboard", label: "Write a post", icon: FeatherIcon },
  { href: "/dashboard/drafts", label: "Saved drafts", icon: BookmarkSimpleIcon },
  { href: "/dashboard/sources", label: "Reference sources", icon: FolderSimpleIcon },
  { href: "/dashboard/images", label: "Image studio", icon: ImageIcon },
  { href: "/dashboard/settings", label: "Brand & settings", icon: SlidersHorizontalIcon },
];
export function AppNav({ name, used, limit }: { name: string; used: number; limit: number }) {
  const path = usePathname();
  return (
    <aside className="app-sidebar">
      <Brand />
      <div className="workspace-label">
        <span className="workspace-letter">{name.slice(0, 1).toUpperCase()}</span>
        <div>
          Personal workspace<small>Creator plan</small>
        </div>
      </div>
      <nav aria-label="Workspace">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            href={href}
            key={href}
            className={path === href ? "active" : ""}
            aria-current={path === href ? "page" : undefined}
          >
            <Icon size={20} />
            {label}
          </Link>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="usage-box">
          <div>
            <span>Daily writing allowance</span>
            <strong>
              {Math.min(used, limit)} / {limit}
            </strong>
          </div>
          <progress
            max={limit}
            value={Math.min(used, limit)}
            aria-label="Daily AI allowance used"
          />
          <p>A fresh start at midnight UTC.</p>
        </div>
        <Link href="/" className="sidebar-link">
          Visit Postloom <ArrowUpRightIcon size={16} />
        </Link>
        <div className="sidebar-user">
          <span className="avatar">{name.slice(0, 1).toUpperCase()}</span>
          <span>{name}</span>
          <form action={logout}>
            <button className="icon-button" aria-label="Sign out">
              <SignOutIcon size={19} />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
