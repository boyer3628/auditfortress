"use client";

import { useState, useEffect } from "react"; // Add useEffect to the import
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fireAuditSchema, type FireAuditFormData } from "@/lib/validations/fireAudit";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { CameraCapture } from "@/components/CameraCapture";
import { SignaturePad } from "@/components/SignaturePad";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define form sections for progress tracking
const formSections = [
  {
    id: "auditor",
    title: "Auditor Details",
    fields: ["name", "email", "location"]
  },
  {
    id: "equipment",
    title: "Fire Extinguisher Information",
    fields: [
      "extinguisherLocation",
      "serialNumber",
      "manufactureDate",
      "expiryDate",
      "type",
      "size",
      "rating"
    ]
  },
  {
    id: "inspection",
    title: "Fire Extinguisher Inspection",
    fields: [
      "inspectionResults",
      "maintenanceTagPhoto",
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

// Define initial inspection results
const initialInspectionResults = {
  maintenanceTag: null as boolean | null,
  mounting: null as boolean | null,
  safetyPin: null as boolean | null,
  label: null as boolean | null,
  handle: null as boolean | null,
  pressureGauge: null as boolean | null,
  nozzle: null as boolean | null,
  invertTest: null as boolean | null,
  location: null as boolean | null,
  cleaned: null as boolean | null,
  tagSigned: null as boolean | null,
} as const;

// Define the inspection item type
type InspectionItem = {
  id: keyof typeof initialInspectionResults;
  question: string;
  reference: string | null;
};

// Update the inspection items array
const inspectionItems: InspectionItem[] = [
  {
    id: 'maintenanceTag',
    question: '1. Has a valid maintenance tag',
    reference: null
  },
  {
    id: 'mounting',
    question: '2. Mounted in an easily accessible place, no debris or material stacked in front of it.',
    reference: null
  },
  {
    id: 'safetyPin',
    question: '3. Safety pin is in place and intact. Nothing else should be used in place of the pin.',
    reference: '/images/fire_ext.png'
  },
  {
    id: 'label',
    question: '4. Label is clear and extinguisher type and instructions can be read easily.',
    reference: null
  },
  {
    id: 'handle',
    question: '5. Handle is intact and not bent or broken.',
    reference: null
  },
  {
    id: 'pressureGauge',
    question: '6. Pressure gauge is in the green and is not damaged or showing "recharge"',
    reference: null
  },
  {
    id: 'nozzle',
    question: '7. Discharge hoses/nozzle is in good shape and not clogged, cracked, or broken',
    reference: null
  },
  {
    id: 'invertTest',
    question: '8. Extinguisher was turned upside down at least three times to make sure it is full.',
    reference: null
  },
  {
    id: 'location',
    question: '9. Location of extinguisher is easily identifiable by signs',
    reference: null
  },
  {
    id: 'cleaned',
    question: '10. Dust and wipe down the extinguisher',
    reference: null
  },
  {
    id: 'tagSigned',
    question: '11. Annual maintenance tag is signed and dated',
    reference: null
  }
];

export default function FireExtinguisherAudit() {
  const pathname = usePathname();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset
  } = useForm<FireAuditFormData>({
    resolver: zodResolver(fireAuditSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      location: "",
      auditDate: new Date(),
      extinguisherLocation: "",
      serialNumber: "",
      manufactureDate: { month: "", year: "" },
      expiryDate: { month: "", year: "" },
      type: null,
      size: "",
      rating: null,
      inspectionResults: {
        maintenanceTag: null,
        mounting: null,
        safetyPin: null,
        label: null,
        handle: null,
        pressureGauge: null,
        nozzle: null,
        invertTest: null,
        location: null,
        cleaned: null,
        tagSigned: null,
      },
      maintenanceTagPhoto: null,
      overallCondition: null,
      observations: "",
      recommendations: "",
      signature: null,
    }
  });

  // Reset form when pathname changes
  useEffect(() => {
    reset({
      name: "",
      email: "",
      location: "",
      auditDate: new Date(),
      extinguisherLocation: "",
      serialNumber: "",
      manufactureDate: { month: "", year: "" },
      expiryDate: { month: "", year: "" },
      type: null,
      size: "",
      rating: null,
      inspectionResults: {
        maintenanceTag: null,
        mounting: null,
        safetyPin: null,
        label: null,
        handle: null,
        pressureGauge: null,
        nozzle: null,
        invertTest: null,
        location: null,
        cleaned: null,
        tagSigned: null,
      },
      maintenanceTagPhoto: null,
      overallCondition: null,
      observations: "",
      recommendations: "",
      signature: null,
    });
  }, [pathname, reset]);

  const formData = watch();

  const onSubmit = async (data: FireAuditFormData) => {
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
            validationSchema={fireAuditSchema}
          />
        </div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="p-8 pt-20">
        <main className="max-w-4xl mx-auto space-y-8">
          {/* Title - removed duplicate logo */}
          <h1 className="text-3xl font-bold text-center">Monthly Fire Extinguisher Audit</h1>

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

          {/* Fire Extinguisher Information */}
          <section className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Fire Extinguisher Information</h2>
            <p className="text-sm text-muted-foreground mb-4">Information about Fire Extinguisher</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Location of Extinguisher</label>
                <Input
                  {...register("extinguisherLocation")}
                  placeholder="Location"
                  className={cn(errors.extinguisherLocation && "border-red-500")}
                />
                {errors.extinguisherLocation && (
                  <p className="text-sm text-red-500">{errors.extinguisherLocation.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Serial No. of Extinguisher</label>
                <Input
                  {...register("serialNumber")}
                  placeholder="SNR"
                  className={cn(errors.serialNumber && "border-red-500")}
                />
                {errors.serialNumber && (
                  <p className="text-sm text-red-500">{errors.serialNumber.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Manufacture Date</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      onValueChange={(value) => setValue("manufactureDate.month", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)}>
                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      {...register("manufactureDate.year")}
                      placeholder="Year"
                      className={cn(errors.manufactureDate?.year && "border-red-500")}
                    />
                  </div>
                  {errors.manufactureDate?.year && (
                    <p className="text-sm text-red-500">{errors.manufactureDate.year.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Expiry Date</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      onValueChange={(value) => setValue("expiryDate.month", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)}>
                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      {...register("expiryDate.year")}
                      placeholder="Year"
                      className={cn(errors.expiryDate?.year && "border-red-500")}
                    />
                  </div>
                  {errors.expiryDate?.year && (
                    <p className="text-sm text-red-500">{errors.expiryDate.year.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type of Fire Extinguisher</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Water', value: 'water' },
                    { label: 'Foam', value: 'foam' },
                    { label: 'Dry Powder', value: 'dry-powder' },
                    { label: 'CO2', value: 'co2' },
                    { label: 'Wet Chemical', value: 'wet-chemical' }
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
                {errors.type && (
                  <p className="text-sm text-red-500">{errors.type.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Size (LB)</label>
                <Input
                  {...register("size")}
                  placeholder="Size"
                  className={cn(errors.size && "border-red-500")}
                />
                {errors.size && (
                  <p className="text-sm text-red-500">{errors.size.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Rating</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'ABC', value: 'abc' },
                    { label: 'BC', value: 'bc' },
                    { label: 'A', value: 'a' },
                    { label: 'D', value: 'd' },
                    { label: 'K', value: 'k' }
                  ].map((rating) => (
                    <Button
                      key={rating.value}
                      type="button"
                      variant={formData.rating === rating.value ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setValue("rating", rating.value)}
                    >
                      {rating.label}
                    </Button>
                  ))}
                </div>
                {errors.rating && (
                  <p className="text-sm text-red-500">{errors.rating.message}</p>
                )}
              </div>
            </div>
          </section>

          {/* Fire Extinguisher Inspection */}
          <section className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Fire Extinguisher Inspection</h2>
            <p className="text-sm text-muted-foreground mb-4">Information about Fire Extinguisher</p>
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
                      Compliant
                    </Button>
                    <Button
                      type="button"
                      variant={formData.inspectionResults[item.id] === false ? "destructive" : "outline"}
                      className="flex-1"
                      onClick={() => setValue(`inspectionResults.${item.id}` as const, false)}
                    >
                      Non-Compliant
                    </Button>
                  </div>
                </div>
              ))}

              {/* Photo requirement */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Take a photo of the annual maintenance tag</p>
                <div className="relative">
                  {formData.maintenanceTagPhoto ? (
                    <div className="space-y-2">
                      <div className="relative">
                        <img 
                          src={formData.maintenanceTagPhoto} 
                          alt="Captured maintenance tag"
                          className="rounded-lg w-full h-[300px] object-contain bg-gray-50"
                        />
                        <Button 
                          onClick={() => setValue("maintenanceTagPhoto", null)}
                          variant="outline"
                          className="mt-2"
                        >
                          Retake Photo
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Image
                        src="/images/tag.png"
                        alt="Maintenance tag reference"
                        width={200}
                        height={200}
                        className="mb-4"
                        priority
                      />
                      <CameraCapture
                        onCapture={(imageData) => setValue("maintenanceTagPhoto", imageData)}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Overall condition */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Overall condition of fire extinguisher</label>
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
