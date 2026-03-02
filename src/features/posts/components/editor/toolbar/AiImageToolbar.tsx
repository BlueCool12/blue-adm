import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_IMAGE_COMMAND } from "@/features/posts/components/editor/command";
import { CircularProgress, IconButton } from "@mui/material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useGenerateImage } from "@/features/ai/hooks/useGenerateImage";
import { $getRoot, $getSelection, $isRangeSelection } from "lexical";

export default function AiImageToolbar() {
  const [editor] = useLexicalComposerContext();
  const { mutate: generateImage, isPending } = useGenerateImage();

  const handleClick = () => {
    editor.read(() => {
      const selection = $getSelection();
      let textContent = '';

      if ($isRangeSelection(selection)) {
        textContent = selection.getTextContent();
      }

      if (!textContent || textContent.trim() === '') {
        textContent = $getRoot().getTextContent();
      }

      if (!textContent || textContent.trim() === '') {
        alert("이미지를 생성할 텍스트가 없습니다.");
        return;
      }

      generateImage(
        { content: textContent },
        {
          onSuccess: (result) => {
            if (result.image_url) {
              editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                src: result.image_url,
                altText: "AI Generated Image",
              });
            }
          },
          onError: (error) => {
            console.error("Failed to generate image", error);
            alert("이미지 생성에 실패했습니다.");
          }
        }
      );
    });
  };

  return (
    <IconButton
      size="small"
      onClick={handleClick}
      disabled={isPending}
      color="primary"
    >
      {isPending ? <CircularProgress size={24} color="inherit" /> : <AutoAwesomeIcon />}
    </IconButton>
  );
}
