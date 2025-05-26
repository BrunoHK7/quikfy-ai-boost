
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from "lucide-react";

interface Photo {
  id: string;
  photo_url: string;
  caption: string;
}

interface ProfileOverviewPhotosProps {
  photos: Photo[];
}

export const ProfileOverviewPhotos = ({ photos }: ProfileOverviewPhotosProps) => {
  const displayPhotos = photos.slice(0, 6); // Show only first 6 photos

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fotos do Perfil</CardTitle>
      </CardHeader>
      <CardContent>
        {displayPhotos.length === 0 ? (
          <div className="text-center py-8">
            <Camera className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma foto adicionada ainda</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {displayPhotos.map((photo) => (
              <div key={photo.id} className="relative">
                <img
                  src={photo.photo_url}
                  alt={photo.caption || "Foto do perfil"}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                {photo.caption && (
                  <p className="text-xs text-gray-600 mt-1 truncate">{photo.caption}</p>
                )}
              </div>
            ))}
          </div>
        )}
        {photos.length > 6 && (
          <p className="text-sm text-gray-500 mt-4 text-center">
            E mais {photos.length - 6} fotos...
          </p>
        )}
      </CardContent>
    </Card>
  );
};
