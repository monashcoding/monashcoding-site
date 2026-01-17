import Navigation from "@/components/Navigation";
import ClickSpark from "@/components/ClickSpark";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClickSpark
      sparkColor="#1a1a1a"
      sparkSize={10}
      sparkRadius={30}
      sparkCount={8}
      duration={400}
      easing="ease-out"
      extraScale={1.5}
    >
      <Navigation />
      {children}
    </ClickSpark>
  );
}
