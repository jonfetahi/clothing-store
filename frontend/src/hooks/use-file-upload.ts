import React, { useCallback, useState } from 'react';

export interface AcceptedFileConfig {
  mimeType?: string;
  type?: string;
}

function getFilesFromEvent(
  e: React.DragEvent<HTMLElement>,
  acceptedFiles?: AcceptedFileConfig[]
): File[] {
  const mimeTypes = acceptedFiles
    ?.map((it) => it.mimeType || it.type)
    .filter((t): t is string => Boolean(t));

  const dataTransferItems = e.dataTransfer.items;
  const dataTransferFiles = e.dataTransfer.files;

  if (dataTransferItems) {
    return [...dataTransferItems]
      .map((item) => {
        if (item.kind !== 'file') {
          return null;
        }
        const file = item.getAsFile();
        if (!file) return null;

        if (!mimeTypes || mimeTypes.length === 0) return file;

        return mimeTypes.includes(file.type) ? file : null;
      })
      .filter((item): item is File => !!item);
  }

  return [...dataTransferFiles].filter((file) => {
    if (!mimeTypes || mimeTypes.length === 0) return true;
    return mimeTypes.includes(file.type);
  });
}

export function useFileUpload(
  onSelectFile: (file: File) => void,
  acceptedFiles?: AcceptedFileConfig[]
) {
  const fileTypes =
    acceptedFiles
      ?.map((item) => item.mimeType || item.type)
      .filter(Boolean)
      .join(', ') ?? 'image/*';

  const onUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = false;
    input.accept = fileTypes;
    input.click();

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        onSelectFile(file);
      }
      input.remove();
    };
  };

  const [dragging, setDragging] = useState<boolean>(false);

  const onDragOver = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setDragging(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault();
      setDragging(false);
      const files = getFilesFromEvent(e, acceptedFiles);

      const first = files?.[0];
      if (first) {
        onSelectFile(first);
      }
    },
    [acceptedFiles, onSelectFile]
  );

  return {
    dragging,
    dropZone: { onDragOver, onDragLeave, onDrop },
    onUpload,
  };
}