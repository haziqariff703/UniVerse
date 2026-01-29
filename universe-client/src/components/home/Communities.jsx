import React from "react";
import { motion } from "framer-motion";
import LogoLoop from "@/components/ui/LogoLoop";

// Import all logos
import PMH from "@/assets/logos/PMH.png";
import JPK from "@/assets/logos/JPK.png";
import IREC from "@/assets/logos/IREC.png";
import ICONS from "@/assets/logos/ICONS.png";
import AIMS from "@/assets/logos/AIMS.png";
import IMSA from "@/assets/logos/IMSA.png";
import SMF from "@/assets/logos/SMF.png";

const Communities = () => {
  // Logo configuration with faculty classification
  const communityLogos = [
    // FPM Associations (Cyan glow)
    {
      src: IMSA,
      alt: "IMSA - Information Management Students Association",
      isFPM: true,
    },
    { src: SMF, alt: "SMF - Sekretariat Mahasiswa Fakulti", isFPM: true },
    { src: IREC, alt: "IREC - Integration of Records Community", isFPM: true },

    // Campus-Wide Organizations (Purple glow)
    { src: JPK, alt: "JPK - Jawatankuasa Perwakilan Kolej", isFPM: false },
    { src: PMH, alt: "PMH - Persatuan Mahasiswa Hadhari", isFPM: false },
    { src: AIMS, alt: "AIMS", isFPM: false },
    { src: ICONS, alt: "ICONS", isFPM: false },
  ];

  return (
    <section className="relative py-12 overflow-hidden w-full bg-transparent">
      {/* Full Width Logo Loop */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="w-full"
      >
        <LogoLoop
          logos={communityLogos}
          speed={50}
          direction="left"
          logoHeight={180} // Half the previous size (360 -> 180)
          gap={10} // Half the previous gap (20 -> 10)
          scaleOnHover
          fadeOut
          fadeOutColor="#0b0b27"
          ariaLabel="Community partner organizations"
        />
      </motion.div>
    </section>
  );
};

export default Communities;
