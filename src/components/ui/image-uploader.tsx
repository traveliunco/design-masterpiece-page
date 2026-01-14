import { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  onUpload: (file: File) => Promise<string | null>;
  onDelete?: (url: string) => Promise<boolean>;
  uploading?: boolean;
  className?: string;
  aspectRatio?: "square" | "video" | "wide";
  label?: string;
}

export const ImageUploader = ({
  value,
  onChange,
  onUpload,
  onDelete,
  uploading = false,
  className,
  aspectRatio = "video",
  label = "رفع صورة",
}: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [dragActive, setDragActive] = useState(false);

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[16/9]",
  };

  const handleFileChange = async (file: File | null) => {
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    const url = await onUpload(file);
    if (url) {
      onChange(url);
    } else {
      // Reset preview if upload failed
      setPreview(value || null);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = async () => {
    if (!value) return;

    if (onDelete) {
      const success = await onDelete(value);
      if (success) {
        setPreview(null);
        onChange("");
      }
    } else {
      setPreview(null);
      onChange("");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}

      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg overflow-hidden transition-all",
          aspectRatioClasses[aspectRatio],
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50",
          uploading && "opacity-50 pointer-events-none"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {preview ? (
          // Image Preview
          <>
            <img
              src={preview}
              alt="معاينة"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleClick}
                disabled={uploading}
              >
                <Upload className="w-4 h-4 ml-2" />
                تغيير
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={uploading}
              >
                <X className="w-4 h-4 ml-2" />
                حذف
              </Button>
            </div>
          </>
        ) : (
          // Upload Area
          <div
            className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-6"
            onClick={handleClick}
          >
            {uploading ? (
              <>
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-3" />
                <p className="text-sm text-muted-foreground">جاري الرفع...</p>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">
                  اسحب الصورة هنا أو اضغط للاختيار
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, WebP (حد أقصى 5MB)
                </p>
              </>
            )}
          </div>
        )}

        {uploading && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
            <div className="h-full bg-primary animate-pulse w-full" />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        disabled={uploading}
        title={label || "اختيار صورة"}
        aria-label={label || "اختيار صورة"}
        placeholder="اختر ملفاً"
      />
    </div>
  );
};

export default ImageUploader;
