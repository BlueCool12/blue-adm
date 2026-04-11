import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_IMAGE_COMMAND } from "@/features/posts/components/editor/command";
import { CircularProgress, IconButton } from "@mui/material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useGenerateImage } from "@/features/ai/hooks/useGenerateImage";
import { useImageUpload } from "@/features/posts/hooks/useImageUpload";
import { $getRoot, $getSelection, $isRangeSelection } from "lexical";

interface AiImageToolbarProps {
  postId: string;
}

export default function AiImageToolbar({ postId }: AiImageToolbarProps) {
  const [editor] = useLexicalComposerContext();
  const { mutate: generateImage, isPending: isGenerating } = useGenerateImage();
  const { uploadImage, isUploading } = useImageUpload(postId);

  const isPending = isGenerating || isUploading;

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
          onSuccess: async (result) => {
            if (result.image_data) {
              try {
                // 데이터 URL 형식이 아니면 기본적으로 PNG로 가정하여 접두사를 붙여줍니다.
                const dataUrl = result.image_data.startsWith('data:')
                  ? result.image_data
                  : `data:image/png;base64,${result.image_data}`;

                // 브라우저 내장 fetch를 이용해 base64 문자열을 파싱
                const response = await fetch(dataUrl);
                const blob = await response.blob();

                // 추출된 blob에서 실제 MIME 타입(예: image/jpeg, image/png)을 가져와 확장자 지정
                const mimeType = blob.type || 'image/png';
                const extension = mimeType.split('/')[1] || 'png';
                const fileName = `ai_generated_image.${extension}`;
                
                const file = new File([blob], fileName, { type: mimeType });

                const uploadedUrl = await uploadImage(file);
                
                editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                  src: uploadedUrl,
                  altText: "AI Generated Image",
                });
              } catch (error) {
                console.error("Failed to upload AI image", error);
                alert("생성된 이미지 업로드에 실패했습니다.");
              }
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
