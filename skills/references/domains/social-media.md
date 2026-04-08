# Domain Reference: Social / Media & Content Platforms

Domain-specific knowledge for social and media projects: social networks, content creator platforms, community forums, news and media platforms, newsletter tools, podcast directories, short-video apps, live streaming platforms, fan community products.

---

## 1. /brief — Project Brief

### Domain-specific interview questions
- Platform type: social network (connections/friends), content creator platform (follow model), community forum (topic-based), news/media publisher, newsletter tool, short-video, podcast directory, live streaming?
- Content types: text posts, long-form articles, photos, short video, long video, audio, live streams, newsletters, polls?
- Monetisation: advertising, creator subscriptions, tipping/donations, paid communities, B2B SaaS (newsletter tool), data licensing?
- Moderation model: AI-first with human review, community reporting only, professional moderation team?
- Target audience scale: niche community (thousands), mid-scale (hundreds of thousands), or mass-market (millions)?

### Typical business goals
- Grow DAU/MAU and session length.
- Increase content volume and creator retention (supply side).
- Drive monetisation: ad revenue, creator subscriptions, tipping.
- Build a safe, moderated environment to reduce churn.
- Enable content virality to reduce CAC through organic growth.

### Typical risks
- Content moderation failures: harmful, illegal, or brand-unsafe content.
- Creator churn if monetisation or reach tools are insufficient.
- Algorithm changes reducing organic reach — creator backlash.
- Data privacy issues: GDPR, COPPA (if users may be under 13), data broker regulation.
- Platform dependency risk for creators — regulatory scrutiny if too dominant.
- Spam, bot accounts, and coordinated inauthentic behaviour.

---

## 2. /srs — Requirements Specification

### Domain-specific interview questions
- Roles: casual consumer, active creator, community moderator, admin, advertiser, business account?
- Feed algorithm: chronological, ranked by engagement, interest-based recommendation, or hybrid?
- Creator tools: scheduling, analytics, monetisation dashboard, subscriber management?
- Moderation tools: automated content scoring, hash-matching for known illegal content, report queue, moderator actions?
- Notifications: push, email, in-app — granular per event type?
- Privacy settings: public profile, followers-only, private account?
- Age verification requirements?

### Typical functional areas
- User registration and profile.
- Content creation (post, upload, scheduling).
- Feed and discovery (following feed, explore/trending, recommendations).
- Engagement (likes, reactions, comments, shares, saves, reposts).
- Following / subscription model.
- Notifications (in-app, push, email digests).
- Direct messaging (DMs).
- Search (users, hashtags, content).
- Moderation tools (report, review, action, appeal).
- Creator analytics (reach, impressions, engagement, follower growth).
- Monetisation (ads, subscriptions, tipping, paid posts).
- Admin panel (content queue, user management, platform analytics).

---

## 3. /stories — User Stories

### Domain-specific interview questions
- Content creation flow: draft, preview, schedule, tag, publish — what steps are required?
- Discovery: how does a new user find accounts to follow at onboarding?
- Monetisation flows: how does a creator enable subscriptions? How does a consumer subscribe and pay?
- Moderation: what actions can a moderator take (warn, remove post, suspend account, ban)?

### Typical epics
- Onboarding and Profile Setup.
- Content Creation and Publishing.
- Feed and Discovery.
- Engagement (Likes, Comments, Shares).
- Following and Subscriptions.
- Direct Messaging.
- Notifications.
- Search and Explore.
- Creator Analytics.
- Monetisation (Ads, Subscriptions, Tips).
- Content Moderation.
- Privacy and Safety Controls.
- Admin and Platform Management.

---

## 4. /usecases — Use Cases

### Domain-specific interview questions
- Harmful content flow: who sees a reported post first — automated system or human moderator? What are the escalation levels?
- Copyright: what happens when a DMCA takedown is received?
- Account compromise: how does a user recover a hacked account?
- Creator going live: what happens if a live stream violates community guidelines mid-stream?

### Typical exceptional flows
- Post flagged by automated moderation as potentially harmful — held for human review, creator notified.
- DMCA/copyright takedown request received — content removed within 24h, uploader notified, counter-notice process available.
- User reports a post — report queued for moderation, reporter anonymity preserved.
- Creator live stream flagged — stream paused, moderator review, resume or terminate.
- Account takeover detected (unusual login location/device) — session invalidated, email alert, identity challenge.
- Comment spam detected (bot pattern) — rate limiting applied, account flagged for review.
- Feed recommendation service unavailable — fallback to chronological feed.

---

## 5. /ac — Acceptance Criteria

### Domain-specific interview questions
- Content moderation SLA: how quickly must a reported post be reviewed (for harassment, for illegal content, for copyright)?
- Feed latency: maximum acceptable time to load the first screen of feed content?
- Engagement consistency: what is the expected latency for a like/comment action to be reflected to the user?
- Push notification delivery SLA: what percentage of notifications must be delivered within N seconds?

---

## 6. /nfr — Non-functional Requirements

### Domain-specific interview questions
- Media storage: where is user-uploaded media stored? CDN requirements for global delivery?
- Video transcoding: multiple resolutions (360p, 720p, 1080p)? Who provides transcoding (AWS Elemental, Mux, Cloudinary)?
- Scale: target MAU at launch, 6 months, 12 months?
- Content delivery: CDN for media — global or regional?

### Mandatory NFR categories for Social / Media
- **Feed Performance:** First contentful paint of feed < 1.5s (desktop), < 2.5s (mobile). Feed API response < 200ms at the 95th percentile.
- **Media Delivery:** Images served via CDN with appropriate formats (WebP, AVIF). Video streams must start within 3s on standard connections. CDN cache-hit rate ≥ 90% for popular content.
- **Scalability:** System must handle viral content spikes (10× normal traffic on a single post) without degradation.
- **Content Moderation:** Known illegal content (CSAM, terrorist content) matched and removed automatically within 1 minute. General harmful content reported by users reviewed within 24 hours.
- **Privacy & Compliance:** GDPR-compliant data handling — consent for tracking, right to erasure, data portability. COPPA compliance if platform accessible to under-13s.
- **Availability:** Feed, post creation, and direct messaging: 99.9% SLA. Real-time features (live, DMs): 99.5%.
- **Notification Delivery:** Push notifications delivered to 95% of active devices within 30s of trigger.
- **Security:** All user-generated URLs must be sanitised. Media upload scanned for malware before serving. Rate limiting on all write endpoints.

---

## 7. /datadict — Data Dictionary

### Domain-specific interview questions
- User vs. profile: is a user the auth entity and profile the public-facing entity (separate tables)?
- Feed generation: is feed pre-computed (fan-out on write) or computed on read?
- Engagement counters: are like/comment counts cached separately or computed on-the-fly?
- Soft delete: are posts soft-deleted (important for appeals), or hard-deleted?
- Content versioning: are edited posts versioned?

### Mandatory entities for Social / Media
- **User** — auth record: email/phone, password hash, MFA settings, account status (active, suspended, banned).
- **Profile** — public identity: display name, username/handle, bio, avatar, verified badge, follower count, following count.
- **Post** — content item: type (text, image, video, link, poll, story), body, media references, visibility, status (draft, published, removed), publish timestamp.
- **Media** — uploaded asset: URL, CDN path, type (image, video, audio), dimensions, duration, transcoding status.
- **Comment** — reply to post or other comment: author, body, parent post/comment, status, like count.
- **Reaction / Like** — engagement event: user, target (post or comment), reaction type, timestamp.
- **Follow** — directed relationship: follower, followee, status (active, muted, blocked), created_at.
- **Notification** — in-app event: recipient, type (like, comment, new follower, mention, DM), read status, deep link.
- **DirectMessage** — private message: sender, conversation (DM thread), body, media, read status, sent_at.
- **Conversation** — DM thread: participants, last message, created_at.
- **Report** — content moderation report: reporter, target (post/comment/user), reason code, status, resolution.
- **ModerationAction** — moderator decision: target, action (warn, remove, suspend, ban), moderator, reason, timestamp.
- **Feed** — pre-computed feed entry (fan-out model): user, post, score, inserted_at.
- **Hashtag** — tag entity: name, post count, trending score.
- **CreatorAnalytics** — aggregated stats per creator per period: impressions, reach, engagement rate, follower change, top posts.
- **Subscription** _(paid model)_ — subscriber to creator: subscriber, creator, plan, amount, billing status.

---

## 8. /apicontract — API Contract

### Domain-specific interview questions
- Real-time needs: live comments during streams, notification delivery, DM typing indicators — WebSocket or SSE?
- Media upload: direct upload to CDN/object storage (pre-signed URL pattern), or through the API?
- Feed API: infinite scroll with cursor pagination? Server-sent feed updates?

### Typical endpoint groups
- **Auth** — register, login, refresh token, logout, password reset, MFA.
- **Profiles** — get profile, update profile, follow, unfollow, block, mute, followers list, following list.
- **Posts** — create, edit, delete, get detail, get comments, like, unlike, repost, bookmark.
- **Feed** — get home feed (following), get explore/trending, get creator's posts.
- **Comments** — add comment, delete comment, like comment, get thread.
- **Media** — get pre-signed upload URL, confirm upload, get transcoding status.
- **Search** — search users, search posts/hashtags.
- **Notifications** — get list, mark read, update preferences.
- **Direct Messages** — get conversations, get messages, send message, mark read (WebSocket channel).
- **Moderation** — submit report, get report status, moderator queue (admin), take action (admin).
- **Creator Analytics** — get analytics summary, get post performance, get follower demographics.
- **Monetisation** — get subscription plans, subscribe, get subscriber list, get earnings, process tip.
- **Admin** — user management, content queue, platform metrics.

---

## 9. /wireframes — Wireframe Descriptions

### Domain-specific interview questions
- Core experience: feed-first or profile-first home screen?
- Navigation pattern: bottom tab bar (mobile), left sidebar (desktop), or both?
- Post creation: floating action button, dedicated create screen, or inline composer?
- Dark mode: required from day one or later iteration?

### Typical screens
- **Home Feed** — post cards (author, content, engagement counts, actions), story bar (if applicable), infinite scroll.
- **Explore / Discover** — trending posts, trending hashtags, suggested creators, search bar.
- **Post Detail** — full post, comment thread, engagement actions, share options.
- **Create Post** — content composer (text, media upload, tag, location, schedule, visibility selector).
- **Profile Page** — avatar, bio, follower/following counts, follow button, post grid or list.
- **Notifications** — grouped notification list (today, this week), read/unread states.
- **Direct Messages — Inbox** — conversation list with last message preview, unread count.
- **Direct Messages — Thread** — message bubbles, media sharing, typing indicator.
- **Creator Studio / Analytics** — overview metrics, post performance table, follower chart, top content.
- **Moderation Queue** _(moderator)_ — reported content list, preview, action buttons.
- **Settings — Privacy** — account visibility, who can DM, block list, data export.
- **Subscriptions** _(paid model)_ — creator subscription page, subscriber-only content feed.

---

## Domain Glossary

| Term | Definition |
|------|-----------|
| DAU | Daily Active Users |
| MAU | Monthly Active Users |
| Engagement rate | (Likes + comments + shares) / impressions × 100% |
| Impressions | Number of times content was displayed (including repeats) |
| Reach | Number of unique accounts that saw content |
| UGC | User-Generated Content |
| Creator economy | Economic model where individuals monetise content and audiences directly |
| Fan-out on write | Feed architecture: new post written to each follower's feed at publish time |
| Fan-out on read | Feed architecture: feed assembled from followed accounts at request time |
| Viral coefficient | Average number of new users each existing user recruits |
| Shadowban | Limiting content visibility without notifying the user |
| Hashtag | Metadata tag (#keyword) enabling content discovery by topic |
| Story | Ephemeral content that disappears after 24 hours |
| Repost / Retweet | Sharing another user's post to one's own followers |
| CSAM | Child Sexual Abuse Material — illegal content requiring immediate removal |
| DMCA | Digital Millennium Copyright Act — US law governing online copyright takedowns |
| CDN | Content Delivery Network — distributed servers for fast media delivery |
| Transcoding | Converting uploaded video to multiple resolutions/formats for delivery |
| Chronological feed | Feed ordered by post time (newest first) without algorithmic ranking |
| Algorithmic feed | Feed ranked by predicted user interest score |
