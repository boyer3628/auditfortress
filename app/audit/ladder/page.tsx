"use client";

import { useState, useEffect } from "react"; // Add useEffect to the import
import { useForm } from "react-hook-form"; // Add this import
import { zodResolver } from "@hookform/resolvers/zod"; // Add this import
import { ladderAuditSchema, type LadderAuditFormData } from "@/lib/validations/ladderAudit";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { CameraCapture } from "@/components/CameraCapture";
import { SignaturePad } from "@/components/SignaturePad";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

// Define types for our form data
interface FormData {
  // Auditor Details
  name: string;
  email: string;
  location: string;

  // Ladder Information
  ladderLocation: string;
  referenceNumber: string;
  type: string | null;
  length: string;
  construction: string | null;
  class: string | null;

  // Inspection Results
  inspectionResults: typeof initialInspectionResults;
  otherDefects: string;
  defectPhoto: string | null;
  overallCondition: string | null;
  observations: string;
  recommendations: string;
  signature: string | null;
}

// Define initial inspection results with null values (no selection)
const initialInspectionResults = {
  freeDents: null as boolean | null,
  feetPads: null as boolean | null,
  rungLocks: null as boolean | null,
  sideRails: null as boolean | null,
  boltsRivets: null as boolean | null,
  rope: null as boolean | null,
  steps: null as boolean | null,
  storage: null as boolean | null,
} as const;

// Define inspection items
const inspectionItems = [
  {
    id: 'freeDents' as keyof typeof initialInspectionResults,
    question: '1. Free from dents, cracks and damages',
    reference: '/images/ladder.png'
  },
  {
    id: 'feetPads' as keyof typeof initialInspectionResults,
    question: '2. Feet of ladder work properly and have slip-resistant pads',
    reference: null
  },
  {
    id: 'rungLocks' as keyof typeof initialInspectionResults,
    question: '3. Rung locks and spreader braces are working',
    reference: null
  },
  {
    id: 'sideRails' as keyof typeof initialInspectionResults,
    question: '4. Side rails have no signs of deterioration, dents and rusts',
    reference: null
  },
  {
    id: 'boltsRivets' as keyof typeof initialInspectionResults,
    question: '5. Bolts and rivets are secured',
    reference: null
  },
  {
    id: 'rope' as keyof typeof initialInspectionResults,
    question: '6. Rope is undamaged',
    reference: null
  },
  {
    id: 'steps' as keyof typeof initialInspectionResults,
    question: '7. Steps and rungs are free from oil, grease and other materials',
    reference: null
  },
  {
    id: 'storage' as keyof typeof initialInspectionResults,
    question: '8. Ladder stored properly (when not in use)',
    reference: null
  }
] as const;

// Define form sections for progress tracking
const formSections = [
  {
    id: "auditor",
    title: "Auditor Details",
    fields: ["name", "email", "location"]
  },
  {
    id: "equipment",
    title: "Ladder Information",
    fields: [
      "ladderLocation",
      "referenceNumber",
      "type",
      "length",
      "construction",
      "class"
    ]
  },
  {
    id: "inspection",
    title: "Ladder Inspection",
    fields: [
      "inspectionResults",
      "otherDefects",
      "defectPhoto",
      "overallCondition"
    ]
  },
  {
    id: "completion",
    title: "Complete Audit",
    fields: [
      "recommendations",
      "signature"
    ]
  }
];

export default function LadderAudit() {
  const pathname = usePathname();
  // Add form handling setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset
  } = useForm<LadderAuditFormData>({
    resolver: zodResolver(ladderAuditSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      location: "",
      auditDate: new Date(),
      ladderLocation: "",
      referenceNumber: "",
      type: "",  // Change from null to empty string
      length: "",
      construction: "", // Change from null to empty string
      class: "", // Change from null to empty string
      inspectionResults: initialInspectionResults,
      otherDefects: "",
      defectPhoto: "", // Change from null to empty string
      overallCondition: null, // Changed from "pass" to null
      observations: "",
      recommendations: "",
      signature: "", // Change from null to empty string
    }
  });

  const formData = watch();

  // Reset form when pathname changes
  useEffect(() => {
    reset({
      name: "",
      email: "",
      location: "",
      auditDate: new Date(),
      ladderLocation: "",
      referenceNumber: "",
      type: "",
      length: "",
      construction: "",
      class: "",
      inspectionResults: initialInspectionResults,
      otherDefects: "",
      defectPhoto: "",
      overallCondition: null, // Changed from "pass" to null
      observations: "",
      recommendations: "",
      signature: "",
    });
  }, [pathname, reset]);

  // Add onSubmit handler
  const onSubmit = async (data: LadderAuditFormData) => {
    try {
      // TODO: Submit to your API
      console.log("Form data:", data);
      toast.success("Audit submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit audit");
      console.error(error);
    }
  };

  return (
    <>
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b z-50">
        <div className="max-w-4xl mx-auto px-8">
          <ProgressIndicator 
            sections={formSections}
            formData={formData}
            validationSchema={ladderAuditSchema}
          />
        </div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="p-8 pt-20">
        <main className="max-w-4xl mx-auto space-y-8">
          {/* Title */}
          <h1 className="text-3xl font-bold text-center">Monthly Ladder Audit</h1>

          {/* Auditor Details Section */}
          <section className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Auditor Details</h2>
            <p className="text-sm text-muted-foreground mb-4">Information about you</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  placeholder="Enter your name here"
                  value={formData.name}
                  onChange={(e) => setValue("name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="Enter your email address here"
                  value={formData.email}
                  onChange={(e) => setValue("email", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  placeholder="Enter your site here"
                  value={formData.location}
                  onChange={(e) => setValue("location", e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Ladder Information */}
          <section className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Ladder Information</h2>
            <p className="text-sm text-muted-foreground mb-4">Information about Ladder</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Location of Ladder</label>
                <Input
                  placeholder="Location"
                  value={formData.ladderLocation}
                  onChange={(e) => setValue("ladderLocation", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Reference No. of Ladder</label>
                <Input
                  placeholder="Reference #"
                  value={formData.referenceNumber}
                  onChange={(e) => setValue("referenceNumber", e.target.value)}
                />
              </div>

              {/* Type of Ladder */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Type of Ladder</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Portable', value: 'portable' },
                    { label: 'Self-Supporting', value: 'self-supporting' },
                    { label: 'Non Self-Supporting', value: 'non-self-supporting' },
                    { label: 'Other', value: 'other' }
                  ].map((type) => (
                    <Button
                      key={type.value}
                      type="button"
                      variant={formData.type === type.value ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setValue("type", type.value)}
                    >
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Length */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Length</label>
                <Input
                  placeholder="Length"
                  value={formData.length}
                  onChange={(e) => setValue("length", e.target.value)}
                />
              </div>

              {/* Construction of Ladder */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Construction of Ladder</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Wood', value: 'wood' },
                    { label: 'Metal', value: 'metal' },
                    { label: 'Fiberglass', value: 'fiberglass' },
                    { label: 'Aluminum', value: 'aluminum' }
                  ].map((material) => (
                    <Button
                      key={material.value}
                      type="button"
                      variant={formData.construction === material.value ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setValue("construction", material.value)}
                    >
                      {material.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Class */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Class</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Type IAA', value: 'iaa' },
                    { label: 'Type IA', value: 'ia' },
                    { label: 'Type I', value: 'i' },
                    { label: 'Type II', value: 'ii' },
                    { label: 'Type III', value: 'iii' },
                    { label: 'Other', value: 'other' }
                  ].map((class_) => (
                    <Button
                      key={class_.value}
                      type="button"
                      variant={formData.class === class_.value ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setValue("class", class_.value)}
                    >
                      {class_.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Ladder Inspection */}
          <section className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Ladder Inspection</h2>
            <p className="text-sm text-muted-foreground mb-4">Information about Ladder</p>
            <div className="space-y-6">
              {inspectionItems.map((item) => (
                <div key={item.id} className="space-y-2">
                  <p className="text-sm font-medium">{item.question}</p>
                  {item.reference && (
                    <div className="mb-2">
                      <p className="text-sm font-medium mb-2">REFERENCE: {item.question.split('.')[1].trim()}</p>
                      <div className="relative h-48 w-full rounded-lg overflow-hidden">
                        <Image
                          src={item.reference}
                          alt={`Reference for ${item.question}`}
                          fill
                          className="object-contain"
                          priority
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant={formData.inspectionResults[item.id] === true ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setValue(`inspectionResults.${item.id}` as const, true)}
                    >
                      Yes
                    </Button>
                    <Button
                      type="button"
                      variant={formData.inspectionResults[item.id] === false ? "destructive" : "outline"}
                      className="flex-1"
                      onClick={() => setValue(`inspectionResults.${item.id}` as const, false)}
                    >
                      No
                    </Button>
                    <Button
                      type="button"
                      variant={formData.inspectionResults[item.id] === null ? "outline" : "outline"} // Changed from default to outline
                      className="flex-1"
                      onClick={() => setValue(`inspectionResults.${item.id}` as const, null)}
                    >
                      N/A
                    </Button>
                  </div>
                </div>
              ))}

              {/* Other Defects */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Other Defects Observed?</label>
                <Textarea
                  placeholder="Enter any other defects here"
                  value={formData.otherDefects}
                  onChange={(e) => setValue("otherDefects", e.target.value)}
                />
              </div>

              {/* Photo of defects */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Take a photo of other defects (optional)</p>
                <div className="relative">
                  {formData.defectPhoto ? (
                    <div className="space-y-2">
                      <div className="relative">
                        <img 
                          src={formData.defectPhoto} 
                          alt="Captured defect"
                          className="rounded-lg w-full h-[300px] object-contain bg-gray-50"
                        />
                        <Button 
                          onClick={() => setValue("defectPhoto", "")} // Change null to empty string
                          variant="outline"
                          className="mt-2"
                        >
                          Retake Photo
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <CameraCapture
                      onCapture={(imageData) => setValue("defectPhoto", imageData)}
                    />
                  )}
                </div>
              </div>

              {/* Overall condition */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Overall condition of ladder</label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={formData.overallCondition === "pass" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setValue("overallCondition", "pass")}
                  >
                    Pass
                  </Button>
                  <Button
                    type="button"
                    variant={formData.overallCondition === "fail" ? "destructive" : "outline"}
                    className="flex-1"
                    onClick={() => setValue("overallCondition", "fail")}
                  >
                    Fail
                  </Button>
                </div>
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
                  placeholder="Enter your observations here"
                  value={formData.observations}
                  onChange={(e) => setValue("observations", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">State recommendations about the inspections here</label>
                <Textarea
                  placeholder="Enter your recommendations here"
                  value={formData.recommendations}
                  onChange={(e) => setValue("recommendations", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Name and Signature of Inspector</label>
                <SignaturePad
                  onSave={(signatureData) => setValue("signature", signatureData)}
                />
              </div>

              <Button className="w-full" size="lg">
                Submit Audit
              </Button>
            </div>
          </section>
        </main>
      </form>
    </>
  );
}
