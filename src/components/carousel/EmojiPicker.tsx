
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Smile } from 'lucide-react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export const EmojiPicker = ({ onEmojiSelect }: EmojiPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const emojiCategories = [
    {
      name: 'Rostos',
      emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳']
    },
    {
      name: 'Gestos',
      emojis: ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏', '🙌', '🤲', '🤝', '🙏']
    },
    {
      name: 'Objetos',
      emojis: ['📱', '💻', '🖥️', '📚', '📖', '✏️', '✒️', '🖊️', '🖋️', '📝', '💡', '🔍', '🔎', '💰', '💳', '💎', '🎯', '🚀', '⭐', '✨', '🔥', '💥', '💫', '🌟']
    },
    {
      name: 'Marketing',
      emojis: ['📈', '📊', '📉', '💹', '💲', '💰', '🎯', '🚀', '⚡', '🔥', '💡', '✨', '🌟', '⭐', '🎪', '🎨', '🎭', '🎪', '🏆', '🥇', '🏅', '🎖️']
    }
  ];

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
          <Smile className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          {emojiCategories.map((category) => (
            <div key={category.name}>
              <h4 className="text-sm font-medium mb-2">{category.name}</h4>
              <div className="grid grid-cols-8 gap-1">
                {category.emojis.map((emoji) => (
                  <Button
                    key={emoji}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-lg hover:bg-purple-100"
                    onClick={() => handleEmojiClick(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
