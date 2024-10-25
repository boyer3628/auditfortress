"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { landscapingAuditSchema, type LandscapingAuditFormData } from "@/lib/validations/landscapingAudit";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SignaturePad } from "@/components/SignaturePad";
import { cn } from "@/lib/utils";
import { RatingSlider } from "@/components/RatingSlider";
import { useRouter, usePathname } from "next/navigation";
import { insertAudit, DatabaseError, ValidationError, testSupabaseConnection } from "@/lib/db";
import { withRetry } from "@/lib/utils";

// Define form sections for progress tracking
const formSections = [
  {
    id: "auditor",
    title: "Auditor Details",
    fields: ["name", "email", "location"]
  },
  {
    id: "inspection",
    title: "Areas of Inspection",
    fields: [
      "inspectionResults",
      "comments"
    ]
  },
  {
    id: "completion",
    title: "Complete Audit",
    fields: [
      "observations",
      "recommendations",
      "signature"
    ]
  }
];

// Define the areas to inspect
const inspectionAreas = [
  "Hedges have been properly trimmed",
  "The grass has cut to the appropriate height",
  "The sidewalks & curbs are properly edged",
  "The grass around the light poles is cut",
  "The grass around the signs is cut",
  "The grass around the trees is cut",
  "The grass around the fire hydrants is cut",
  "The irrigation are scheduled at the appropriate times",
  "The sprinklers are correctly aligned",
  "Mulch needs have been properly filled",
  "Mulch has been removed from the grass",
  "There is proper distance between the mulch & the grass",
  "There is proper clearance between the mulch & surrounding buildings",
  "Dead trees are removed correctly",
  "All trees have been correctly pruned",
  "All dead trees have been removed",
  "All dead limbs have been removed",
  "All dead shrubs have been removed",
  "All dead flowers have been removed",
  "All dead grass has been removed",
  "All weeds have been removed",
  "All trash has been removed",
  "All debris has been removed",
  "All tools have been properly stored",
  "All equipment has been properly stored",
  "All materials have been properly stored",
  "All chemicals have been properly stored",
  "All containers have been properly stored",
  "All trash cans have been properly stored",
  "All tools have been properly cleaned",
  "All equipment has been properly cleaned",
  "All materials have been properly cleaned",
  "All chemicals have been properly stored & sealed",
  "All containers have been properly cleaned",
  "All trash cans have been properly cleaned",
  "Debris disposal completed", // Changed from duplicate "All debris has been properly disposed"
] as const;

export default function LandscapingAudit() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Test connection on component mount
  useEffect(() => {
    testSupabaseConnection().then(isConnected => {
      if (isConnected) {
        console.log('Connected to Supabase');
      } else {
        console.error('Failed to connect to Supabase');
      }
    });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset
  } = useForm<LandscapingAuditFormData>({
    resolver: zodResolver(landscapingAuditSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      location: "",
      auditDate: new Date(),
      inspectionResults: Object.fromEntries(
        inspectionAreas.map(area => [area, null])
      ) as Record<typeof inspectionAreas[number], number | null>,
      comments: "",
      observations: "",
      recommendations: "",
      signature: "",
    }
  });

  // Reset form when pathname changes
  useEffect(() => {
    reset({
      name: "",
      email: "",
      location: "",
      auditDate: new Date(),
      inspectionResults: Object.fromEntries(
        inspectionAreas.map(area => [area, null])
      ) as Record<typeof inspectionAreas[number], number | null>,
      comments: "",
      observations: "",
      recommendations: "",
      signature: "",
    });
  }, [pathname, reset]);

  const formData = watch();

  const onSubmit = async (data: LandscapingAuditFormData) => {
    try {
      console.log('Starting submission with data:', data);
      
      const auditId = await insertAudit('landscaping', {
        ...data,
        auditDate: new Date(),
      });
      
      console.log('Audit submitted successfully with ID:', auditId);
      toast.success("Audit submitted successfully!");
      
      // Reset form after successful submission
      reset({
        name: "",
        email: "",
        location: "",
        auditDate: new Date(),
        inspectionResults: Object.fromEntries(
          inspectionAreas.map(area => [area, null])
        ) as Record<typeof inspectionAreas[number], number | null>,
        comments: "",
        observations: "",
        recommendations: "",
        signature: "",
      });

      router.push('/');
      
    } catch (error) {
      console.error('Submission error:', error);
      if (error instanceof ValidationError) {
        toast.error(`Validation error: ${error.message}`);
      } else if (error instanceof DatabaseError) {
        toast.error(`Database error: ${error.message}`);
      } else {
        toast.error("Failed to submit audit. Please try again.");
        console.error('Detailed error:', error);
      }
    }
  };

  return (
    <>
      <div key={pathname} className="fixed top-0 left-0 right-0 bg-white border-b z-50">
        <div className="max-w-4xl mx-auto px-8">
          <ProgressIndicator 
            sections={formSections}
            formData={formData}
            validationSchema={landscapingAuditSchema}
          />
        </div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="p-8 pt-20">
        <main className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-center">Landscaping Audit</h1>

          {/* Auditor Details Section */}
          <section className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Auditor Details</h2>
            <p className="text-sm text-muted-foreground mb-4">Information about you</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  {...register("name")}
                  placeholder="Enter your name here"
                  className={cn(errors.name && "border-red-500")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="Enter your email address here"
                  className={cn(errors.email && "border-red-500")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  {...register("location")}
                  placeholder="Enter your site here"
                  className={cn(errors.location && "border-red-500")}
                />
                {errors.location && (
                  <p className="text-sm text-red-500">{errors.location.message}</p>
                )}
              </div>
            </div>
          </section>

          {/* Areas of Inspection */}
          <section className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Areas of Inspection</h2>
            <div className="space-y-6">
              {/* Rating Scale Legend */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Key - Average audit score</h3>
                <div className="space-y-2">
                  <div className="text-sm"><span className="font-medium">1 -</span> Actions Required</div>
                  <div className="text-sm"><span className="font-medium">2 -</span> Numerous visible issues</div>
                  <div className="text-sm"><span className="font-medium">3 -</span> Minor visible issues</div>
                  <div className="text-sm"><span className="font-medium">4 -</span> No visible issue</div>
                  <div className="text-sm"><span className="font-medium">0 -</span> N/A</div>
                </div>
              </div>

              {/* Inspection Areas */}
              <div className="space-y-10">
                {inspectionAreas.map((area) => (
                  <div key={area} className="flex items-center gap-8">
                    <label className="text-sm font-medium w-[300px]">{area}</label>
                    <RatingSlider
                      value={formData.inspectionResults[area]}
                      onChange={(value) => setValue(`inspectionResults.${area}` as const, value)}
                    />
                  </div>
                ))}
              </div>

              {/* Comments */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Comments</label>
                <Textarea
                  {...register("comments")}
                  placeholder="Enter any comments here"
                  className={cn(errors.comments && "border-red-500")}
                />
                {errors.comments && (
                  <p className="text-sm text-red-500">{errors.comments.message}</p>
                )}
              </div>
            </div>
          </section>

          {/* Complete Audit Section */}
          <section className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Complete Audit</h2>
            <p className="text-sm text-muted-foreground mb-4">Information about you</p>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Write down observations</label>
                <Textarea
                  {...register("observations")}
                  placeholder="Enter your observations here"
                  className={cn(errors.observations && "border-red-500")}
                />
                {errors.observations && (
                  <p className="text-sm text-red-500">{errors.observations.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">State recommendations about the inspections here</label>
                <Textarea
                  {...register("recommendations")}
                  placeholder="Enter your recommendations here"
                  className={cn(errors.recommendations && "border-red-500")}
                />
                {errors.recommendations && (
                  <p className="text-sm text-red-500">{errors.recommendations.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Name and Signature of Inspector</label>
                <SignaturePad
                  onSave={(signatureData) => setValue("signature", signatureData)}
                />
                {errors.signature && (
                  <p className="text-sm text-red-500">{errors.signature.message}</p>
                )}
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isSubmitting || Object.keys(errors).length > 0}
          >
            {isSubmitting ? "Submitting..." : "Submit Audit"}
          </Button>
        </main>
      </form>
    </>
  );
}
