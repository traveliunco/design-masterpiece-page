import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UploadProgress {
  uploading: boolean;
  progress: number;
  url: string | null;
  error: string | null;
}

export const useImageUpload = (bucket: string = "destinations") => {
  const [uploadState, setUploadState] = useState<UploadProgress>({
    uploading: false,
    progress: 0,
    url: null,
    error: null,
  });

  const uploadImage = async (file: File, path?: string): Promise<string | null> => {
    // Validate file
    if (!file) {
      toast.error("لم يتم اختيار ملف");
      return null;
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("نوع الملف غير مدعوم. الرجاء اختيار صورة (JPG, PNG, WebP)");
      return null;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("حجم الملف كبير جداً. الحد الأقصى 5MB");
      return null;
    }

    setUploadState({ uploading: true, progress: 0, url: null, error: null });

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const fileExt = file.name.split(".").pop();
      const fileName = `${timestamp}-${randomString}.${fileExt}`;
      const filePath = path ? `${path}/${fileName}` : fileName;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Upload error:", error);
        setUploadState({ uploading: false, progress: 0, url: null, error: error.message });
        toast.error(`خطأ في رفع الصورة: ${error.message}`);
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setUploadState({ uploading: false, progress: 100, url: publicUrl, error: null });
      toast.success("تم رفع الصورة بنجاح");
      return publicUrl;
    } catch (error: any) {
      console.error("Upload exception:", error);
      setUploadState({ uploading: false, progress: 0, url: null, error: error.message });
      toast.error("حدث خطأ أثناء رفع الصورة");
      return null;
    }
  };

  const deleteImage = async (filePath: string): Promise<boolean> => {
    try {
      // Extract path from URL if full URL is provided
      let pathToDelete = filePath;
      if (filePath.includes("supabase.co")) {
        const urlParts = filePath.split(`/${bucket}/`);
        pathToDelete = urlParts[1] || filePath;
      }

      const { error } = await supabase.storage
        .from(bucket)
        .remove([pathToDelete]);

      if (error) {
        console.error("Delete error:", error);
        toast.error(`خطأ في حذف الصورة: ${error.message}`);
        return false;
      }

      toast.success("تم حذف الصورة بنجاح");
      return true;
    } catch (error: any) {
      console.error("Delete exception:", error);
      toast.error("حدث خطأ أثناء حذف الصورة");
      return false;
    }
  };

  return {
    uploadImage,
    deleteImage,
    uploading: uploadState.uploading,
    progress: uploadState.progress,
    url: uploadState.url,
    error: uploadState.error,
  };
};
