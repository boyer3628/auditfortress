"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { custodialAuditSchema, type CustodialAuditFormData } from "@/lib/validations/custodialAudit";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SignaturePad } from "@/components/SignaturePad";
import { cn } from "@/lib/utils";

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
  "Break / kitchenette",
  "Cafeteria",
  "Coffee stations",
  "Cold Rooms",
  "Conference Rooms",
  "Copy / fax areas",
  "Elevators",
  "Fitness rooms / center",
  "GAP space",
  "Grey space",
  "Hallway / corridor",
  "Janitor closets",
  "Labs",
  "LAR",
  "Loading docks",
  "Lobby / atriums",
  "Mail and copy centers",
  "Manufacturing",
  "Office",
  "Penthouse Mez",
  "Restroom",
  "Shops",
  "Stockroom",
  "Warehouse",
  "Other",
  // Garage section
  "Stairwell",
  "Handrails",
  "Elevator",
  "Glass",
  "Trash",
  "Litter"
] as const;

// Define the rating scale
const ratingScale = [
  { value: 1, label: "Corrective action required and sent to appropriate program managers" },
  { value: 2, label: "Numerous / visible issues" },
  { value: 3, label: "Minor visible issues" },
  { value: 4, label: "No visible issue" },
  { value: 0, label: "N/A" }
] as const;

export default function CustodialAudit() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<CustodialAuditFormData>({
    resolver: zodResolver(custodialAuditSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      location: "",
      inspectionResults: Object.fromEntries(
        inspectionAreas.map(area => [area, null])
      ) as Record<typeof inspectionAreas[number], number | null>,
      comments: "",
      observations: "",
      recommendations: "",
      signature: null,
    }
  });

  const formData = watch();

  const onSubmit = async (data: CustodialAuditFormData) => {
    try {
      console.log("Form data:", data);
      toast.success("Audit submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit audit");
      console.error(error);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-white border-b z-50">
        <div className="max-w-4xl mx-auto px-8">
          <ProgressIndicator 
            sections={formSections}
            formData={formData}
            validationSchema={custodialAuditSchema}
          />
        </div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="p-8 pt-20">
        <main className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-center">Custodial Audit</h1>

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
              <div className="space-y-4">
                {inspectionAreas.map((area) => (
                  <div key={area} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">{area}</label>
                      <div className="flex gap-2">
                        {[
                          { value: 1, color: "bg-red-500 hover:bg-red-600" },
                          { value: 2, color: "bg-orange-500 hover:bg-orange-600" },
                          { value: 3, color: "bg-yellow-500 hover:bg-yellow-600" },
                          { value: 4, color: "bg-[#39B54A] hover:bg-[#39B54A]/90" },
                          { value: 0, color: "bg-gray-500 hover:bg-gray-600" },
                        ].map(({ value, color }) => (
                          <Button
                            key={value}
                            type="button"
                            variant={formData.inspectionResults[area] === value ? "default" : "outline"}
                            className={cn(
                              "w-10 h-10 p-0",
                              formData.inspectionResults[area] === value && color
                            )}
                            onClick={() => setValue(`inspectionResults.${area}` as const, value)}
                          >
                            {value}
                          </Button>
                        ))}
                      </div>
                    </div>
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
