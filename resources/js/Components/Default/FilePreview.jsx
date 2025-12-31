const FilePreview = ({ property, inputProps, lang = 'id' }) => {
  const { data } = inputProps || {};
  const name = property?.props?.name ?? 'file';
  const value = data?.[name] ?? null;

  const src = value instanceof File ? URL.createObjectURL(value) : value;

  let type = data?.type ?? '';
  if (!type && value) {
    if (value instanceof File) {
      if (value.type.startsWith('image/')) type = 'image';
      else if (value.type === 'video/mp4') type = 'video';
    } else if (typeof value === 'string') {
      const lower = value.toLowerCase();
      if (/\.(jpg|jpeg|png|gif|webp)$/.test(lower)) type = 'image';
      else if (lower.endsWith('.mp4')) type = 'video';
    }
  }

  return (
    <div className="w-full">
      {src ? (
        type === 'image' ? (
          <img
            src={src}
            alt="Preview"
            className="max-w-full max-h-[220px] object-contain rounded-md border"
          />
        ) : type === 'video' ? (
          <video
            src={src}
            controls
            className="max-w-full max-h-[220px] rounded-md border"
          >
            Browser Anda tidak mendukung tag video.
          </video>
        ) : (
          <div className="text-sm text-gray-500">
            {lang === 'id' ? 'Format file tidak dikenali' : 'Unknown file format'}
          </div>
        )
      ) : (
        <div className="text-sm text-gray-400">
          {lang === 'id' ? 'Tidak ada file' : 'No file selected'}
        </div>
      )}
    </div>
  );
};


export default FilePreview;
