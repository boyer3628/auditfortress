// ... other imports

export default function Home() {
  return (
    <div className="p-8">
      <main className="max-w-4xl mx-auto flex flex-col gap-8">
        {/* ... other code ... */}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AuditButton 
            type="fire"
            label="Fire Extinguisher"
            subtitle="Inspect a Fire Extinguisher"
            href="/audit/fire"
            imagePath="/images/fire-audit.png"  // Update path
          />
          <AuditButton 
            type="ladder"
            label="Ladder"
            subtitle="Inspect a Ladder"
            href="/audit/ladder"
            imagePath="/images/ladder-audit.png"  // Update path
          />
          <AuditButton 
            type="custodial"
            label="Custodial"
            subtitle="Inspect a Location"
            href="/audit/custodial"
            imagePath="/images/custodial-audit.png"  // Update path
          />
          <AuditButton 
            type="landscaping"
            label="Landscaping"
            subtitle="Inspect a Location"
            href="/audit/landscaping"
            imagePath="/images/landscaping-audit.png"  // Update path
          />
        </div>
        
        {/* ... other code ... */}
      </main>
    </div>
  );
}