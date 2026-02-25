"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AtmosphereGallery() {
    const t = useTranslations("home.atmosphere");

    const images = [
        "/interior/chero_interior_1.webp",
        "/interior/chero_interior_2.webp",
        "/interior/chero_interior_3.webp",
        "/interior/chero_interior_4.webp",
        "/interior/chero_interior_5.webp",
    ];

    return (
        <section className="relative w-full py-24 md:py-40 bg-[#050B10] overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#B7C7FF]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-0 w-[40rem] h-[40rem] bg-[#5361A5]/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 relative z-10">
                {/* Header Sequence */}
                <div className="max-w-4xl mx-auto text-center mb-20 md:mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="flex items-center justify-center gap-4 mb-6"
                    >
                        <div className="w-8 h-[1px] bg-[#B7C7FF]/40" />
                        <span className="text-xs sm:text-sm tracking-[0.2em] text-[#B7C7FF] uppercase">{t("subtitle")}</span>
                        <div className="w-8 h-[1px] bg-[#B7C7FF]/40" />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-light mb-8 font-serif leading-tight text-white"
                    >
                        {t("title")}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-base sm:text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl mx-auto"
                    >
                        {t("description")}
                    </motion.p>
                </div>

                {/* Chaotic Gallery Flow */}
                <div className="relative w-full flex flex-col gap-12 sm:gap-20 md:gap-32">

                    {/* Block 1: Massive Hero & Tiny Inset */}
                    <div className="relative w-full flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="w-full md:w-[70%] h-[50vh] min-h-[400px] md:h-[80vh] relative rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <Image
                                src={images[0]}
                                alt="Atmosphere main"
                                fill
                                className="object-cover transition-transform duration-[30s] hover:scale-110"
                            />
                            {/* Text Overlay 1 */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050B10]/90 via-transparent to-transparent flex items-end p-8 md:p-12">
                                <motion.p
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                    className="text-white/90 text-lg md:text-2xl font-serif max-w-md leading-relaxed tracking-wide"
                                >
                                    "{t("photoText1")}"
                                </motion.p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                            className="w-[80%] md:w-[25%] h-[300px] md:h-[450px] relative rounded-lg overflow-hidden md:mt-40 shadow-xl self-end md:self-auto"
                        >
                            <Image
                                src={images[1]}
                                alt="Atmosphere detail"
                                fill
                                className="object-cover transition-transform duration-[20s] hover:scale-105"
                            />
                        </motion.div>
                    </div>

                    {/* Block 2: The Core Chaos (overlapping structure) */}
                    <div className="relative w-full flex flex-col md:flex-row justify-center items-center gap-12 md:gap-0 mt-8 md:mt-20">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="w-[90%] md:w-[45%] h-[400px] md:h-[600px] relative rounded-xl overflow-hidden shadow-2xl z-20 md:-mr-20 md:-mt-20"
                        >
                            <Image
                                src={images[2]}
                                alt="Atmosphere perspective"
                                fill
                                className="object-cover transition-transform duration-[25s] hover:scale-110"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                            className="w-full md:w-[60%] h-[450px] md:h-[700px] relative rounded-3xl overflow-hidden shadow-2xl z-10"
                        >
                            <Image
                                src={images[3]}
                                alt="Atmosphere mood"
                                fill
                                className="object-cover transition-transform duration-[30s] hover:scale-105"
                            />
                            {/* Text Overlay 2 */}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-8 text-center backdrop-blur-[2px]">
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, delay: 0.8 }}
                                    className="text-white text-xl md:text-3xl lg:text-4xl font-serif max-w-2xl leading-snug tracking-wide drop-shadow-lg"
                                >
                                    {t("photoText2")}
                                </motion.p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Block 3: The Wide Release */}
                    <motion.div
                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="w-[95%] md:w-[85%] mx-auto h-[350px] md:h-[500px] relative rounded-2xl overflow-hidden shadow-xl mt-8 md:mt-24"
                    >
                        <Image
                            src={images[4]}
                            alt="Atmosphere wide"
                            fill
                            className="object-cover transition-transform duration-[25s] hover:scale-105"
                        />
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
