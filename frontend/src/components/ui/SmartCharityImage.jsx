import React from 'react';
import { CHARITY_IMAGE_FALLBACK, getCharityImageCandidates } from '../../utils/resolveCharityImage';

export function SmartCharityImage({ charity, alt, className }) {
  const candidates = React.useMemo(() => getCharityImageCandidates(charity), [charity]);
  const [idx, setIdx] = React.useState(0);
  const [useFallback, setUseFallback] = React.useState(false);

  React.useEffect(() => {
    setIdx(0);
    setUseFallback(false);
  }, [candidates]);

  const src = useFallback ? CHARITY_IMAGE_FALLBACK : (candidates[idx] || CHARITY_IMAGE_FALLBACK);

  return (
    <img
      key={`${idx}-${useFallback ? 'fallback' : 'real'}`}
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => {
        if (idx < candidates.length - 1) {
          setIdx(idx + 1);
        } else {
          setUseFallback(true);
        }
      }}
    />
  );
}

