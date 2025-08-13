

import { useEffect, useState } from "react";

export const useClickOutside = (refs, callback) => {
    useEffect(() => {
        const handleOutsideClick = (event) => {
            console.log('Clicked element:', event.target);
            const isOutside = refs.every((ref) => {
              const contains = ref?.current?.contains(event.target);
              console.log(`Ref ${ref.current} contains:`, contains);
              return !contains;
            });

            if (isOutside && typeof callback === "function") {
                console.log('Outside click detected');
                callback(event);
            }
        };

        window.addEventListener("mousedown", handleOutsideClick);
        return () => {
            window.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [refs, callback]); 
};


export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    const updateMatches = () => setMatches(media.matches);
    updateMatches(); 
    
    media.addEventListener('change', updateMatches);
    return () => media.removeEventListener('change', updateMatches);
  }, [query]);

  return matches;
};                      