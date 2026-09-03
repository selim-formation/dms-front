import { Upload } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/components/ui/button";
import patternImage from "@/assets/ramadan_pattern_transparent.png";

interface Props {
  greeting: string;
  firstName: string;
  logo: string;
  tenant: string;
}

export default function HeroSection({
  greeting,
  firstName,
  logo,
  tenant,
}: Props) {
  const { t } = useTranslation(["home", "common"]);
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 px-8 py-10 text-primary-foreground z-10">
      {/* Decorative circles */}
      <div className="absolute -top-20 -end-20 h-64 w-64 rounded-full bg-white/5" />
      <div className="absolute -bottom-16 -start-16 h-48 w-48 rounded-full bg-white/5" />

      {/* Ramadan Islamic Pattern Overlay - Inside Card Only */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          backgroundImage: `url('${patternImage}')`,
          backgroundSize: "520px",
          backgroundRepeat: "repeat",
          opacity: 0.05,
          mixBlendMode: "soft-light",
        }}
      />

      <div className="relative z-10 space-y-5">
        {/* <div className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-16 w-16 object-contain drop-shadow-lg" />
          <h2 className="text-3xl font-bold tracking-tight">Bisco Misr</h2>
        </div> */}

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground">
            {t("home:heroSection.greeting", { greeting, firstName })}
          </h1>

          <p className="mt-1 text-primary-foreground/80">
            {t("home:heroSection.description")}
          </p>

          <p className="mt-1 text-sm text-primary-foreground/60">
            {t("home:heroSection.meta")}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/$tenant/documents" params={{ tenant }}>
            <Button className="bg-accent text-primary-foreground/90 hover:bg-accent/90 font-semibold rounded-full px-6 gap-2">
              <Upload className="h-4 w-4" />{" "}
              {t("common:actions.uploadDocument")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
