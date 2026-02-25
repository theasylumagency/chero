import HeroBroadcast from "./sections/HeroBroadcast";
import Taste1998 from "./sections/Taste1998";
import Highlights from "./sections/Highlights";
import MenuSignal from "./sections/MenuSignal";
import AtmosphereGallery from "./sections/AtmosphereGallery";
import KobuletiLocation from "./sections/KobuletiLocation";
import FinalCTA from "./sections/FinalCTA";
import SiteFooter from "@/components/layout/SiteFooter";

export default function HomePage() {
    return (
        <main className="min-h-screen bg-[#071018] text-white">
            <HeroBroadcast />
            <Taste1998 />
            <div id="picks">
                <Highlights />
            </div>
            <MenuSignal />
            <AtmosphereGallery />
            <KobuletiLocation />
            <FinalCTA />
            <SiteFooter />
        </main>
    );
}