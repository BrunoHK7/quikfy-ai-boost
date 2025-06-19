
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ImageUpload';
import { Plus, Trash2, Settings } from 'lucide-react';
import { LinkPageData, LinkButton } from '@/pages/LinkPageEditor';
import { ButtonEditor } from './ButtonEditor';

interface LinkPageSidebarProps {
  linkPageData: LinkPageData;
  updateLinkPageData: (updates: Partial<LinkPageData>) => void;
  selectedButtonId: string | null;
  setSelectedButtonId: (id: string | null) => void;
  addButton: () => void;
  updateButton: (buttonId: string, updates: Partial<LinkButton>) => void;
  removeButton: (buttonId: string) => void;
  isSlugAvailable: boolean | null;
  checkSlugAvailability: (slug: string) => Promise<boolean>;
}

const fontOptions = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Poppins', label: 'Poppins' }
];

export const LinkPageSidebar: React.FC<LinkPageSidebarProps> = ({
  linkPageData,
  updateLinkPageData,
  selectedButtonId,
  setSelectedButtonId,
  addButton,
  updateButton,
  removeButton,
  isSlugAvailable,
  checkSlugAvailability
}) => {
  const [slugTimeout, setSlugTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleSlugChange = (slug: string) => {
    updateLinkPageData({ slug });
    
    if (slugTimeout) {
      clearTimeout(slugTimeout);
    }
    
    if (slug.length > 0) {
      const timeout = setTimeout(() => {
        checkSlugAvailability(slug);
      }, 500);
      setSlugTimeout(timeout);
    }
  };

  const selectedButton = linkPageData.buttons.find(b => b.id === selectedButtonId);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Configurações</h2>

      {/* Slug */}
      <div className="space-y-2">
        <Label htmlFor="slug">Slug da página</Label>
        <Input
          id="slug"
          value={linkPageData.slug}
          onChange={(e) => handleSlugChange(e.target.value)}
          placeholder="seu-nome"
          className={
            isSlugAvailable === false 
              ? "border-red-500" 
              : isSlugAvailable === true 
              ? "border-green-500" 
              : ""
          }
        />
        {linkPageData.slug && (
          <p className="text-sm text-gray-600">
            Sua página será: quiklinks.quikfy.com.br/{linkPageData.slug}
          </p>
        )}
        {isSlugAvailable === false && (
          <p className="text-sm text-red-600">Este slug não está disponível</p>
        )}
        {isSlugAvailable === true && (
          <p className="text-sm text-green-600">Slug disponível!</p>
        )}
      </div>

      {/* Foto de perfil */}
      <ImageUpload
        label="Foto de perfil"
        value={linkPageData.profileImage}
        onChange={(url) => updateLinkPageData({ profileImage: url })}
        expectedDimensions={{ width: 200, height: 200 }}
      />

      {/* Nome */}
      <div className="space-y-4">
        <Label>Nome</Label>
        <Input
          value={linkPageData.name}
          onChange={(e) => updateLinkPageData({ name: e.target.value })}
          placeholder="Seu nome ou empresa"
        />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Fonte do nome</Label>
            <Select
              value={linkPageData.nameFontFamily}
              onValueChange={(value) => updateLinkPageData({ nameFontFamily: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Cor do nome</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={linkPageData.nameColor}
                onChange={(e) => updateLinkPageData({ nameColor: e.target.value })}
                className="w-12 h-10 rounded border border-gray-300"
              />
              <Input
                value={linkPageData.nameColor}
                onChange={(e) => updateLinkPageData({ nameColor: e.target.value })}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Headline */}
      <div className="space-y-4">
        <Label>Headline</Label>
        <Textarea
          value={linkPageData.headline}
          onChange={(e) => updateLinkPageData({ headline: e.target.value })}
          placeholder="Descreva brevemente sobre você ou sua empresa"
          rows={3}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Fonte da headline</Label>
            <Select
              value={linkPageData.headlineFontFamily}
              onValueChange={(value) => updateLinkPageData({ headlineFontFamily: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Cor da headline</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={linkPageData.headlineColor}
                onChange={(e) => updateLinkPageData({ headlineColor: e.target.value })}
                className="w-12 h-10 rounded border border-gray-300"
              />
              <Input
                value={linkPageData.headlineColor}
                onChange={(e) => updateLinkPageData({ headlineColor: e.target.value })}
                placeholder="#374151"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cor do background */}
      <div className="space-y-2">
        <Label htmlFor="backgroundColor">Cor de fundo</Label>
        <div className="flex gap-2">
          <input
            type="color"
            id="backgroundColor"
            value={linkPageData.backgroundColor}
            onChange={(e) => updateLinkPageData({ backgroundColor: e.target.value })}
            className="w-12 h-10 rounded border border-gray-300"
          />
          <Input
            value={linkPageData.backgroundColor}
            onChange={(e) => updateLinkPageData({ backgroundColor: e.target.value })}
            placeholder="#ffffff"
            className="flex-1"
          />
        </div>
      </div>

      {/* Botões */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Botões</Label>
          <Button onClick={addButton} size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Adicionar botão
          </Button>
        </div>

        <div className="space-y-2">
          {linkPageData.buttons.map((button) => (
            <div
              key={button.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedButtonId === button.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedButtonId(button.id)}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium truncate flex-1">{button.text}</span>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedButtonId(button.id);
                    }}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeButton(button.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor de botão selecionado */}
      {selectedButton && (
        <div className="border-t pt-6">
          <ButtonEditor
            button={selectedButton}
            updateButton={(updates) => updateButton(selectedButton.id, updates)}
            onClose={() => setSelectedButtonId(null)}
          />
        </div>
      )}
    </div>
  );
};
