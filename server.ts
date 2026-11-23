import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '50mb', inflate: false }));

const DATA_DIR = path.resolve(__dirname, 'data');
const STUDIO_DB_PATH = path.join(DATA_DIR, 'studio-projects.json');
const UPLOADS_DIR = path.resolve(__dirname, 'public', 'uploads');
const SERVER_TOKEN_SECRET =
  process.env.OWNER_STUDIO_PASSCODE ||
  process.env.GEMINI_API_KEY ||
  crypto.randomBytes(32).toString('hex');

try {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
} catch {
  // Ignore on read-only container filesystems
}

app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: '7d' }));

// Initialize Google GenAI client (server-side only)
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 8 Core disciplines of Pulse OCTO
const PULSE_OCTO_ARMS = [
  {
    id: 'branding',
    titleAr: 'الهوية وبناء العلامة',
    titleEn: 'Branding & Identity',
    keywords: ['هوية', 'لوجو', 'شعار', 'براند', 'علامة تجارية', 'تصميم هوية', 'بناء علامة', 'brand', 'identity', 'logo'],
    descAr: 'استراتيجية وتصميم الهوية المؤسسية والتموضع السوقي المتفرد.',
  },
  {
    id: 'production',
    titleAr: 'الإنتاج وصناعة المحتوى',
    titleEn: 'Media Production & Content',
    keywords: ['تصوير', 'فيديو', 'إعلان', 'ريلز', 'إنتاج', 'مونتاج', 'بودكاست', 'محتوى مرئي', 'video', 'production', 'photoshoot', 'cinematic'],
    descAr: 'إنتاج إعلانات وسينمائيات فائقة الجودة تخطف الانتباه وتعزز المبيعات.',
  },
  {
    id: 'platforms',
    titleAr: 'تصميم وتطوير المواقع',
    titleEn: 'UI/UX & Web Development',
    keywords: ['موقع', 'متجر', 'ابلكيشن', 'تطبيق', 'ويب', 'برمجة', 'منصة', 'سلة', 'زد', 'shopify', 'website', 'app', 'e-commerce'],
    descAr: 'تطوير منصات ويب ومتاجر فائقة السرعة ومصممة لرفع معدلات التحويل.',
  },
  {
    id: 'performance',
    titleAr: 'التسويق بالأداء والحملات',
    titleEn: 'Performance Marketing',
    keywords: ['اعلانات', 'حملات ممولة', 'فيسبوك ادز', 'تيك توك ادز', 'جوجل ادز', 'مبيعات', 'roas', 'ads', 'media buying', 'اعلانات ممولة'],
    descAr: 'إدارة وتوجيه الحملات الممولة بأعلى عائد على الإنفاق الإعلاني (ROAS).',
  },
  {
    id: 'social',
    titleAr: 'إدارة السوشيال ميديا',
    titleEn: 'Social Media Management',
    keywords: ['سوشيال ميديا', 'انستجرام', 'تيك توك', 'ادارة صفحات', 'محتوى', 'نشر', 'social media', 'engagement'],
    descAr: 'إدارة متكاملة للحسابات وصناعة محتوى يومي يجذب الجمهور المستهدف.',
  },
  {
    id: 'seo',
    titleAr: 'تحسين محركات البحث SEO',
    titleEn: 'Search Engine Optimization',
    keywords: ['سيو', 'محركات البحث', 'جوجل', 'تصدر نتائج البحث', 'seo', 'organic search', 'ranking'],
    descAr: 'تصدر نتائج جوجل والوصول العضوي المستدام للعملاء دون تكلفة نقرات.',
  },
  {
    id: 'strategy',
    titleAr: 'الاستشارات والحلول الرقمية',
    titleEn: 'Digital Strategy & Consulting',
    keywords: ['استشارة', 'خطة تسويق', 'استراتيجية', 'دراسة سوق', 'تحليل منافسين', 'consulting', 'strategy', 'roadmap'],
    descAr: 'رسم خارطة طريق للنمو وتحليل المنافسين لضمان نجاح التوسع.',
  },
  {
    id: 'automation',
    titleAr: 'الأتمتة وربط الأنظمة',
    titleEn: 'Business Automation & Integration',
    keywords: ['اتمتة', 'ربط', 'crm', 'واتساب بوت', 'شات بوت', 'ذكاء اصطناعي', 'automation', 'integration', 'workflows'],
    descAr: 'أتمتة العمليات وربط المتجر بـ WhatsApp و CRM لتقليل الجهد البشري ومضاعفة الكفاءة.',
  },
];

const SYSTEM_INSTRUCTION = `
You are the AI Digital Growth Consultant for "Pulse OCTO" (وكالة رقمية متطورة بمدينة بنها، مصر).
Brand Philosophy: ONE BRAND. ONE SYSTEM. ONE PULSE. (8 ARMS. ONE SYSTEM).
Your mission: Instantly respond to client inquiries and help them choose the optimal Pulse OCTO service arms for their specific project, business stage, or goal.

Pulse OCTO 8 Core Disciplines / Arms:
1. الهوية وبناء العلامة (Branding & Identity)
2. الإنتاج وصناعة المحتوى (Media Production & Content)
3. تصميم وتطوير المواقع (UI/UX & Web Development)
4. التسويق بالأداء والحملات (Performance Marketing)
5. إدارة السوشيال ميديا (Social Media Management)
6. تحسين محركات البحث SEO (Search Engine Optimization)
7. الاستشارات والحلول الرقمية (Digital Strategy & Consulting)
8. الأتمتة وربط الأنظمة (Business Automation & Integration)

Guidelines:
- Tone: Professional, premium, enthusiastic, authoritative yet welcoming, concise and actionable.
- Respond in the same language as the user (Arabic or English). If Arabic, use fluent, refined, modern Egyptian/Arabic business tone.
- Give a direct, concise diagnostic answer:
  1. Quick analysis of their situation / goal.
  2. Recommended Pulse OCTO arm(s) with clear reason why.
  3. Proposed immediate action step or strategic advice.
- Return your response strictly as valid JSON with the following structure:
{
  "summary": "Brief 1-2 sentence assessment",
  "recommendedArms": ["Name of arm 1", "Name of arm 2"],
  "advice": "Clear, strategic guidance tailored to their inquiry (2-3 sentences)",
  "nextStep": "Clear next action (e.g. إرسال الطلب عبر النموذج أو التحدث مع المستشار عبر واتساب)"
}
Do not wrap in markdown code fence if possible, or return parseable JSON.
`;

// AI Instant Advisor API Route
app.post('/api/ai/advisor', async (req, res) => {
  const { query, language = 'ar', currentSelected = [] } = req.body;

  if (!query || typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ error: 'Query is required' });
  }

  const trimmedQuery = query.trim();

  // If Gemini API is available, generate dynamic response with gemini-3.8-flash
  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Client inquiry: "${trimmedQuery}". Current user language: ${language}. Current selected services: ${JSON.stringify(currentSelected)}. Provide tailored recommendation.`,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.4,
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text;
      if (responseText) {
        try {
          const parsed = JSON.parse(responseText);
          return res.json({
            success: true,
            source: 'gemini',
            data: parsed,
          });
        } catch {
          // If JSON parse failed, clean string
          const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleaned);
          return res.json({
            success: true,
            source: 'gemini',
            data: parsed,
          });
        }
      }
    } catch (err: any) {
      console.warn('Gemini API call failed or rate-limited, falling back to smart local matching engine:', err?.message);
    }
  }

  // Smart algorithmic fallback if GEMINI_API_KEY is not set or failed:
  // Analyze query against keywords
  const lowerQuery = trimmedQuery.toLowerCase();
  const matchedArms = PULSE_OCTO_ARMS.filter((arm) =>
    arm.keywords.some((kw) => lowerQuery.includes(kw.toLowerCase()))
  );

  const isAr = language !== 'en';

  const defaultArms = matchedArms.length > 0
    ? matchedArms.slice(0, 3)
    : [PULSE_OCTO_ARMS[0], PULSE_OCTO_ARMS[3]]; // Branding & Performance marketing

  const armTitles = defaultArms.map((a) => (isAr ? a.titleAr : a.titleEn));

  const fallbackData = {
    summary: isAr
      ? `بناءً على تفاصيل مشروعك (${trimmedQuery})، تحتاج إلى منظومة نمو متكاملة تجمع بين بناء الحضور الرقمي وتحقيق المبيعات المباشرة.`
      : `Based on your request (${trimmedQuery}), your brand requires an integrated growth system bridging brand credibility and scalable conversions.`,
    recommendedArms: armTitles,
    advice: isAr
      ? `ننصح بالبدء بـ ${armTitles.join(' مع ')} لضمان أساس تسويقي قوي يحقق أعلى عائد على الاستثمار (ROAS) دون إهدار الميزانية.`
      : `We recommend starting with ${armTitles.join(' & ')} to ensure an authoritative market position and maximum return on ad spend.`,
    nextStep: isAr
      ? 'يمكنك اعتماد هذه الخدمات فوراً في النموذج أدناه، أو التواصل الفوري مع مدير العمليات عبر واتساب.'
      : 'You can select these services directly in the form below or chat live with our operations lead on WhatsApp.',
  };

  return res.json({
    success: true,
    source: 'engine',
    data: fallbackData,
  });
});

// ============================================================
// OWNER STUDIO API (Projects, Assets Upload & Gemini Vision Copy)
// ============================================================

interface StoredStudioData {
  customProjects: any[];
  projectOverrides: Record<string, any>;
}

function readStudioData(): StoredStudioData {
  try {
    if (!fs.existsSync(STUDIO_DB_PATH)) {
      return { customProjects: [], projectOverrides: {} };
    }
    const raw = fs.readFileSync(STUDIO_DB_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      customProjects: Array.isArray(parsed?.customProjects) ? parsed.customProjects : [],
      projectOverrides:
        parsed?.projectOverrides && typeof parsed.projectOverrides === 'object'
          ? parsed.projectOverrides
          : {},
    };
  } catch {
    return { customProjects: [], projectOverrides: {} };
  }
}

function writeStudioData(data: StoredStudioData): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(STUDIO_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function getRequestHostname(req: express.Request): string {
  const forwardedHost = (req.get('x-forwarded-host') || '').split(',')[0].trim();
  const hostHeader = (forwardedHost || req.get('host') || req.hostname || '').toLowerCase();
  return hostHeader.split(':')[0];
}

function isOwnerPreviewHost(req: express.Request): boolean {
  const host = getRequestHostname(req);
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

function signOwnerToken(issuedAt: number): string {
  const payload = `owner:${issuedAt}`;
  const sig = crypto
    .createHmac('sha256', SERVER_TOKEN_SECRET)
    .update(payload)
    .digest('hex');
  return `${issuedAt}.${sig}`;
}

function verifyOwnerToken(token?: string): boolean {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const issuedAt = parseInt(parts[0], 10);
  if (!Number.isFinite(issuedAt)) return false;
  // Valid for 30 days
  if (Date.now() - issuedAt > 30 * 24 * 60 * 60 * 1000) return false;
  const expected = signOwnerToken(issuedAt);
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function isAuthorizedStudioRequest(req: express.Request): boolean {
  if (isOwnerPreviewHost(req)) return true;
  const token = req.get('x-studio-owner-token');
  return verifyOwnerToken(token);
}

function sanitizeSegment(input: string, fallback = 'project'): string {
  const cleaned = (input || '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return cleaned || fallback;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// Check whether the caller should see the Owner Studio Dock
app.get('/api/studio/owner-check', (req, res) => {
  const token = req.get('x-studio-owner-token');
  const previewHost = isOwnerPreviewHost(req);
  const tokenValid = verifyOwnerToken(token);
  return res.json({
    canShowDock: previewHost || tokenValid,
    previewHost,
    passcodeConfigured: Boolean(process.env.OWNER_STUDIO_PASSCODE),
    geminiConfigured: Boolean(aiClient),
  });
});

// Optional passcode unlock for the owner when visiting custom live domains
app.post('/api/studio/unlock', (req, res) => {
  const { passcode } = req.body || {};
  const configured = process.env.OWNER_STUDIO_PASSCODE;

  if (isOwnerPreviewHost(req)) {
    return res.json({ success: true, token: signOwnerToken(Date.now()) });
  }

  if (!configured) {
    return res.status(403).json({
      success: false,
      error: 'Owner passcode unlock is not enabled on this host.',
    });
  }

  if (typeof passcode !== 'string') {
    return res.status(400).json({ success: false, error: 'Passcode is required.' });
  }

  const a = Buffer.from(passcode);
  const b = Buffer.from(configured);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return res.status(401).json({ success: false, error: 'Invalid passcode.' });
  }

  return res.json({ success: true, token: signOwnerToken(Date.now()) });
});

// Public read of custom projects and uploaded project asset overrides
app.get('/api/studio/projects', (_req, res) => {
  const data = readStudioData();
  return res.json({
    success: true,
    data,
  });
});

// Upload an image or PDF asset to public/uploads/<projectId>/
app.post('/api/studio/upload', (req, res) => {
  if (!isAuthorizedStudioRequest(req)) {
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }

  const { projectId, filename, mimeType, dataBase64 } = req.body || {};
  if (!dataBase64 || typeof dataBase64 !== 'string') {
    return res.status(400).json({ success: false, error: 'File content is required.' });
  }

  const allowedMimeToExt: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'image/svg+xml': '.svg',
    'application/pdf': '.pdf',
  };

  const cleanMime = String(mimeType || '').split(';')[0].trim().toLowerCase();
  const base64Body = dataBase64.includes(',') ? dataBase64.split(',')[1] : dataBase64;
  const rawBuffer = Buffer.from(base64Body, 'base64');

  if (!rawBuffer.length || rawBuffer.length > 35 * 1024 * 1024) {
    return res.status(400).json({ success: false, error: 'Invalid or oversized file (max 35MB).' });
  }

  const origBase = path.parse(String(filename || 'asset')).name;
  const origExt = path.parse(String(filename || '')).ext.toLowerCase();
  const ext = allowedMimeToExt[cleanMime] || (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.pdf'].includes(origExt) ? origExt : '.jpg');

  const safeProject = sanitizeSegment(String(projectId || 'general'), 'general');
  const safeBase = sanitizeSegment(origBase, 'asset');
  const finalName = `${Date.now()}-${crypto.randomBytes(3).toString('hex')}-${safeBase}${ext}`;

  const targetDir = path.join(UPLOADS_DIR, safeProject);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, finalName), rawBuffer);

  return res.json({
    success: true,
    url: `/uploads/${safeProject}/${finalName}`,
    fileSize: formatBytes(rawBuffer.length),
  });
});

// Generate bilingual luxury editorial titles & descriptions for an uploaded image using Gemini Vision
app.post('/api/studio/generate-copy', async (req, res) => {
  if (!isAuthorizedStudioRequest(req)) {
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }

  const {
    dataBase64,
    imageUrl,
    mimeType = 'image/jpeg',
    clientName = 'Pulse OCTO Client',
    projectCategory = 'Brand Identity & Digital Systems',
    assetType = 'lookbook',
    brandSummary = '',
  } = req.body || {};

  const slotLabels: Record<string, { ar: string; en: string }> = {
    lookbook: { ar: 'قطعة أزياء / إطلالة من التشكيلة', en: 'Collection Lookbook Piece' },
    mockup: { ar: 'موك اب وتطبيق بصري للعلامة', en: 'Brand Application Mockup' },
    poster: { ar: 'تصميم سوشيال ميديا وإعلان بصري', en: 'Social Media Creative' },
    brand: { ar: 'عنصر من الهوية البصرية', en: 'Brand Identity Element' },
    cover: { ar: 'الغلاف البصري الرئيسي', en: 'Key Brand Visual Cover' },
    storefront: { ar: 'واجهة الموقع أو المتجر الرقمي', en: 'Digital Storefront Interface' },
    logo: { ar: 'الشعار الرسمي للعلامة التجارية', en: 'Official Brandmark' },
  };
  const slotInfo = slotLabels[assetType] || slotLabels.lookbook;

  const buildSmartFallback = () => ({
    title: `${clientName} — ${slotInfo.ar}`,
    titleEn: `${clientName} — ${slotInfo.en}`,
    description: `تفصيل بصري معتمد ضمن منظومة ${clientName} يبرز جودة التنفيذ والتكامل مع الهوية البصرية للعلامة.`,
    descriptionEn: `Curated visual showcase for ${clientName}, reflecting crafted brand alignment and refined aesthetic presence.`,
    collectionTag: slotInfo.ar,
    collectionTagEn: slotInfo.en,
  });

  // Allow analyzing an already-hosted local image inside public/ if dataBase64 is omitted
  let resolvedBase64 = typeof dataBase64 === 'string' ? dataBase64 : '';
  let resolvedMime = String(mimeType || 'image/jpeg').split(';')[0].trim().toLowerCase();

  if (!resolvedBase64 && typeof imageUrl === 'string' && imageUrl.startsWith('/')) {
    const publicRoot = path.resolve(__dirname, 'public');
    const relUrl = decodeURIComponent(imageUrl.split('?')[0]).replace(/^\/+/, '');
    const candidatePath = path.resolve(publicRoot, relUrl);
    if (candidatePath.startsWith(publicRoot) && fs.existsSync(candidatePath)) {
      const ext = path.extname(candidatePath).toLowerCase();
      const extMime: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
        '.gif': 'image/gif',
      };
      if (extMime[ext]) {
        resolvedMime = extMime[ext];
        resolvedBase64 = fs.readFileSync(candidatePath).toString('base64');
      }
    }
  }

  if (!aiClient || !resolvedBase64 || !resolvedMime.startsWith('image/')) {
    return res.json({
      success: true,
      source: 'template',
      data: buildSmartFallback(),
    });
  }

  try {
    const cleanBase64 = resolvedBase64.includes(',') ? resolvedBase64.split(',')[1] : resolvedBase64;
    const cleanMime = resolvedMime;

    const prompt = `You are the Senior Creative Director & Bilingual Brand Copywriter at PULSE OCTO (a luxury digital & branding agency).
Analyze the attached image carefully and write authentic, high-craft Arabic and English copy describing ONLY what is genuinely visible in the image, tailored to this client's brand context:
- Client / Brand Name: ${clientName}
- Brand Sector / Category: ${projectCategory}
- Asset Slot Type: ${slotInfo.en} (${slotInfo.ar})
${brandSummary ? `- Brand Context: ${brandSummary}` : ''}

STRICT RULES:
1. Describe real visible details (colors, fabrics, cut, silhouettes, materials, packaging, typography, composition, product framing, UI layout).
2. NEVER invent fake statistics, fake discounts, percentages, follower numbers, client quotes, or unrelated claims.
3. Arabic must be refined, natural, modern luxury editorial Arabic (accurate grammar, crisp phrasing).
4. Keep "title" and "titleEn" concise (3 to 7 words).
5. Keep "description" and "descriptionEn" concise (1 to 2 polished sentences).`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: [
        {
          inlineData: {
            mimeType: cleanMime,
            data: cleanBase64,
          },
        },
        {
          text: prompt,
        },
      ],
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Concise Arabic title (3-7 words)' },
            titleEn: { type: Type.STRING, description: 'Concise English title (3-7 words)' },
            description: { type: Type.STRING, description: 'Refined Arabic description (1-2 sentences)' },
            descriptionEn: { type: Type.STRING, description: 'Refined English description (1-2 sentences)' },
            collectionTag: { type: Type.STRING, description: 'Short Arabic category tag (2-3 words)' },
            collectionTagEn: { type: Type.STRING, description: 'Short English category tag (2-3 words)' },
          },
          required: ['title', 'titleEn', 'description', 'descriptionEn', 'collectionTag', 'collectionTagEn'],
        },
      },
    });

    const rawText = response.text;
    if (rawText) {
      const parsed = JSON.parse(rawText);
      return res.json({
        success: true,
        source: 'gemini',
        data: {
          title: parsed.title || buildSmartFallback().title,
          titleEn: parsed.titleEn || buildSmartFallback().titleEn,
          description: parsed.description || buildSmartFallback().description,
          descriptionEn: parsed.descriptionEn || buildSmartFallback().descriptionEn,
          collectionTag: parsed.collectionTag || slotInfo.ar,
          collectionTagEn: parsed.collectionTagEn || slotInfo.en,
        },
      });
    }
  } catch (err: any) {
    console.warn('[Studio AI Copy] Gemini generation fallback triggered:', err?.message);
  }

  return res.json({
    success: true,
    source: 'template',
    data: buildSmartFallback(),
  });
});

// Persist new custom project OR append uploaded assets to an existing project
app.post('/api/studio/projects', (req, res) => {
  if (!isAuthorizedStudioRequest(req)) {
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }

  const body = req.body || {};
  const store = readStudioData();

  if (body.mode === 'create-project') {
    const p = body.project;
    if (!p || !p.client || !p.title) {
      return res.status(400).json({ success: false, error: 'Client name and project title are required.' });
    }

    const baseId = sanitizeSegment(p.id || p.clientEn || p.client, 'brand');
    const uniqueId = `${baseId}-${Date.now().toString(36).slice(-4)}`;

    const newProject = {
      ...p,
      id: p.id || uniqueId,
      slug: p.slug || p.id || uniqueId,
      year: p.year || String(new Date().getFullYear()),
      gallery: Array.isArray(p.gallery) ? p.gallery : [],
      stats: Array.isArray(p.stats) ? p.stats : [],
      deliverables: Array.isArray(p.deliverables) ? p.deliverables : [],
      assetShowcase: Array.isArray(p.assetShowcase) ? p.assetShowcase : [],
    };

    store.customProjects.unshift(newProject);
    writeStudioData(store);
    return res.json({ success: true, data: store, project: newProject });
  }

  if (body.mode === 'append-assets') {
    const targetId = String(body.projectId || '').trim();
    if (!targetId) {
      return res.status(400).json({ success: false, error: 'Target projectId is required.' });
    }

    const customIdx = store.customProjects.findIndex((c) => c.id === targetId);
    const incomingAssets = Array.isArray(body.addedAssets) ? body.addedAssets : [];
    const incomingGallery = Array.isArray(body.addedGallery) ? body.addedGallery : [];
    const logoUrl = typeof body.logo === 'string' && body.logo ? body.logo : undefined;
    const heroUrl = typeof body.heroImage === 'string' && body.heroImage ? body.heroImage : undefined;
    const pdfPayload = body.brandGuidelinesPdf && body.brandGuidelinesPdf.url ? body.brandGuidelinesPdf : undefined;

    if (customIdx >= 0) {
      const targetProj = store.customProjects[customIdx];
      if (logoUrl) targetProj.logo = logoUrl;
      if (heroUrl) targetProj.heroImage = heroUrl;
      if (pdfPayload) targetProj.brandGuidelinesPdf = pdfPayload;
      targetProj.assetShowcase = [...incomingAssets, ...(targetProj.assetShowcase || [])];
      targetProj.gallery = Array.from(new Set([...(targetProj.gallery || []), ...incomingGallery]));
      store.customProjects[customIdx] = targetProj;
    } else {
      const existing = store.projectOverrides[targetId] || {};
      const prevAssets = Array.isArray(existing.addedAssets) ? existing.addedAssets : [];
      const prevGallery = Array.isArray(existing.addedGallery) ? existing.addedGallery : [];
      const prevRemoved = Array.isArray(existing.removedAssetUrls) ? existing.removedAssetUrls : [];
      const addedUrlSet = new Set(incomingAssets.map((a: any) => a.url));

      store.projectOverrides[targetId] = {
        ...existing,
        ...(logoUrl ? { logo: logoUrl } : {}),
        ...(heroUrl ? { heroImage: heroUrl } : {}),
        ...(pdfPayload ? { brandGuidelinesPdf: pdfPayload } : {}),
        addedAssets: [...incomingAssets, ...prevAssets],
        addedGallery: Array.from(new Set([...prevGallery, ...incomingGallery])),
        removedAssetUrls: prevRemoved.filter((u: string) => !addedUrlSet.has(u)),
        updatedAt: new Date().toISOString(),
      };
    }

    writeStudioData(store);
    return res.json({ success: true, data: store });
  }

  return res.status(400).json({ success: false, error: 'Invalid mode.' });
});

// Helper to safely delete an uploaded asset file inside public/uploads/
function tryDeleteUploadedFile(url?: string) {
  if (!url || typeof url !== 'string' || !url.startsWith('/uploads/')) return;
  const resolvedTarget = path.resolve(__dirname, 'public', url.replace(/^\/+/, ''));
  if (resolvedTarget.startsWith(UPLOADS_DIR) && fs.existsSync(resolvedTarget)) {
    try {
      fs.unlinkSync(resolvedTarget);
    } catch {
      // Ignore cleanup failure
    }
  }
}

// Edit or replace any existing project image (Logo, Hero Cover, Gallery/AssetShowcase photo, or PDF)
app.patch('/api/studio/assets', (req, res) => {
  if (!isAuthorizedStudioRequest(req)) {
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }

  const {
    projectId,
    slotTarget = 'asset',
    originalUrl = '',
    newUrl = '',
    updates = {},
    setAsHeroCover = false,
    brandGuidelinesPdf,
  } = req.body || {};

  if (!projectId) {
    return res.status(400).json({ success: false, error: 'projectId is required.' });
  }

  const store = readStudioData();
  const customIdx = store.customProjects.findIndex((c) => c.id === projectId);

  if (customIdx >= 0) {
    const proj = store.customProjects[customIdx];

    if (slotTarget === 'pdf' && brandGuidelinesPdf?.url) {
      if (proj.brandGuidelinesPdf?.url && proj.brandGuidelinesPdf.url !== brandGuidelinesPdf.url) {
        tryDeleteUploadedFile(proj.brandGuidelinesPdf.url);
      }
      proj.brandGuidelinesPdf = brandGuidelinesPdf;
    } else if (slotTarget === 'logo' && newUrl) {
      if (proj.logo && proj.logo !== newUrl) tryDeleteUploadedFile(proj.logo);
      proj.logo = newUrl;
    } else if (slotTarget === 'hero' && newUrl) {
      if (proj.heroImage && proj.heroImage !== newUrl) tryDeleteUploadedFile(proj.heroImage);
      proj.heroImage = newUrl;
    } else {
      const targetUrl = newUrl || originalUrl;
      let matched = false;
      proj.assetShowcase = (proj.assetShowcase || []).map((asset: any) => {
        if (asset.url === originalUrl) {
          matched = true;
          return {
            ...asset,
            ...updates,
            url: targetUrl,
          };
        }
        return asset;
      });
      if (!matched && targetUrl) {
        proj.assetShowcase = [
          ...(proj.assetShowcase || []),
          {
            url: targetUrl,
            title: updates.title || proj.client,
            titleEn: updates.titleEn || proj.clientEn || proj.client,
            type: updates.type || 'lookbook',
            description: updates.description || '',
            descriptionEn: updates.descriptionEn || '',
          },
        ];
      }
      if (originalUrl && targetUrl && originalUrl !== targetUrl) {
        proj.gallery = (proj.gallery || []).map((g: string) => (g === originalUrl ? targetUrl : g));
        if (proj.heroImage === originalUrl) proj.heroImage = targetUrl;
        tryDeleteUploadedFile(originalUrl);
      }
      if (setAsHeroCover && targetUrl) {
        proj.heroImage = targetUrl;
      }
    }

    store.customProjects[customIdx] = proj;
    writeStudioData(store);
    return res.json({ success: true, data: store });
  }

  // Built-in project override
  const existing = store.projectOverrides[projectId] || {};

  if (slotTarget === 'pdf' && brandGuidelinesPdf?.url) {
    if (existing.brandGuidelinesPdf?.url && existing.brandGuidelinesPdf.url !== brandGuidelinesPdf.url) {
      tryDeleteUploadedFile(existing.brandGuidelinesPdf.url);
    }
    existing.brandGuidelinesPdf = brandGuidelinesPdf;
  } else if (slotTarget === 'logo' && newUrl) {
    if (existing.logo && existing.logo !== newUrl) tryDeleteUploadedFile(existing.logo);
    existing.logo = newUrl;
    existing.removedAssetUrls = (existing.removedAssetUrls || []).filter((u: string) => u !== newUrl);
  } else if (slotTarget === 'hero' && newUrl) {
    if (existing.heroImage && existing.heroImage !== newUrl) tryDeleteUploadedFile(existing.heroImage);
    existing.heroImage = newUrl;
    existing.removedAssetUrls = (existing.removedAssetUrls || []).filter((u: string) => u !== newUrl);
  } else if (originalUrl) {
    const targetUrl = newUrl || originalUrl;
    const addedAssets = Array.isArray(existing.addedAssets) ? existing.addedAssets : [];
    const addedIdx = addedAssets.findIndex((a: any) => a.url === originalUrl);

    if (addedIdx >= 0) {
      addedAssets[addedIdx] = {
        ...addedAssets[addedIdx],
        ...updates,
        url: targetUrl,
      };
      existing.addedAssets = addedAssets;
      if (Array.isArray(existing.addedGallery)) {
        existing.addedGallery = existing.addedGallery.map((g: string) =>
          g === originalUrl ? targetUrl : g
        );
      }
    } else {
      const replacedAssets = existing.replacedAssets && typeof existing.replacedAssets === 'object'
        ? { ...existing.replacedAssets }
        : {};

      // Check if originalUrl was itself already the replacement target of a base asset
      const chainedKey = Object.keys(replacedAssets).find(
        (origKey) => replacedAssets[origKey]?.url === originalUrl
      );
      const mapKey = chainedKey || originalUrl;
      const prevEntry = replacedAssets[mapKey] || {};

      replacedAssets[mapKey] = {
        ...prevEntry,
        ...updates,
        url: targetUrl,
      };
      existing.replacedAssets = replacedAssets;
    }

    if (existing.heroImage === originalUrl && targetUrl) {
      existing.heroImage = targetUrl;
    }
    if (setAsHeroCover && targetUrl) {
      existing.heroImage = targetUrl;
    }
    if (originalUrl !== targetUrl) {
      tryDeleteUploadedFile(originalUrl);
    }
  }

  existing.updatedAt = new Date().toISOString();
  store.projectOverrides[projectId] = existing;
  writeStudioData(store);
  return res.json({ success: true, data: store });
});

// Remove a single uploaded or built-in asset URL from a project
app.delete('/api/studio/assets', (req, res) => {
  if (!isAuthorizedStudioRequest(req)) {
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }

  const { projectId, url, isPdf, slotTarget } = req.body || {};
  if (!projectId || !url) {
    return res.status(400).json({ success: false, error: 'projectId and url are required.' });
  }

  const store = readStudioData();
  const customIdx = store.customProjects.findIndex((c) => c.id === projectId);

  if (customIdx >= 0) {
    const proj = store.customProjects[customIdx];
    if (isPdf || slotTarget === 'pdf') {
      delete proj.brandGuidelinesPdf;
    } else if (slotTarget === 'logo') {
      proj.logo = '';
    } else {
      proj.assetShowcase = (proj.assetShowcase || []).filter((a: any) => a.url !== url);
      proj.gallery = (proj.gallery || []).filter((g: string) => g !== url);
      if (proj.logo === url) proj.logo = '';
      if (proj.heroImage === url) proj.heroImage = proj.assetShowcase[0]?.url || '';
    }
    store.customProjects[customIdx] = proj;
  } else {
    const existing = store.projectOverrides[projectId] || {};
    if (isPdf || slotTarget === 'pdf') {
      delete existing.brandGuidelinesPdf;
    } else if (slotTarget === 'logo') {
      delete existing.logo;
      const removed = new Set(existing.removedAssetUrls || []);
      removed.add(url);
      existing.removedAssetUrls = Array.from(removed);
    } else {
      existing.addedAssets = (existing.addedAssets || []).filter((a: any) => a.url !== url);
      existing.addedGallery = (existing.addedGallery || []).filter((g: string) => g !== url);
      if (existing.replacedAssets) {
        for (const [k, v] of Object.entries(existing.replacedAssets)) {
          if ((v as any)?.url === url) {
            delete existing.replacedAssets[k];
            const removedSet = new Set(existing.removedAssetUrls || []);
            removedSet.add(k);
            existing.removedAssetUrls = Array.from(removedSet);
          }
        }
      }
      if (existing.logo === url) delete existing.logo;
      if (existing.heroImage === url) delete existing.heroImage;
      const removed = new Set(existing.removedAssetUrls || []);
      removed.add(url);
      existing.removedAssetUrls = Array.from(removed);
    }
    store.projectOverrides[projectId] = existing;
  }

  tryDeleteUploadedFile(url);

  writeStudioData(store);
  return res.json({ success: true, data: store });
});

// Delete a custom project or clear overrides on a built-in project
app.delete('/api/studio/projects/:id', (req, res) => {
  if (!isAuthorizedStudioRequest(req)) {
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }

  const targetId = req.params.id;
  const store = readStudioData();
  store.customProjects = store.customProjects.filter((c) => c.id !== targetId);
  delete store.projectOverrides[targetId];
  writeStudioData(store);

  return res.json({ success: true, data: store });
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!aiClient,
    timestamp: new Date().toISOString(),
  });
});

const CANONICAL_SITE_URL = 'https://www.pulseocto.com';

const CANONICAL_SLUG_ALLOWLIST: Record<string, string> = {
  'who-we-are': 'who-we-are',
  about: 'who-we-are',
  'the-8-arms': 'the-8-arms',
  'eight-arms': 'the-8-arms',
  arms: 'the-8-arms',
  services: 'services',
  'our-services': 'services',
  portfolio: 'portfolio',
  projects: 'portfolio',
  blog: 'blog',
  insights: 'blog',
  contact: 'contact',
  card: 'card',
  vcard: 'card',
  tarek: 'card',
  ceo: 'card',
  id: 'card',
  'business-card': 'card',
  branding: 'branding',
  'arm-1': 'branding',
  'service-1': 'branding',
  'digital-marketing': 'digital-marketing',
  'arm-2': 'digital-marketing',
  'service-2': 'digital-marketing',
  'web-ecommerce': 'web-ecommerce',
  'arm-3': 'web-ecommerce',
  'service-3': 'web-ecommerce',
  'creative-studio': 'creative-studio',
  'arm-4': 'creative-studio',
  'service-4': 'creative-studio',
  'digital-products': 'digital-products',
  'arm-5': 'digital-products',
  'service-5': 'digital-products',
  'brand-strategy': 'brand-strategy',
  'arm-6': 'brand-strategy',
  'service-6': 'brand-strategy',
  'content-creation': 'content-creation',
  'arm-7': 'content-creation',
  'service-7': 'content-creation',
  'seo-growth': 'seo-growth',
  'arm-8': 'seo-growth',
  'service-8': 'seo-growth',
};

function resolveCanonicalSlugForPath(reqPath: string): string {
  const token = (reqPath || '')
    .split(/[?#]/)[0]
    .replace(/^\/+|\/+$/g, '')
    .trim()
    .toLowerCase();
  if (!token || token === 'home' || token === 'index.html') return '';
  return CANONICAL_SLUG_ALLOWLIST[token] || '';
}

function resolveCanonicalUrlForPath(reqPath: string): string {
  const slug = resolveCanonicalSlugForPath(reqPath);
  return slug ? `${CANONICAL_SITE_URL}/${slug}` : `${CANONICAL_SITE_URL}/`;
}

function injectCanonicalIntoHtml(html: string, reqPath: string): string {
  const canonicalUrl = resolveCanonicalUrlForPath(reqPath);
  return html
    .replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
      `<link rel="canonical" href="${canonicalUrl}" />`
    )
    .replace(
      /<link\s+rel="alternate"\s+hreflang="ar"\s+href="[^"]*"\s*\/?>/i,
      `<link rel="alternate" hreflang="ar" href="${canonicalUrl}" />`
    )
    .replace(
      /<link\s+rel="alternate"\s+hreflang="en"\s+href="[^"]*"\s*\/?>/i,
      `<link rel="alternate" hreflang="en" href="${canonicalUrl}" />`
    )
    .replace(
      /<link\s+rel="alternate"\s+hreflang="x-default"\s+href="[^"]*"\s*\/?>/i,
      `<link rel="alternate" hreflang="x-default" href="${canonicalUrl}" />`
    )
    .replace(
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:url" content="${canonicalUrl}" />`
    )
    .replace(
      /<meta\s+name="twitter:url"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:url" content="${canonicalUrl}" />`
    );
}

// Vite middleware in dev or static serving in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.get('*', async (req, res, next) => {
      if (req.path.startsWith('/api/')) return next();
      // Let 404 pass through for missing static files with extensions
      if (path.extname(req.path) && !req.path.endsWith('.html')) return next();

      try {
        const indexHtmlPath = path.resolve(__dirname, 'index.html');
        let template = fs.readFileSync(indexHtmlPath, 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
        const html = injectCanonicalIntoHtml(template, req.path);
        res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).end(html);
      } catch (err) {
        vite.ssrFixStacktrace(err as Error);
        next(err);
      }
    });
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir, { redirect: false, index: false }));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/')) return next();
      const slug = resolveCanonicalSlugForPath(req.path);
      if (slug) {
        const prerenderedPath = path.join(distDir, slug, 'index.html');
        if (fs.existsSync(prerenderedPath)) {
          const prerenderedHtml = fs.readFileSync(prerenderedPath, 'utf-8');
          return res
            .status(200)
            .set({ 'Content-Type': 'text/html; charset=utf-8' })
            .end(injectCanonicalIntoHtml(prerenderedHtml, req.path));
        }
      }
      const fallbackPath = path.join(distDir, 'index.html');
      if (!fs.existsSync(fallbackPath)) {
        return res
          .status(503)
          .type('text/plain')
          .send('Application build output (dist/index.html) not found. Please run npm run build.');
      }
      const fallbackHtml = fs.readFileSync(fallbackPath, 'utf-8');
      return res
        .status(200)
        .set({ 'Content-Type': 'text/html; charset=utf-8' })
        .end(injectCanonicalIntoHtml(fallbackHtml, req.path));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Pulse OCTO] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
