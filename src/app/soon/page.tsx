import { AuroraNav } from "@/components/aurora";
import { ContactForm } from "@/components/ContactForm";

export default function SoonPage() {
  return (
    <div className="min-h-dvh bg-[#f4f7fa]">
      <AuroraNav />
      <main className="mx-auto flex w-full max-w-3xl flex-col items-center gap-16 px-6 pb-20 pt-24 sm:pt-28">
        <p className="w-full text-center text-[clamp(3rem,14vw,10rem)] font-black uppercase tracking-[0.2em] text-black">
          SOON
        </p>

        <section
          id="contact"
          className="flex w-full scroll-mt-28 flex-col items-center justify-center"
        >
          <ContactForm />
        </section>
      </main>
    </div>
  );
}
