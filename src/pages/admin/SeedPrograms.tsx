import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Check, X, Database, Trash2 } from "lucide-react";
import { seedPrograms, programsData } from "@/scripts/seed-programs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminSeedPrograms = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [clearing, setClearing] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    setResults([]);
    try {
      const res = await seedPrograms();
      setResults(res);
      const success = res.filter(r => r.success).length;
      toast.success(`تم إضافة ${success} برنامج بنجاح من أصل ${res.length}`);
    } catch (error) {
      toast.error("حدث خطأ أثناء الإضافة");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (!confirm("هل أنت متأكد من حذف جميع البرامج؟")) return;
    setClearing(true);
    try {
      const { error } = await supabase.from("programs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      if (error) throw error;
      toast.success("تم حذف جميع البرامج");
      setResults([]);
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-6 h-6" />
            إضافة البرامج السياحية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            سيتم إضافة <strong>{programsData.length} برنامج</strong> سياحي معتمد من موقع ترافليون:
          </p>
          <ul className="space-y-1 text-sm">
            {programsData.map((p, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-muted-foreground">{i + 1}.</span>
                <span className="font-medium">{p.name_ar}</span>
                <span className="text-xs text-muted-foreground">({p.duration_days} أيام - {p.countries.join("، ")})</span>
              </li>
            ))}
          </ul>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSeed} disabled={loading} className="flex-1">
              {loading ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Database className="w-4 h-4 ml-2" />}
              إضافة البرامج
            </Button>
            <Button variant="destructive" onClick={handleClear} disabled={clearing}>
              {clearing ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Trash2 className="w-4 h-4 ml-2" />}
              حذف الكل
            </Button>
          </div>

          {results.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="font-bold">النتائج:</h3>
              {results.map((r, i) => (
                <div key={i} className={`flex items-center gap-2 p-2 rounded ${r.success ? 'bg-green-50' : 'bg-red-50'}`}>
                  {r.success ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-red-600" />}
                  <span className="text-sm">{r.name}</span>
                  {r.error && <span className="text-xs text-red-500 mr-auto">{r.error}</span>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSeedPrograms;
