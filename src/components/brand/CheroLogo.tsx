import Image from "next/image";

interface CheroLogoProps {
    className?: string;
}

export default function CheroLogo({ className }: CheroLogoProps) {
    return (
        <div className={className}>
            <Image
                src="/brand/logo-white.png"
                alt="Chero Logo"
                width={260}
                height={100}
                className="w-full h-auto"
                priority
            />
        </div>
    );
}