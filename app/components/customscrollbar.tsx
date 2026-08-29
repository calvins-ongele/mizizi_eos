'use client';

import { useEffect } from 'react';
import { OverlayScrollbars } from 'overlayscrollbars'; 
import 'overlayscrollbars/overlayscrollbars.css';

 

export default function OverlayScrollbarsInit() {
  useEffect(() => {
    [
      '.sidebarMenuScroll',
      '.scroll250',
      '.scroll290',
      '.scroll300',
      '.scroll350',
    ].forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        OverlayScrollbars(el as HTMLElement, {
          scrollbars: {
            visibility: 'auto',
              autoHide: 'scroll',
              autoHideDelay: 200,
              dragScroll: true,
              clickScroll: false,
              pointers: ['mouse', 'touch', 'pen'],
          },
        });
      });
    });
  }, []);

  return null;
}
