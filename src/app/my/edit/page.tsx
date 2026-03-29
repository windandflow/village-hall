'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface LinkItem {
  label: string;
  url: string;
}

export default function EditProfilePage() {
  const { entityId, displayName, loading, authenticated, login } = useAuth();
  const { t } = useLocale();
  const router = useRouter();

  const [slug, setSlug] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [slugError, setSlugError] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);

  // 기존 프로필 로드
  useEffect(() => {
    if (!entityId) return;
    fetch(`/api/profile?entityId=${entityId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setSlug(data.slug || '');
          setName(data.displayName || '');
          setBio(data.bio || '');
          setLinks(data.links || []);
        } else {
          setName(displayName || '');
        }
      })
      .catch(() => setName(displayName || ''))
      .finally(() => setInitialLoading(false));
  }, [entityId, displayName]);

  if (loading || initialLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-wf-navy border-t-transparent" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
        <p className="text-sm text-wf-text-light">{t('my.login_prompt')}</p>
        <button
          onClick={login}
          className="rounded-[10px] bg-wf-navy px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80"
        >
          {t('common.login')}
        </button>
      </div>
    );
  }

  function addLink() {
    setLinks([...links, { label: '', url: '' }]);
  }

  function updateLink(index: number, field: keyof LinkItem, value: string) {
    const updated = [...links];
    updated[index] = { ...updated[index], [field]: value };
    setLinks(updated);
  }

  function removeLink(index: number) {
    setLinks(links.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setStatus('saving');
    setSlugError('');

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityId,
          displayName: name,
          bio: bio || null,
          slug: slug || null,
          links: links.filter((l) => l.label && l.url),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        if (res.status === 409) {
          setSlugError(t('edit.slug_taken'));
          setStatus('idle');
          return;
        }
        if (res.status === 400 && err.error === 'Reserved slug') {
          setSlugError(t('edit.slug_taken'));
          setStatus('idle');
          return;
        }
        throw new Error(err.error);
      }

      setStatus('saved');
      setTimeout(() => router.push('/my'), 1200);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-14">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-lg font-bold text-wf-navy">{t('edit.title')}</h1>

        {/* Handle */}
        <div>
          <Label htmlFor="edit-slug">{t('edit.slug')}</Label>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-wf-text-faint">@</span>
            <Input
              id="edit-slug"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''));
                setSlugError('');
              }}
              placeholder={t('edit.slug_placeholder')}
            />
          </div>
          {slugError && (
            <p className="mt-1 text-xs text-red-500">{slugError}</p>
          )}
        </div>

        {/* Name */}
        <div>
          <Label htmlFor="edit-name">{t('edit.display_name')}</Label>
          <Input
            id="edit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Bio */}
        <div>
          <Label htmlFor="edit-bio">{t('edit.bio')}</Label>
          <Textarea
            id="edit-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder={t('edit.bio_placeholder')}
            rows={4}
          />
        </div>

        {/* Links */}
        <div>
          <Label>{t('edit.links')}</Label>
          <div className="mt-2 space-y-3">
            {links.map((link, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={link.label}
                  onChange={(e) => updateLink(i, 'label', e.target.value)}
                  placeholder={t('edit.link_label')}
                  className="flex-1"
                />
                <Input
                  value={link.url}
                  onChange={(e) => updateLink(i, 'url', e.target.value)}
                  placeholder={t('edit.link_url')}
                  className="flex-[2]"
                />
                <button
                  onClick={() => removeLink(i)}
                  className="px-2 text-wf-text-faint hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={addLink}
              className="text-sm text-wf-celadon hover:underline"
            >
              + {t('edit.add_link')}
            </button>
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={status === 'saving'}
            className="rounded-[10px] bg-wf-navy px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {status === 'saving' ? t('edit.saving') : t('edit.save')}
          </button>
          {status === 'saved' && (
            <span className="text-sm text-wf-celadon">{t('edit.saved')}</span>
          )}
          {status === 'error' && (
            <span className="text-sm text-red-500">저장 실패</span>
          )}
          <button
            onClick={() => router.push('/my')}
            className="text-sm text-wf-text-faint hover:text-wf-text-light"
          >
            ← {t('common.my_passport')}
          </button>
        </div>
      </div>
    </div>
  );
}
