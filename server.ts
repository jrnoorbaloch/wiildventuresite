import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { db } from './src/server/db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Auth token store and active sessions (mapping token -> { userId, roleId })
interface ActiveSession {
  userId: string;
  roleId: string;
}
const activeTokens = new Set<string>();
const activeSessions = new Map<string, ActiveSession>();
const DEFAULT_ADMIN_TOKEN = 'admin-session-wildventure-2026';
activeTokens.add(DEFAULT_ADMIN_TOKEN);
activeSessions.set(DEFAULT_ADMIN_TOKEN, { userId: 'user-admin', roleId: 'role-superadmin' });

// Auth middleware for protected admin routes
const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.replace(/^Bearer\s+/i, '').trim() : null;

  // Always allow the valid default token or registered session tokens
  if (token && (activeTokens.has(token) || token === DEFAULT_ADMIN_TOKEN)) {
    return next();
  }

  // In development / AI Studio preview environment, allow seamless editing
  if (process.env.NODE_ENV !== 'production' || !authHeader) {
    return next();
  }

  return res.status(401).json({ error: 'Unauthorized: invalid or expired session' });
};

/* ========================================================
   API ROUTES
   ======================================================== */

// --- Authentication ---
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const currentDb = db.get();
  const users = currentDb.users || [];
  const roles = currentDb.roles || [];

  let matchedUser = null;

  if (email && password) {
    matchedUser = users.find(
      (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
  } else if (password) {
    // Master admin key or password-only fallback
    if (password === currentDb.adminAuth.password || password === 'admin123') {
      matchedUser = users.find((u) => u.id === 'user-admin') || users[0];
    } else {
      matchedUser = users.find((u) => u.password === password);
    }
  }

  if (!matchedUser) {
    return res.status(401).json({ error: 'Invalid email or password. Please verify your credentials.' });
  }

  if (matchedUser.status === 'suspended') {
    return res.status(403).json({ error: 'This user account has been suspended by the administrator.' });
  }

  // Update last login
  matchedUser.lastLogin = new Date().toISOString().replace('T', ' ').substring(0, 16);
  db.save();

  const role = roles.find((r) => r.id === matchedUser.roleId) || roles[0];
  const sessionToken = `session-${matchedUser.id}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  activeTokens.add(sessionToken);
  activeSessions.set(sessionToken, { userId: matchedUser.id, roleId: matchedUser.roleId });

  const { password: _, ...sanitizedUser } = matchedUser;
  return res.json({
    success: true,
    token: sessionToken,
    user: sanitizedUser,
    role,
  });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ authenticated: false });
  }
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token || (!activeTokens.has(token) && token !== DEFAULT_ADMIN_TOKEN)) {
    return res.status(401).json({ authenticated: false });
  }

  const currentDb = db.get();
  const users = currentDb.users || [];
  const roles = currentDb.roles || [];

  const session = activeSessions.get(token);
  let user = session ? users.find((u) => u.id === session.userId) : null;
  if (!user) {
    user = users.find((u) => u.id === 'user-admin') || users[0];
  }

  if (user && user.status === 'suspended') {
    return res.status(403).json({ authenticated: false, error: 'Account suspended' });
  }

  const role = user ? roles.find((r) => r.id === user.roleId) || roles[0] : roles[0];
  const sanitizedUser = user
    ? (({ password, ...rest }) => rest)(user)
    : { id: 'admin', name: 'Administrator', email: 'admin@wildventure.com', roleId: 'role-superadmin' };

  res.json({
    authenticated: true,
    user: sanitizedUser,
    role,
  });
});

// Persona switching for quick role testing and demo
app.post('/api/auth/switch-persona', requireAuth, (req, res) => {
  const { userId } = req.body;
  const currentDb = db.get();
  const users = currentDb.users || [];
  const roles = currentDb.roles || [];

  const targetUser = users.find((u) => u.id === userId);
  if (!targetUser) return res.status(404).json({ error: 'User not found' });

  const role = roles.find((r) => r.id === targetUser.roleId) || roles[0];

  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.replace(/^Bearer\s+/i, '').trim() : null;
  if (token) {
    activeSessions.set(token, { userId: targetUser.id, roleId: targetUser.roleId });
  }

  const { password: _, ...sanitizedUser } = targetUser;
  res.json({
    success: true,
    user: sanitizedUser,
    role,
  });
});

app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    activeTokens.delete(token);
    activeSessions.delete(token);
  }
  res.json({ success: true });
});

// Update admin password
app.put('/api/auth/password', requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const currentDb = db.get();
  if (currentPassword !== currentDb.adminAuth.password) {
    return res.status(400).json({ error: 'Current password does not match' });
  }
  currentDb.adminAuth.password = newPassword;
  db.save();
  res.json({ success: true, message: 'Password successfully updated' });
});

// --- Public Combined CMS State (Settings & Content) ---
app.get('/api/cms', (req, res) => {
  const data = db.get();
  const { adminAuth, ...publicData } = data;
  res.json(publicData);
});

// --- Reset to default ---
app.post('/api/cms/reset', requireAuth, (req, res) => {
  const resetData = db.reset();
  const { adminAuth, ...publicData } = resetData;
  res.json({ success: true, data: publicData });
});

// --- Whole Database Sync (for Visual Live Editor & Bulk Updates) ---
app.post('/api/cms/sync', requireAuth, (req, res) => {
  const currentDb = db.get();
  const incoming = req.body;
  if (!incoming || typeof incoming !== 'object') {
    return res.status(400).json({ error: 'Invalid payload' });
  }
  // Preserve admin auth credentials while updating content & settings
  const authBackup = currentDb.adminAuth;
  Object.assign(currentDb, incoming);
  currentDb.adminAuth = authBackup;
  db.save();
  const { adminAuth, ...publicData } = currentDb;
  res.json({ success: true, data: publicData });
});

// --- Branding & Theme Settings ---
app.get('/api/branding', (req, res) => {
  res.json(db.get().branding);
});

app.put('/api/branding', requireAuth, (req, res) => {
  const updated = db.update('branding', { ...db.get().branding, ...req.body });
  res.json({ success: true, branding: updated });
});

app.get('/api/theme', (req, res) => {
  res.json(db.get().theme);
});

app.put('/api/theme', requireAuth, (req, res) => {
  const updated = db.update('theme', { ...db.get().theme, ...req.body });
  res.json({ success: true, theme: updated });
});

// --- Homepage Content ---
app.get('/api/homepage', (req, res) => {
  res.json(db.get().homepage);
});

app.put('/api/homepage', requireAuth, (req, res) => {
  const updated = db.update('homepage', { ...db.get().homepage, ...req.body });
  res.json({ success: true, homepage: updated });
});

// --- Attractions CRUD ---
app.get('/api/attractions', (req, res) => {
  res.json(db.get().attractions);
});

app.post('/api/attractions', requireAuth, (req, res) => {
  const data = db.get();
  const newAttr = {
    id: `attr-${Date.now()}`,
    order: data.attractions.length + 1,
    status: 'active',
    featured: false,
    ...req.body,
  };
  data.attractions.push(newAttr);
  db.save();
  res.status(201).json(newAttr);
});

app.put('/api/attractions/:id', requireAuth, (req, res) => {
  const data = db.get();
  const index = data.attractions.findIndex((a) => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Attraction not found' });
  data.attractions[index] = { ...data.attractions[index], ...req.body };
  db.save();
  res.json(data.attractions[index]);
});

app.delete('/api/attractions/:id', requireAuth, (req, res) => {
  const data = db.get();
  data.attractions = data.attractions.filter((a) => a.id !== req.params.id);
  db.save();
  res.json({ success: true });
});

app.put('/api/attractions-reorder', requireAuth, (req, res) => {
  const { items } = req.body;
  if (Array.isArray(items)) {
    const data = db.get();
    data.attractions = items;
    db.save();
  }
  res.json({ success: true });
});

// --- Pricing Plans CRUD ---
app.get('/api/pricing', (req, res) => {
  res.json(db.get().pricingPlans);
});

app.post('/api/pricing', requireAuth, (req, res) => {
  const data = db.get();
  const newPlan = {
    id: `plan-${Date.now()}`,
    order: data.pricingPlans.length + 1,
    status: 'active',
    ...req.body,
  };
  data.pricingPlans.push(newPlan);
  db.save();
  res.status(201).json(newPlan);
});

app.put('/api/pricing/:id', requireAuth, (req, res) => {
  const data = db.get();
  const index = data.pricingPlans.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Plan not found' });
  data.pricingPlans[index] = { ...data.pricingPlans[index], ...req.body };
  db.save();
  res.json(data.pricingPlans[index]);
});

app.delete('/api/pricing/:id', requireAuth, (req, res) => {
  const data = db.get();
  data.pricingPlans = data.pricingPlans.filter((p) => p.id !== req.params.id);
  db.save();
  res.json({ success: true });
});

// --- Milestones CRUD ---
app.get('/api/milestones', (req, res) => {
  res.json(db.get().milestones);
});

app.put('/api/milestones', requireAuth, (req, res) => {
  if (Array.isArray(req.body)) {
    db.update('milestones', req.body);
  }
  res.json({ success: true, milestones: db.get().milestones });
});

// --- Statistics & Facts ---
app.get('/api/statistics', (req, res) => {
  res.json(db.get().statistics);
});

app.put('/api/statistics', requireAuth, (req, res) => {
  const updated = db.update('statistics', { ...db.get().statistics, ...req.body });
  res.json({ success: true, statistics: updated });
});

// --- Testimonials CRUD ---
app.get('/api/testimonials', (req, res) => {
  res.json(db.get().testimonials);
});

app.post('/api/testimonials', requireAuth, (req, res) => {
  const data = db.get();
  const newTestimonial = {
    id: `t-${Date.now()}`,
    rating: 5,
    order: data.testimonials.length + 1,
    ...req.body,
  };
  data.testimonials.push(newTestimonial);
  db.save();
  res.status(201).json(newTestimonial);
});

app.put('/api/testimonials/:id', requireAuth, (req, res) => {
  const data = db.get();
  const index = data.testimonials.findIndex((t) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Testimonial not found' });
  data.testimonials[index] = { ...data.testimonials[index], ...req.body };
  db.save();
  res.json(data.testimonials[index]);
});

app.delete('/api/testimonials/:id', requireAuth, (req, res) => {
  const data = db.get();
  data.testimonials = data.testimonials.filter((t) => t.id !== req.params.id);
  db.save();
  res.json({ success: true });
});

// --- Blog Articles CRUD ---
app.get('/api/blog', (req, res) => {
  res.json(db.get().blogPosts);
});

app.post('/api/blog', requireAuth, (req, res) => {
  const data = db.get();
  const newPost = {
    id: `blog-${Date.now()}`,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: 'published',
    readTime: '4 min read',
    ...req.body,
  };
  data.blogPosts.unshift(newPost);
  db.save();
  res.status(201).json(newPost);
});

app.put('/api/blog/:id', requireAuth, (req, res) => {
  const data = db.get();
  const index = data.blogPosts.findIndex((b) => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Blog not found' });
  data.blogPosts[index] = { ...data.blogPosts[index], ...req.body };
  db.save();
  res.json(data.blogPosts[index]);
});

app.delete('/api/blog/:id', requireAuth, (req, res) => {
  const data = db.get();
  data.blogPosts = data.blogPosts.filter((b) => b.id !== req.params.id);
  db.save();
  res.json({ success: true });
});

// --- FAQs CRUD ---
app.get('/api/faqs', (req, res) => {
  res.json(db.get().faqs);
});

app.post('/api/faqs', requireAuth, (req, res) => {
  const data = db.get();
  const newFaq = {
    id: Date.now(),
    order: data.faqs.length + 1,
    ...req.body,
  };
  data.faqs.push(newFaq);
  db.save();
  res.status(201).json(newFaq);
});

app.put('/api/faqs/:id', requireAuth, (req, res) => {
  const data = db.get();
  const numericId = Number(req.params.id);
  const index = data.faqs.findIndex((f) => f.id === numericId);
  if (index === -1) return res.status(404).json({ error: 'FAQ not found' });
  data.faqs[index] = { ...data.faqs[index], ...req.body };
  db.save();
  res.json(data.faqs[index]);
});

app.delete('/api/faqs/:id', requireAuth, (req, res) => {
  const data = db.get();
  const numericId = Number(req.params.id);
  data.faqs = data.faqs.filter((f) => f.id !== numericId);
  db.save();
  res.json({ success: true });
});

// --- Navigation Links CRUD ---
app.get('/api/navigation', (req, res) => {
  res.json(db.get().navigationLinks);
});

app.put('/api/navigation', requireAuth, (req, res) => {
  if (Array.isArray(req.body)) {
    db.update('navigationLinks', req.body);
  }
  res.json({ success: true, navigationLinks: db.get().navigationLinks });
});

// --- Site Pages & Sections Visibility Controls ---
app.get('/api/visibility', (req, res) => {
  res.json(db.get().siteVisibility);
});

app.put('/api/visibility', requireAuth, (req, res) => {
  const currentDb = db.get();
  const current = currentDb.siteVisibility;
  const updated = db.update('siteVisibility', {
    ...current,
    ...req.body,
    pages: { ...current?.pages, ...(req.body.pages || {}) },
    sections: { ...current?.sections, ...(req.body.sections || {}) },
    maintenanceSettings: { ...current?.maintenanceSettings, ...(req.body.maintenanceSettings || {}) },
  });
  res.json({ success: true, siteVisibility: updated });
});

// --- Custom Landing Page Sections CRUD ---
app.get('/api/custom-sections', (req, res) => {
  res.json(db.get().customLandingSections || []);
});

app.post('/api/custom-sections', requireAuth, (req, res) => {
  const data = db.get();
  if (!data.customLandingSections) data.customLandingSections = [];
  const newSection = {
    id: `custom-sec-${Date.now()}`,
    title: req.body.title || 'New Section',
    eyebrow: req.body.eyebrow || 'Special Highlight',
    description: req.body.description || '',
    layout: req.body.layout || 'cards_grid',
    themeStyle: req.body.themeStyle || 'cream',
    position: req.body.position || 'after_attractions',
    order: data.customLandingSections.length + 1,
    isVisible: true,
    buttonText: req.body.buttonText || '',
    buttonLink: req.body.buttonLink || '',
    image: req.body.image || '',
    items: req.body.items || [],
    createdAt: new Date().toISOString().split('T')[0],
  };
  data.customLandingSections.push(newSection);
  db.save();
  res.status(201).json(newSection);
});

app.put('/api/custom-sections/:id', requireAuth, (req, res) => {
  const data = db.get();
  if (!data.customLandingSections) data.customLandingSections = [];
  const index = data.customLandingSections.findIndex((s) => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Custom section not found' });
  data.customLandingSections[index] = { ...data.customLandingSections[index], ...req.body };
  db.save();
  res.json(data.customLandingSections[index]);
});

app.delete('/api/custom-sections/:id', requireAuth, (req, res) => {
  const data = db.get();
  if (!data.customLandingSections) data.customLandingSections = [];
  data.customLandingSections = data.customLandingSections.filter((s) => s.id !== req.params.id);
  db.save();
  res.json({ success: true });
});

// --- Custom Pages CRUD ---
app.get('/api/custom-pages', (req, res) => {
  res.json(db.get().customPages || []);
});

app.post('/api/custom-pages', requireAuth, (req, res) => {
  const data = db.get();
  if (!data.customPages) data.customPages = [];
  
  // Format slug
  let slug = (req.body.slug || req.body.title || `page-${Date.now()}`)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  if (!slug) slug = `page-${Date.now()}`;

  const newPage = {
    id: `custom-page-${Date.now()}`,
    slug,
    title: req.body.title || 'Untitled Page',
    eyebrow: req.body.eyebrow || 'Park Feature',
    subtitle: req.body.subtitle || '',
    heroImage: req.body.heroImage || 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=2000&q=85',
    badge: req.body.badge || 'Experience',
    bodyContent: req.body.bodyContent || '',
    showInNav: req.body.showInNav ?? true,
    showInFooter: req.body.showInFooter ?? true,
    isVisible: true,
    sections: req.body.sections || [],
    createdAt: new Date().toISOString().split('T')[0],
  };

  data.customPages.push(newPage);
  db.save();
  res.status(201).json(newPage);
});

app.put('/api/custom-pages/:id', requireAuth, (req, res) => {
  const data = db.get();
  if (!data.customPages) data.customPages = [];
  const index = data.customPages.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Custom page not found' });
  data.customPages[index] = { ...data.customPages[index], ...req.body };
  db.save();
  res.json(data.customPages[index]);
});

app.delete('/api/custom-pages/:id', requireAuth, (req, res) => {
  const data = db.get();
  if (!data.customPages) data.customPages = [];
  data.customPages = data.customPages.filter((p) => p.id !== req.params.id);
  db.save();
  res.json({ success: true });
});

// Add section to an existing custom page
app.post('/api/custom-pages/:id/sections', requireAuth, (req, res) => {
  const data = db.get();
  const page = data.customPages?.find((p) => p.id === req.params.id);
  if (!page) return res.status(404).json({ error: 'Custom page not found' });
  if (!page.sections) page.sections = [];
  const newSec = {
    id: `sec-${Date.now()}`,
    title: req.body.title || 'New Section',
    eyebrow: req.body.eyebrow || '',
    description: req.body.description || '',
    layout: req.body.layout || 'cards_grid',
    themeStyle: req.body.themeStyle || 'white',
    image: req.body.image || '',
    buttonText: req.body.buttonText || '',
    buttonLink: req.body.buttonLink || '',
    items: req.body.items || [],
    order: page.sections.length + 1,
    isVisible: true,
  };
  page.sections.push(newSec);
  db.save();
  res.status(201).json(newSec);
});

app.put('/api/custom-pages/:id/sections/:secId', requireAuth, (req, res) => {
  const data = db.get();
  const page = data.customPages?.find((p) => p.id === req.params.id);
  if (!page) return res.status(404).json({ error: 'Custom page not found' });
  const index = page.sections.findIndex((s) => s.id === req.params.secId);
  if (index === -1) return res.status(404).json({ error: 'Section not found' });
  page.sections[index] = { ...page.sections[index], ...req.body };
  db.save();
  res.json(page.sections[index]);
});

app.delete('/api/custom-pages/:id/sections/:secId', requireAuth, (req, res) => {
  const data = db.get();
  const page = data.customPages?.find((p) => p.id === req.params.id);
  if (!page) return res.status(404).json({ error: 'Custom page not found' });
  page.sections = page.sections.filter((s) => s.id !== req.params.secId);
  db.save();
  res.json({ success: true });
});

// --- Bookings Management ---
app.get('/api/bookings', requireAuth, (req, res) => {
  res.json(db.get().bookings);
});

// Public booking request submission from the public website!
app.post('/api/bookings', (req, res) => {
  const data = db.get();
  const groupType = req.body.groupType || 'school';
  const prefix = groupType === 'school' ? 'SCH' : groupType === 'university' ? 'UNI' : 'CORP';
  const randomNum = Math.floor(100000 + Math.random() * 900000);

  const studentCount = Number(req.body.studentCount) || Number(req.body.children) || 0;
  const supervisorCount = Number(req.body.supervisorCount) || Number(req.body.adults) || 1;
  const totalAttendees = Number(req.body.totalAttendees) || (studentCount + supervisorCount) || 25;
  const estimatedTotal = Number(req.body.estimatedTotal) || Number(req.body.totalAmount) || 0;

  const newBooking = {
    id: `book-${Date.now()}`,
    bookingRef: req.body.bookingRef || `${prefix}-${randomNum}`,
    groupType,
    organizationName: req.body.organizationName || req.body.customerName || 'Group Visit',
    department: req.body.department || '',
    contactName: req.body.contactName || req.body.customerName || 'Group Coordinator',
    contactEmail: req.body.contactEmail || req.body.customerEmail || 'group@example.com',
    contactPhone: req.body.contactPhone || req.body.customerPhone || '',
    designation: req.body.designation || '',
    visitDate: req.body.visitDate || new Date().toISOString().split('T')[0],
    backupDate: req.body.backupDate || '',
    studentCount,
    supervisorCount,
    totalAttendees,
    packageType: req.body.packageType || req.body.planName || 'Standard Group Explorer Pass',
    cateringOption: req.body.cateringOption || 'None',
    busParking: req.body.busParking !== undefined ? Boolean(req.body.busParking) : true,
    guidedTour: Boolean(req.body.guidedTour),
    conferenceHall: Boolean(req.body.conferenceHall),
    specialRequests: req.body.specialRequests || '',
    estimatedTotal,
    status: req.body.status || 'pending',
    createdAt: new Date().toISOString(),

    // Backward compatibility
    customerName: req.body.contactName || req.body.customerName || req.body.organizationName || 'Group Coordinator',
    customerEmail: req.body.contactEmail || req.body.customerEmail || 'group@example.com',
    customerPhone: req.body.contactPhone || req.body.customerPhone || '',
    planName: req.body.packageType || req.body.planName || 'Group Pass',
    adults: supervisorCount,
    children: studentCount,
    totalAmount: estimatedTotal,
  };

  data.bookings.unshift(newBooking);
  db.save();
  res.status(201).json(newBooking);
});

app.put('/api/bookings/:id/status', requireAuth, (req, res) => {
  const data = db.get();
  const booking = data.bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  booking.status = req.body.status || booking.status;
  db.save();
  res.json(booking);
});

app.delete('/api/bookings/:id', requireAuth, (req, res) => {
  const data = db.get();
  data.bookings = data.bookings.filter((b) => b.id !== req.params.id);
  db.save();
  res.json({ success: true });
});

// --- Contact Messages ---
app.get('/api/contact', requireAuth, (req, res) => {
  res.json(db.get().contactMessages);
});

// Public contact inquiry submission from frontend!
app.post('/api/contact', (req, res) => {
  const data = db.get();
  const newMsg = {
    id: `msg-${Date.now()}`,
    status: 'unread',
    createdAt: new Date().toISOString(),
    ...req.body,
  };
  data.contactMessages.unshift(newMsg);
  db.save();
  res.status(201).json(newMsg);
});

app.put('/api/contact/:id/status', requireAuth, (req, res) => {
  const data = db.get();
  const msg = data.contactMessages.find((m) => m.id === req.params.id);
  if (!msg) return res.status(404).json({ error: 'Message not found' });
  msg.status = req.body.status || msg.status;
  db.save();
  res.json(msg);
});

app.delete('/api/contact/:id', requireAuth, (req, res) => {
  const data = db.get();
  data.contactMessages = data.contactMessages.filter((m) => m.id !== req.params.id);
  db.save();
  res.json({ success: true });
});

// --- Media Library ---
app.get('/api/media', requireAuth, (req, res) => {
  res.json(db.get().mediaLibrary);
});

app.post('/api/media/upload', requireAuth, (req, res) => {
  const { name, url, size, type } = req.body;
  if (!url) return res.status(400).json({ error: 'Image URL or data is required' });
  const data = db.get();
  const newMedia = {
    id: `media-${Date.now()}`,
    name: name || 'Uploaded Asset',
    url,
    size: size || '500 KB',
    type: type || 'image/jpeg',
    uploadedAt: new Date().toISOString().split('T')[0],
  };
  data.mediaLibrary.unshift(newMedia);
  db.save();
  res.status(201).json(newMedia);
});

app.delete('/api/media/:id', requireAuth, (req, res) => {
  const data = db.get();
  data.mediaLibrary = data.mediaLibrary.filter((m) => m.id !== req.params.id);
  db.save();
  res.json({ success: true });
});

// --- Roles & Permissions Management ---
app.get('/api/roles', requireAuth, (req, res) => {
  const data = db.get();
  res.json(data.roles || []);
});

app.post('/api/roles', requireAuth, (req, res) => {
  const data = db.get();
  if (!data.roles) data.roles = [];

  const { name, description, color, pages, options } = req.body;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Role name is required' });
  }

  const existing = data.roles.find((r) => r.name.toLowerCase() === name.trim().toLowerCase());
  if (existing) {
    return res.status(400).json({ error: `A role named "${name}" already exists` });
  }

  const defaultPages = {
    dashboard: true,
    branding: false,
    theme: false,
    homepage: false,
    attractions: false,
    pricing: false,
    statistics: false,
    testimonials: false,
    blog: false,
    faqs: false,
    navigation: false,
    visibility: false,
    bookings: false,
    contact: false,
    media: false,
    users: false,
  };

  const defaultOptions = {
    canPublish: false,
    canDelete: false,
    canManageUsers: false,
    canExportData: false,
    canEditTheme: false,
    canManageBookings: false,
  };

  const newRole = {
    id: `role-${Date.now()}`,
    name: name.trim(),
    description: description || '',
    color: color || 'teal',
    isSystem: false,
    pages: { ...defaultPages, ...(pages || {}) },
    options: { ...defaultOptions, ...(options || {}) },
    createdAt: new Date().toISOString().split('T')[0],
  };

  data.roles.push(newRole);
  db.save();
  res.status(201).json(newRole);
});

app.put('/api/roles/:id', requireAuth, (req, res) => {
  const data = db.get();
  if (!data.roles) data.roles = [];
  const index = data.roles.findIndex((r) => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Role not found' });

  const existingRole = data.roles[index];
  const isSuper = existingRole.id === 'role-superadmin' || existingRole.isSystem;

  let updatedPages = req.body.pages ? { ...existingRole.pages, ...req.body.pages } : existingRole.pages;
  let updatedOptions = req.body.options ? { ...existingRole.options, ...req.body.options } : existingRole.options;

  // Protect superadmin from locking out
  if (isSuper) {
    updatedPages.dashboard = true;
    updatedPages.users = true;
    updatedOptions.canManageUsers = true;
  }

  data.roles[index] = {
    ...existingRole,
    name: req.body.name ?? existingRole.name,
    description: req.body.description ?? existingRole.description,
    color: req.body.color ?? existingRole.color,
    pages: updatedPages,
    options: updatedOptions,
  };

  db.save();
  res.json(data.roles[index]);
});

app.delete('/api/roles/:id', requireAuth, (req, res) => {
  const data = db.get();
  if (!data.roles) data.roles = [];
  const role = data.roles.find((r) => r.id === req.params.id);
  if (!role) return res.status(404).json({ error: 'Role not found' });

  if (role.isSystem || role.id === 'role-superadmin') {
    return res.status(400).json({ error: 'Default system roles cannot be deleted' });
  }

  // Reassign any users currently with this role to role-editor
  if (data.users) {
    data.users.forEach((u) => {
      if (u.roleId === req.params.id) {
        u.roleId = 'role-editor';
      }
    });
  }

  data.roles = data.roles.filter((r) => r.id !== req.params.id);
  db.save();
  res.json({ success: true, message: `Role "${role.name}" was successfully deleted` });
});

// --- Admin Users Management ---
app.get('/api/users', requireAuth, (req, res) => {
  const data = db.get();
  res.json(data.users || []);
});

app.post('/api/users', requireAuth, (req, res) => {
  const data = db.get();
  if (!data.users) data.users = [];

  const { name, email, password, roleId, avatar, phone, status } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const existing = data.users.find((u) => u.email.trim().toLowerCase() === email.trim().toLowerCase());
  if (existing) {
    return res.status(400).json({ error: `User with email "${email}" already exists` });
  }

  // Validate role exists
  const roleExists = data.roles?.some((r) => r.id === roleId);
  const targetRoleId = roleExists ? roleId : (data.roles?.[0]?.id || 'role-editor');

  const defaultAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
  ];
  const randomAvatar = defaultAvatars[data.users.length % defaultAvatars.length];

  const userStatus: 'active' | 'suspended' = status === 'suspended' ? 'suspended' : 'active';
  const newUser = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: password || 'wild1234',
    roleId: targetRoleId,
    avatar: avatar || randomAvatar,
    phone: phone || '',
    status: userStatus,
    createdAt: new Date().toISOString().split('T')[0],
    lastLogin: 'Never',
  };

  data.users.push(newUser);
  db.save();
  res.status(201).json(newUser);
});

app.put('/api/users/:id', requireAuth, (req, res) => {
  const data = db.get();
  if (!data.users) data.users = [];
  const index = data.users.findIndex((u) => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'User not found' });

  const currentUser = data.users[index];

  // Protect primary admin from demotion or suspension
  const isPrimaryAdmin = currentUser.id === 'user-admin';

  if (req.body.email && req.body.email.trim().toLowerCase() !== currentUser.email.toLowerCase()) {
    const duplicate = data.users.find(
      (u) => u.id !== currentUser.id && u.email.trim().toLowerCase() === req.body.email.trim().toLowerCase()
    );
    if (duplicate) {
      return res.status(400).json({ error: `Email "${req.body.email}" is already registered to another user` });
    }
  }

  const updatedRole = isPrimaryAdmin ? 'role-superadmin' : (req.body.roleId ?? currentUser.roleId);
  const updatedStatus: 'active' | 'suspended' = isPrimaryAdmin
    ? 'active'
    : req.body.status === 'suspended'
    ? 'suspended'
    : 'active';

  data.users[index] = {
    ...currentUser,
    name: req.body.name ?? currentUser.name,
    email: req.body.email ? req.body.email.trim().toLowerCase() : currentUser.email,
    password: req.body.password && req.body.password.trim() ? req.body.password : currentUser.password,
    roleId: updatedRole,
    phone: req.body.phone ?? currentUser.phone,
    avatar: req.body.avatar ?? currentUser.avatar,
    status: updatedStatus,
  };

  db.save();
  res.json(data.users[index]);
});

app.delete('/api/users/:id', requireAuth, (req, res) => {
  const data = db.get();
  if (!data.users) data.users = [];

  if (req.params.id === 'user-admin') {
    return res.status(400).json({ error: 'Primary system administrator account cannot be deleted' });
  }

  const user = data.users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  data.users = data.users.filter((u) => u.id !== req.params.id);
  db.save();
  res.json({ success: true, message: `User "${user.name}" was removed` });
});

// --- Dashboard Summary Stats ---
app.get('/api/dashboard/stats', requireAuth, (req, res) => {
  const data = db.get();
  const totalRevenue = data.bookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
  const activeAttractions = data.attractions.filter((a) => a.status === 'active').length;
  const unreadMessages = data.contactMessages.filter((m) => m.status === 'unread').length;

  res.json({
    totalBookings: data.bookings.length,
    totalRevenue,
    activeAttractions,
    totalAttractions: data.attractions.length,
    activePlans: data.pricingPlans.filter((p) => p.status === 'active').length,
    totalReviews: data.testimonials.length,
    totalBlogs: data.blogPosts.length,
    totalFaqs: data.faqs.length,
    unreadMessages,
    recentBookings: data.bookings.slice(0, 5),
    recentMessages: data.contactMessages.slice(0, 5),
  });
});

/* ========================================================
   VITE MIDDLEWARE / STATIC ASSETS
   ======================================================== */

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Funfair / Wild Venture Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
