import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Database, Upload, CheckCircle, XCircle, RefreshCcw } from "lucide-react";
import { getSoutheastAsiaCountries } from "@/data/southeast-asia";
import { seedCountriesToSupabase } from "@/services/countriesService";

const SeedCountries = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [results, setResults] = useState<{ success: number; errors: string[] } | null>(null);

  const countries = getSoutheastAsiaCountries();

  const handleSeed = async () => {
    if (!confirm(`سيتم نقل ${countries.length} دولة مع مدنها إلى Supabase. هل تريد المتابعة؟`)) return;

    setIsSeeding(true);
    setResults(null);

    try {
      const result = await seedCountriesToSupabase(countries);
      setResults(result);

      if (result.errors.length === 0) {
        toast.success(`تم نقل ${result.success} دول بنجاح! ✅`);
      } else {
        toast.warning(`نجح ${result.success} ، فشل ${result.errors.length}`);
      }
    } catch (err: any) {
      toast.error(`خطأ عام: ${err.message}`);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Database className="w-8 h-8 text-primary" />
          نقل بيانات الدول إلى Supabase
        </h1>
        <p className="text-gray-600 mt-2">
          انقل بيانات الدول والمدن المحلية (southeast-asia.ts) إلى قاعدة البيانات لإدارتها من لوحة التحكم
        </p>
      </div>

      {/* معاينة البيانات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {countries.map((country) => (
          <Card key={country.id} className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-lg">
              🌍
            </div>
            <div>
              <p className="font-bold text-gray-800">{country.nameAr}</p>
              <p className="text-sm text-gray-500">{country.cities.length} مدن</p>
            </div>
            <Badge variant="outline" className="mr-auto text-xs">
              {country.id}
            </Badge>
          </Card>
        ))}
      </div>

      {/* زر النقل */}
      <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <Database className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">جاهز لنقل البيانات؟</h2>
        <p className="text-gray-600 mb-6">
          سيتم نقل <strong>{countries.length} دول</strong> مع{" "}
          <strong>{countries.reduce((sum, c) => sum + c.cities.length, 0)} مدينة</strong> إلى Supabase.
          <br />
          <span className="text-sm text-blue-600 mt-1 block">
            ⚠️ إذا كانت البيانات موجودة مسبقاً، سيتم تحديثها (upsert)
          </span>
        </p>
        <Button
          size="lg"
          onClick={handleSeed}
          disabled={isSeeding}
          className="gap-2 text-lg px-8 py-6"
        >
          {isSeeding ? (
            <>
              <RefreshCcw className="w-5 h-5 animate-spin" />
              جاري النقل...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              ابدأ نقل البيانات
            </>
          )}
        </Button>
      </Card>

      {/* نتائج */}
      {results && (
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">نتائج العملية</h3>

          <div className="flex gap-4 mb-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-bold text-lg">{results.success}</span>
              <span>دولة تم نقلها بنجاح</span>
            </div>
            {results.errors.length > 0 && (
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="w-5 h-5" />
                <span className="font-bold text-lg">{results.errors.length}</span>
                <span>أخطاء</span>
              </div>
            )}
          </div>

          {results.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-1">
              {results.errors.map((err, i) => (
                <p key={i} className="text-red-700 text-sm">{err}</p>
              ))}
            </div>
          )}

          {results.success > 0 && results.errors.length === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-green-700 font-medium">
                ✅ تم نقل جميع البيانات بنجاح! يمكنك الآن إدارتها من{" "}
                <a href="/admin/southeast-asia-countries" className="underline text-primary">
                  إدارة الدول
                </a>
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default SeedCountries;
