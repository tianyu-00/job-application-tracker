import { useState } from "react";
import { fetchJob, saveApplication } from "../api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, PenLine, CheckCircle2 } from "lucide-react";

const emptyForm = {
  title: "",
  company: "",
  location: "",
  work_type: "",
  description: "",
  url: "",
  applied_at: new Date().toISOString().split("T")[0],
};

function FormField({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function Home() {
  const [mode, setMode] = useState("scrape");
  const [jobLink, setJobLink] = useState("");
  const [data, setData] = useState(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetch = () => {
    setSaved(false);
    setError(null);
    setLoading(true);
    fetchJob(jobLink)
      .then((res) =>
        setData({
          ...res.data.data,
          applied_at: new Date().toISOString().split("T")[0],
        }),
      )
      .catch((err) => setError("Failed to fetch job. Check the URL and try again."))
      .finally(() => setLoading(false));
  };

  const handleSave = () => {
    setSaved(false);
    saveApplication(data)
      .then(() => {
        setSaved(true);
        setError(null);
      })
      .catch((err) => setError("Failed to save application."));
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setData(newMode === "manual" ? emptyForm : null);
    setSaved(false);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Add Application</h1>
        <p className="text-sm text-muted-foreground mt-1">Scrape a job listing or add one manually.</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6 p-1 bg-muted rounded-lg w-fit">
        <Button
          size="sm"
          variant={mode === "scrape" ? "default" : "ghost"}
          onClick={() => handleModeSwitch("scrape")}
          className="gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Auto
        </Button>
        <Button
          size="sm"
          variant={mode === "manual" ? "default" : "ghost"}
          onClick={() => handleModeSwitch("manual")}
          className="gap-2"
        >
          <PenLine className="w-4 h-4" />
          Manual
        </Button>
      </div>

      {/* Scrape Input */}
      {mode === "scrape" && (
        <div className="flex gap-2 mb-6">
          <Input
            value={jobLink}
            onChange={(e) => setJobLink(e.target.value)}
            placeholder="Paste a job listing URL..."
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleFetch()}
          />
          <Button onClick={handleFetch} disabled={loading || !jobLink}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Fetch"}
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      {/* Form */}
      {data && (
        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{data.title || "New Application"}</CardTitle>
                <CardDescription className="mt-1">{data.company || "Unknown company"}</CardDescription>
              </div>
              {data.work_type && <Badge variant="secondary">{data.work_type}</Badge>}
            </div>
          </CardHeader>

          <CardContent className="flex flex-col gap-5">
            {mode === "manual" && (
              <FormField label="URL">
                <Input
                  value={data.url || ""}
                  onChange={(e) => setData({ ...data, url: e.target.value })}
                  placeholder="https://..."
                />
              </FormField>
            )}

            <div className="grid grid-cols-3 gap-4">
              <FormField label="Title">
                <Input value={data.title || ""} onChange={(e) => setData({ ...data, title: e.target.value })} />
              </FormField>

              <FormField label="Company">
                <Input value={data.company || ""} onChange={(e) => setData({ ...data, company: e.target.value })} />
              </FormField>

              <FormField label="Location">
                <Input value={data.location || ""} onChange={(e) => setData({ ...data, location: e.target.value })} />
              </FormField>

              <FormField label="Work Type">
                <Select value={data.work_type || ""} onValueChange={(val) => setData({ ...data, work_type: val })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unknown">Unknown</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="On-site">On-site</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Applied At">
                <Input
                  type="date"
                  value={data.applied_at || new Date().toISOString().split("T")[0]}
                  onChange={(e) => setData({ ...data, applied_at: e.target.value })}
                  className="w-full"
                />
              </FormField>
            </div>

            <FormField label="Description">
              <Textarea
                className="h-40 resize-none text-sm"
                value={data.description || ""}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                readOnly={mode === "scrape"}
              />
            </FormField>

            <div className="flex items-center gap-3 pt-2">
              <Button onClick={handleSave} className="w-full">
                Save Application
              </Button>
            </div>

            {saved && (
              <div className="flex items-center gap-2 text-sm text-green-500">
                <CheckCircle2 className="w-4 h-4" />
                Application saved successfully!
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Home;
