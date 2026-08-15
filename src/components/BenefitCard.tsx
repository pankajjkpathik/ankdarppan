import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface BenefitCardProps {
  title: string;
  desc: string;
  icon: ReactNode;
}

export const BenefitCard = ({ title, desc, icon }: BenefitCardProps) => (
  <Card className="border-stone-200 bg-white hover:border-primary/50 transition-colors shadow-sm overflow-hidden">
    <CardContent className="p-5 md:pt-8 md:text-center flex md:flex-col items-center md:items-center gap-4 md:gap-0">
      <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 md:mb-6 rounded-xl md:rounded-2xl bg-primary/10 shrink-0">
        {icon}
      </div>
      <div className="text-left md:text-center">
        <h3 className="text-lg md:text-xl font-heading mb-1 md:mb-3 text-stone-900 font-bold leading-tight">{title}</h3>
        <p className="text-stone-950 font-semibold text-sm md:text-base leading-snug">{desc}</p>
      </div>
    </CardContent>
  </Card>
);
