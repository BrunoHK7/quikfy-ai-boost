
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
            Sua página será: quikfy.com/{linkPageData.slug}
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
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          value={linkPageData.name}
          onChange={(e) => updateLinkPageData({ name: e.target.value })}
          placeholder="Seu nome ou empresa"
        />
      </div>

      {/* Headline */}
      <div className="space-y-2">
        <Label htmlFor="headline">Headline</Label>
        <Textarea
          id="headline"
          value={linkPageData.headline}
          onChange={(e) => updateLinkPageData({ headline: e.target.value })}
          placeholder="Descreva brevemente sobre você ou sua empresa"
          rows={3}
        />
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
