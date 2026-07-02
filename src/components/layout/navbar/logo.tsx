import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3"
    >
      <Image
        src="/pictures/weblogo.png"
        alt="Abdul Rehman"
        width={42}
        height={42}
        priority
        className="rounded-full"
      />

      <div className="leading-none">
        <p className="font-semibold text-sm">Abdul Rehman</p>
        <p className="text-xs text-muted-foreground">
        Full Stack Engineer
        </p>
      </div>
    </Link>
  );
}