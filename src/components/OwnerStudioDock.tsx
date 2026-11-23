import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { OwnerStudioDrawer } from './OwnerStudioDrawer';
import { Upload, QrCode, Lock, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface OwnerStudioDockProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const OWNER_TOKEN_STORAGE_KEY = 'pulseocto_studio_owner_token';

function safeGetStorage(key: string): string {
  if (typeof window === 'undefined') return '';
  try {
    return window.localStorage.getItem(key) || '';
  } catch {
    return '';
  }
}

function safeSetStorage(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage restrictions inside cross-origin preview iframes
  }
}

function isClientPreviewHost(): boolean {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname.toLowerCase();
  if (!host || host.includes('pulseocto.com')) return false;
  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.endsWith('.run.app') ||
    host.endsWith('.aistudio.google.com') ||
    host.endsWith('.googleusercontent.com') ||
    host.endsWith('.webcontainer.io')
  );
}

export const OwnerStudioDock: React.FC<OwnerStudioDockProps> = ({
  currentPage,
  onNavigate,
}) => {
  const { isAr, dir } = useLanguage();
  const toast = useToast();

  const [ownerToken, setOwnerToken] = useState<string>(() =>
    safeGetStorage(OWNER_TOKEN_STORAGE_KEY)
  );
  const [canShowDock, setCanShowDock] = useState<boolean>(() =>
    isClientPreviewHost()
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isUnlockPromptOpen, setIsUnlockPromptOpen] = useState<boolean>(false);
  const [passcodeInput, setPasscodeInput] = useState<string>('');
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);

  // Sync owner eligibility with backend (ensures zero trace for ordinary visitors on live domain)
  useEffect(() => {
    let active = true;
    const checkOwner = async () => {
      try {
        const res = await fetch('/api/studio/owner-check', {
          headers: ownerToken ? { 'x-studio-owner-token': ownerToken } : {},
        });
        if (!res.ok) return;
        const json = await res.json();
        if (active && typeof json?.canShowDock === 'boolean') {
          setCanShowDock(json.canShowDock);
        }
      } catch {
        if (active) {
          setCanShowDock(isClientPreviewHost());
        }
      }
    };
    checkOwner();
    return () => {
      active = false;
    };
  }, [ownerToken]);

  // Secret owner shortcut: Alt + Shift + S to open Studio Drawer (or prompt passcode on live host)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (canShowDock) {
          setIsDrawerOpen((prev) => !prev);
        } else {
          setIsUnlockPromptOpen(true);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [canShowDock]);

  const handleUnlockSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!passcodeInput.trim() || isUnlocking) return;
      setIsUnlocking(true);
      try {
        const res = await fetch('/api/studio/unlock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ passcode: passcodeInput.trim() }),
        });
        const json = await res.json();
        if (!res.ok || !json?.token) {
          toast.error(
            isAr ? 'رمز المالك غير صحيح' : 'Invalid owner passcode'
          );
          return;
        }
        safeSetStorage(OWNER_TOKEN_STORAGE_KEY, json.token);
        setOwnerToken(json.token);
        setCanShowDock(true);
        setIsUnlockPromptOpen(false);
        setPasscodeInput('');
        setIsDrawerOpen(true);
        toast.success(
          isAr ? 'تم فتح استوديو المالك' : 'Owner Studio Unlocked'
        );
      } catch {
        toast.error(isAr ? 'تعذر التحقق من الرمز' : 'Verification failed');
      } finally {
        setIsUnlocking(false);
      }
    },
    [passcodeInput, isUnlocking, toast, isAr]
  );

  // Completely invisible to ordinary public visitors
  if (!canShowDock && !isUnlockPromptOpen) {
    return null;
  }

  return (
    <>
      {canShowDock && currentPage !== 'card' && (
        <div
          className="fixed bottom-20 md:bottom-4 left-4 z-[90] flex items-center gap-1.5 p-1.5 rounded-full bg-[#0e0720]/95 border border-purple-500/40 shadow-[0_8px_28px_rgba(147,51,234,0.35)] backdrop-blur-md"
          dir={dir}
        >
          {!isCollapsed && (
            <>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                title={
                  isAr
                    ? 'إضافة مشاريع ورفع صور + توليد نصوص بالـ AI (خاص بك فقط)'
                    : 'Upload Project Assets & AI Copy Studio (Owner Only)'
                }
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <Upload className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {isAr ? 'استوديو المشاريع + AI' : 'Projects Studio + AI'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('card')}
                title="معاينة الكارت الذكي المخفي (/card)"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-purple-200 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                <span className="hidden sm:inline">
                  {isAr ? 'معاينة الكارت (/card)' : 'vCard (/card)'}
                </span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            title={isCollapsed ? (isAr ? 'إظهار شريط المالك' : 'Expand Owner Dock') : (isAr ? 'طي شريط المالك' : 'Collapse Owner Dock')}
            className="w-7 h-7 rounded-full bg-white/[0.05] hover:bg-white/[0.14] text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label={isCollapsed ? 'Expand studio dock' : 'Collapse studio dock'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      )}

      {/* Discreet Passcode Modal (triggered ONLY via secret Alt+Shift+S on public host) */}
      {isUnlockPromptOpen && (
        <div
          className="fixed inset-0 z-[1150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          dir={dir}
          onClick={() => setIsUnlockPromptOpen(false)}
        >
          <form
            onSubmit={handleUnlockSubmit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-[#090612] border border-purple-500/40 p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Lock className="w-4 h-4 text-purple-400" />
                <span>{isAr ? 'دخول المالك الخاص' : 'Owner Studio Access'}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsUnlockPromptOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              type="password"
              autoFocus
              value={passcodeInput}
              onChange={(e) => setPasscodeInput(e.target.value)}
              placeholder={isAr ? 'أدخل رمز المالك...' : 'Enter owner passcode...'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white focus:outline-none focus:border-purple-400"
            />
            <button
              type="submit"
              disabled={isUnlocking}
              className="w-full py-2.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-bold cursor-pointer"
            >
              {isAr ? 'تأكيد الدخول' : 'Unlock Studio'}
            </button>
          </form>
        </div>
      )}

      <OwnerStudioDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        ownerToken={ownerToken}
        onNavigatePortfolio={() => onNavigate('portfolio')}
      />
    </>
  );
};
