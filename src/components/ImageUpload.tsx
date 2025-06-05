
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  expectedDimensions: { width: number; height: number };
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  expectedDimensions,
  className = ""
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateImageDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const isValid = img.width === expectedDimensions.width && img.height === expectedDimensions.height;
        if (!isValid) {
          toast.error(`A imagem deve ter exatamente ${expectedDimensions.width}x${expectedDimensions.height} pixels`);
        }
        resolve(isValid);
      };
      img.onerror = () => resolve(false);
      img.src = URL.createObjectURL(file);
    });
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    
    try {
      // Validar dimensões
      const isValidDimensions = await validateImageDimensions(file);
      if (!isValidDimensions) {
        setUploading(false);
        return;
      }

      // Upload para Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('course-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Obter URL pública
      const { data } = supabase.storage
        .from('course-images')
        .getPublicUrl(filePath);

      onChange(data.publicUrl);
      toast.success('Imagem enviada com sucesso!');
      
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      toast.error(`Erro ao enviar imagem: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    uploadImage(file);
  };

  const removeImage = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <Label>{label}</Label>
      <div className="mt-2">
        {value ? (
          <div className="relative inline-block">
            <img
              src={value}
              alt="Preview"
              className="w-32 h-20 object-cover rounded-lg border"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 w-6 h-6 p-0"
              onClick={removeImage}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-500 mb-2">
              {expectedDimensions.width}x{expectedDimensions.height} pixels
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>Enviando...</>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Selecionar Imagem
                </>
              )}
            </Button>
          </div>
        )}
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};
