import LangingPageBenefits from "@/modules/client/home/components/benefits";
import LangingPageCTA from "@/modules/client/home/components/cta";
import LangingPageFeatures from "@/modules/client/home/components/features";
import LandingPageHero from "@/modules/client/home/components/hero";
import LangingPageHowItWorks from "@/modules/client/home/components/how-it-work";
import LandingPageIntegrations from "@/modules/client/home/components/integrations";
import LandingPageTestimonials from "@/modules/client/home/components/testimonials";
import { getServerSession } from "@/modules/server/auth/get-session";

export default async function Home() {
  const session = await getServerSession();

  return (
    <>
      <LandingPageHero session={session} />
      <LangingPageFeatures />
      <LangingPageHowItWorks />
      <LangingPageBenefits />
      <LandingPageIntegrations />
      <LandingPageTestimonials />
      <LangingPageCTA session={session} />
    </>
  );
}
