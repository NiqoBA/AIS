import { AuroraNav } from "@/components/aurora";
import { ContactForm } from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="min-h-dvh bg-[#f4f7fa]">
      <AuroraNav />
      <main className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 pb-20 pt-24 sm:pt-28">
        <section id="contact" className="flex w-full flex-col items-center justify-center scroll-mt-28">
          <ContactForm />
        </section>
      </main>
    </div>
  );
}
