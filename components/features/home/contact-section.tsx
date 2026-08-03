"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please provide a valid email"),
  company: z.string().min(2, "Please share your company"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactSection() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  function onSubmit(values: ContactFormValues) {
    window.alert(`Thanks ${values.name}! A follow-up will be routed to ${values.email}.`);
  }

  return (
    <Section
      id="contact"
      title="Next step"
      description="This frontend is now prepared for richer product experiences without introducing backend work."
      className="mt-16 pb-8"
    >
      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              <span className="mb-2 block">Name</span>
              <input
                {...register("name")}
                className="w-full rounded-full border border-slate-300 px-4 py-3 text-sm"
                placeholder="Avery Morgan"
              />
              {errors.name ? <p className="mt-2 text-xs text-rose-600">{errors.name.message}</p> : null}
            </label>
            <label className="text-sm font-medium text-slate-700">
              <span className="mb-2 block">Email</span>
              <input
                {...register("email")}
                className="w-full rounded-full border border-slate-300 px-4 py-3 text-sm"
                placeholder="avery@company.com"
              />
              {errors.email ? <p className="mt-2 text-xs text-rose-600">{errors.email.message}</p> : null}
            </label>
          </div>
          <label className="text-sm font-medium text-slate-700">
            <span className="mb-2 block">Company</span>
            <input
              {...register("company")}
              className="w-full rounded-full border border-slate-300 px-4 py-3 text-sm"
              placeholder="Northstar Labs"
            />
            {errors.company ? <p className="mt-2 text-xs text-rose-600">{errors.company.message}</p> : null}
          </label>
          <Button type="submit">Request a product review</Button>
        </form>
      </Card>
    </Section>
  );
}
