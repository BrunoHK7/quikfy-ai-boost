
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useVisibilityControl } from "@/hooks/useVisibilityControl";
import { useCarouselFrames } from "@/hooks/useCarouselFrames";
import { useCarouselCanvas } from "@/hooks/useCarouselCanvas";
import { CarouselHeader } from "@/components/carousel/creator/CarouselHeader";
import { GlobalSettings } from "@/components/carousel/creator/GlobalSettings";
import { FrameSettings } from "@/components/carousel/creator/FrameSettings";
import { CanvasPreview } from "@/components/carousel/creator/CanvasPreview";

const CarouselCreator = () => {
  const { user } = useAuth();
  
  const [projectName, setProjectName] = useState("Novo Projeto");
  const [dimensions, setDimensions] = useState<'1080x1080' | '1080x1350' | '1080x1920'>('1080x1080');
  const [globalBackgroundColor, setGlobalBackgroundColor] = useState("#FFFFFF");
  const [globalTextColor, setGlobalTextColor] = useState("#131313");
  const [globalFontFamily, setGlobalFontFamily] = useState("Inter");
  const [marginEnabled, setMarginEnabled] = useState(true);
  const [marginHorizontal, setMarginHorizontal] = useState(40);
  const [marginVertical, setMarginVertical] = useState(40);
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [signaturePosition, setSignaturePosition] = useState<'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'>('bottom-right');
  const [signatureSize, setSignatureSize] = useState(80);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const {
    frames,
    setFrames,
    currentFrameIndex,
    setCurrentFrameIndex,
    updateCurrentFrame,
    addFrame,
    removeFrame
  } = useCarouselFrames(globalBackgroundColor, globalTextColor, globalFontFamily);

  const { downloadImages } = useCarouselCanvas();

  // Use visibility control to prevent unwanted reloads
  useVisibilityControl({
    onVisibilityChange: (isVisible) => {
      console.log('🔍 Visibility changed:', isVisible ? 'visible' : 'hidden');
      if (!isVisible) {
        console.log('⏸️ Page hidden, pausing expensive operations');
      } else {
        console.log('▶️ Page visible, resuming operations');
      }
    },
    preventUnload: hasUnsavedChanges
  });

  // Update frames when global settings change
  useEffect(() => {
    setFrames(prev => prev.map(frame => ({
      ...frame,
      backgroundColor: frame.backgroundColor === globalBackgroundColor ? globalBackgroundColor : frame.backgroundColor,
      textColor: frame.textColor === globalTextColor ? globalTextColor : frame.textColor,
      fontFamily: frame.fontFamily === globalFontFamily ? globalFontFamily : frame.fontFamily
    })));
  }, [globalBackgroundColor, globalTextColor, globalFontFamily, setFrames]);

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [frames, projectName, dimensions, globalBackgroundColor, globalTextColor, globalFontFamily, marginEnabled, marginHorizontal, marginVertical, signatureImage, signaturePosition, signatureSize]);

  const handleDownload = () => {
    downloadImages(
      frames,
      dimensions,
      projectName,
      marginEnabled,
      marginHorizontal,
      marginVertical,
      signatureImage,
      signaturePosition,
      signatureSize
    );
    toast.success("Download iniciado!");
  };

  const saveCarouselProject = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para salvar o projeto");
      return;
    }

    setSaving(true);
    try {
      const projectData = {
        user_id: user.id,
        title: projectName,
        content: JSON.stringify({
          dimensions,
          globalBackgroundColor,
          globalTextColor,
          globalFontFamily,
          marginEnabled,
          marginHorizontal,
          marginVertical,
          signatureImage,
          signaturePosition,
          signatureSize,
          frames
        })
      };

      const { error } = await supabase
        .from('carousel_projects')
        .insert([projectData]);

      if (error) throw error;

      setHasUnsavedChanges(false);
      toast.success("Projeto salvo com sucesso!");
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
      toast.error("Erro ao salvar projeto. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const currentFrame = frames[currentFrameIndex];

  const autoSaveData = {
    projectName,
    dimensions,
    globalBackgroundColor,
    globalTextColor,
    globalFontFamily,
    marginEnabled,
    marginHorizontal,
    marginVertical,
    signatureImage,
    signaturePosition,
    signatureSize,
    currentFrameIndex,
    frames
  };

  const { loadSavedData } = useAutoSave({
    data: autoSaveData,
    key: 'carousel_creator',
    debounceMs: 4000,
    enabled: true
  });

  // Optimized data loading - only when user is present and mounted
  useEffect(() => {
    if (!user) return;
    
    let mounted = true;

    const loadPreviousWork = async () => {
      try {
        const savedData = await loadSavedData();
        if (savedData && mounted) {
          console.log('🔄 Carregando trabalho anterior...');
          
          if (savedData.projectName) setProjectName(savedData.projectName);
          if (savedData.dimensions) setDimensions(savedData.dimensions);
          if (savedData.globalBackgroundColor) setGlobalBackgroundColor(savedData.globalBackgroundColor);
          if (savedData.globalTextColor) setGlobalTextColor(savedData.globalTextColor);
          if (savedData.globalFontFamily) setGlobalFontFamily(savedData.globalFontFamily);
          if (savedData.marginEnabled !== undefined) setMarginEnabled(savedData.marginEnabled);
          if (savedData.marginHorizontal) setMarginHorizontal(savedData.marginHorizontal);
          if (savedData.marginVertical) setMarginVertical(savedData.marginVertical);
          if (savedData.signatureImage) setSignatureImage(savedData.signatureImage);
          if (savedData.signaturePosition) setSignaturePosition(savedData.signaturePosition);
          if (savedData.signatureSize) setSignatureSize(savedData.signatureSize);
          if (savedData.currentFrameIndex !== undefined) setCurrentFrameIndex(savedData.currentFrameIndex);
          if (savedData.frames && savedData.frames.length > 0) setFrames(savedData.frames);
          
          setHasUnsavedChanges(false);
        }
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
      }
    };

    loadPreviousWork();

    return () => {
      mounted = false;
    };
  }, [user, loadSavedData, setFrames, setCurrentFrameIndex]);

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <CarouselHeader
        projectName={projectName}
        setProjectName={setProjectName}
        onSave={saveCarouselProject}
        onDownload={handleDownload}
        saving={saving}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      <div className="flex h-[calc(100vh-80px)]">
        <GlobalSettings
          dimensions={dimensions}
          setDimensions={setDimensions}
          globalBackgroundColor={globalBackgroundColor}
          setGlobalBackgroundColor={setGlobalBackgroundColor}
          globalTextColor={globalTextColor}
          setGlobalTextColor={setGlobalTextColor}
          globalFontFamily={globalFontFamily}
          setGlobalFontFamily={setGlobalFontFamily}
          marginEnabled={marginEnabled}
          setMarginEnabled={setMarginEnabled}
          marginHorizontal={marginHorizontal}
          setMarginHorizontal={setMarginHorizontal}
          marginVertical={marginVertical}
          setMarginVertical={setMarginVertical}
          signatureImage={signatureImage}
          setSignatureImage={setSignatureImage}
          signaturePosition={signaturePosition}
          setSignaturePosition={setSignaturePosition}
          signatureSize={signatureSize}
          setSignatureSize={setSignatureSize}
          frames={frames}
          currentFrameIndex={currentFrameIndex}
          setCurrentFrameIndex={setCurrentFrameIndex}
          addFrame={addFrame}
          removeFrame={removeFrame}
        />

        <CanvasPreview
          dimensions={dimensions}
          currentFrame={currentFrame}
          marginEnabled={marginEnabled}
          marginHorizontal={marginHorizontal}
          marginVertical={marginVertical}
          signatureImage={signatureImage}
          signaturePosition={signaturePosition}
          signatureSize={signatureSize}
        />

        <FrameSettings
          currentFrame={currentFrame}
          updateCurrentFrame={updateCurrentFrame}
          globalBackgroundColor={globalBackgroundColor}
          globalTextColor={globalTextColor}
          globalFontFamily={globalFontFamily}
        />
      </div>
    </div>
  );
};

export default CarouselCreator;
