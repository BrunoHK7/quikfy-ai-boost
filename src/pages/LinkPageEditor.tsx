
import React, { useState } from 'react';
import { StandardHeader } from '@/components/StandardHeader';
import { LinkPageSidebar } from '@/components/linkpage/LinkPageSidebar';
import { LinkPagePreview } from '@/components/linkpage/LinkPagePreview';

export interface LinkButton {
  id: string;
  text: string;
  url: string;
  textColor: string;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  fontWeight: 'normal' | 'bold';
  fontSize: number;
}

export interface LinkPageData {
  slug: string;
  profileImage: string;
  name: string;
  headline: string;
  backgroundColor: string;
  buttons: LinkButton[];
}

const LinkPageEditor = () => {
  const [linkPageData, setLinkPageData] = useState<LinkPageData>({
    slug: '',
    profileImage: '',
    name: '',
    headline: '',
    backgroundColor: '#ffffff',
    buttons: []
  });

  const [selectedButtonId, setSelectedButtonId] = useState<string | null>(null);
  const [isSlugAvailable, setIsSlugAvailable] = useState<boolean | null>(null);

  const updateLinkPageData = (updates: Partial<LinkPageData>) => {
    setLinkPageData(prev => ({ ...prev, ...updates }));
  };

  const addButton = () => {
    const newButton: LinkButton = {
      id: Date.now().toString(),
      text: 'Novo botão',
      url: '',
      textColor: '#ffffff',
      backgroundColor: '#6366f1',
      borderColor: '#6366f1',
      borderWidth: 2,
      borderRadius: 8,
      fontWeight: 'normal',
      fontSize: 16
    };
    
    setLinkPageData(prev => ({
      ...prev,
      buttons: [...prev.buttons, newButton]
    }));
    
    setSelectedButtonId(newButton.id);
  };

  const updateButton = (buttonId: string, updates: Partial<LinkButton>) => {
    setLinkPageData(prev => ({
      ...prev,
      buttons: prev.buttons.map(button => 
        button.id === buttonId ? { ...button, ...updates } : button
      )
    }));
  };

  const removeButton = (buttonId: string) => {
    setLinkPageData(prev => ({
      ...prev,
      buttons: prev.buttons.filter(button => button.id !== buttonId)
    }));
    
    if (selectedButtonId === buttonId) {
      setSelectedButtonId(null);
    }
  };

  const checkSlugAvailability = async (slug: string) => {
    // TODO: Implementar verificação real no backend
    // Por enquanto, simulando que alguns slugs não estão disponíveis
    const unavailableslugs = ['admin', 'api', 'www', 'app', 'support'];
    const available = !unavailableslugs.includes(slug.toLowerCase()) && slug.length > 0;
    setIsSlugAvailable(available);
    return available;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <StandardHeader title="Editor de Página de Links" />
      
      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar - 40% */}
        <div className="w-2/5 bg-white border-r border-gray-200 overflow-y-auto">
          <LinkPageSidebar
            linkPageData={linkPageData}
            updateLinkPageData={updateLinkPageData}
            selectedButtonId={selectedButtonId}
            setSelectedButtonId={setSelectedButtonId}
            addButton={addButton}
            updateButton={updateButton}
            removeButton={removeButton}
            isSlugAvailable={isSlugAvailable}
            checkSlugAvailability={checkSlugAvailability}
          />
        </div>

        {/* Preview - 60% */}
        <div className="w-3/5 bg-gray-100 overflow-y-auto">
          <LinkPagePreview linkPageData={linkPageData} />
        </div>
      </div>
    </div>
  );
};

export default LinkPageEditor;
