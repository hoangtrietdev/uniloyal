'use client';

import { useState, useCallback, useRef } from 'react';

interface NfcHookReturn {
  isSupported: boolean;
  isScanning: boolean;
  scan: (onRead: (serialNumber: string) => void) => Promise<void>;
  stopScan: () => void;
}

export function useNfc(): NfcHookReturn {
  const [isScanning, setIsScanning] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Check for Web NFC support (Android Chrome only)
  const isSupported = typeof window !== 'undefined' && 'NDEFReader' in window;

  const stopScan = useCallback(() => {
    abortRef.current?.abort();
    setIsScanning(false);
  }, []);

  const scan = useCallback(async (onRead: (serialNumber: string) => void) => {
    if (!isSupported) return;
    try {
      // @ts-expect-error NDEFReader not in TypeScript DOM types yet
      const ndef = new window.NDEFReader();
      abortRef.current = new AbortController();
      setIsScanning(true);
      await ndef.scan({ signal: abortRef.current.signal });
      ndef.addEventListener('reading', ({ serialNumber }: { serialNumber: string }) => {
        onRead(serialNumber);
        stopScan();
      });
    } catch (err) {
      console.warn('NFC scan error:', err);
      setIsScanning(false);
    }
  }, [isSupported, stopScan]);

  return { isSupported, isScanning, scan, stopScan };
}
