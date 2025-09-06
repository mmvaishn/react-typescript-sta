export default function GlobalTemplate() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Global Template</h1>
        <p className="text-muted-foreground mt-2">
          Create and manage reusable document templates
        </p>
      </div>
      
      <div className="min-h-[400px] flex items-center justify-center bg-card rounded-lg border border-border">
        <p className="text-muted-foreground text-center">
          Global Template content will be implemented here
        </p>
      </div>
    </div>
  )
}