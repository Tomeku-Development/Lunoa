# Backend API Services - Todolist.md

## Next Priorities (As of July 2025)
- [x] **Blockchain Integration for Quests**:
  - [x] Integrate Aptos SDK for reward distribution in the `verifyQuestCompletion` function.
  - [ ] Begin development of the core `Quest Contract` on Aptos to handle on-chain logic.
- [ ] **Testing**:
  - [x] Write comprehensive integration test for the `verifyQuestCompletion` endpoint.
  - [x] Add tests for the Aptos reward distribution flow.
  - [x] Write tests for `createQuest` endpoint.
  - [x] Write Jest tests for `joinQuest` endpoint.
  - [x] Write tests for `completeQuest` endpoint.
  - [ ] Write tests for `updateQuest` and `deleteQuest` endpoints.
- [x] **User Management**:
  - [x] Implement the core User Management API service endpoints (Profile Get/Update, Follow/Unfollow).
  - [x] Expand the `users` table schema to include profile details and Aptos wallet address.
  - [x] Implement user profile update to support linking an Aptos wallet address.

## Project Setup & Architecture
- [x] Set up Node.js/Express API server with TypeScript
- [x] Configure Aptos SDK integration
- [x] Set up database (PostgreSQL/MongoDB)
- [ ] Configure Redis for caching
- [ ] Set up Docker containers
- [x] Configure environment variables
- [x] Set up logging system (Winston)
- [x] Configure CORS for frontend integration
- [x] Set up API documentation (Swagger/OpenAPI)

## Smart Contract Development

### 1. Core Smart Contracts (Move/Aptos)
- [ ] **Quest Contract**:
  - [ ] Quest creation and management
  - [ ] Quest verification logic
  - [ ] Reward distribution mechanism
  - [ ] Quest completion validation
  - [ ] Quest cancellation/refund logic
- [ ] **Vibe NFT Contract**:
  - [ ] NFT minting functionality
  - [ ] Metadata storage integration
  - [ ] Transfer and trading logic
  - [ ] Royalty distribution
  - [ ] Collection management
- [ ] **Token Contract ($Lunoa)**:
  - [ ] Token minting and burning
  - [ ] Transfer functionality
  - [ ] Staking mechanisms
  - [ ] Governance voting rights
  - [ ] Reward distribution
- [ ] **Feed Group Contract**:
  - [ ] Group creation and management
  - [ ] Member management
  - [ ] Group governance
  - [ ] Shared treasury
  - [ ] Group-specific quests
- [ ] **Boosting Contract**:
  - [ ] Micro-transaction handling
  - [ ] Boost verification
  - [ ] Reward distribution to creators
  - [ ] Boost history tracking
  - [ ] Anti-spam mechanisms

### 2. Contract Deployment & Testing
- [ ] Deploy contracts to Aptos testnet
- [ ] Write comprehensive unit tests
- [ ] Integration testing
- [ ] Gas optimization
- [ ] Security auditing
- [ ] Upgrade mechanisms

## API Development

## 🔐 Authentication API Service

### Auth Endpoints
- [ ] `POST /api/auth/connect` - Wallet connection and signature verification
- [ ] `POST /api/auth/verify` - JWT token verification
- [ ] `POST /api/auth/refresh` - Refresh JWT tokens
- [ ] `POST /api/auth/logout` - Logout and invalidate tokens
- [ ] `GET /api/auth/profile` - Get user profile data
- [ ] `PUT /api/auth/profile` - Update user profile
- [ ] `DELETE /api/auth/account` - Delete user account

### Wallet Management
- [ ] Multi-wallet support (Petra, Martian)
- [ ] Signature verification middleware
- [ ] Session management and JWT tokens
- [ ] Rate limiting for auth endpoints
- [ ] Security headers and CSRF protection

## 👤 User Management API Service

### User Endpoints
- [ ] `GET /api/users/:id` - Get user profile by ID
- [ ] `GET /api/users/:id/stats` - Get user statistics
- [ ] `GET /api/users/:id/achievements` - Get user achievements
- [ ] `GET /api/users/:id/reputation` - Get reputation score
- [ ] `PUT /api/users/:id/settings` - Update user settings
- [ ] `GET /api/users/:id/activity` - Get user activity feed
- [ ] `POST /api/users/:id/follow` - Follow/unfollow user
- [ ] `GET /api/users/:id/followers` - Get user followers
- [ ] `GET /api/users/:id/following` - Get users being followed

### Profile Features
- [ ] Avatar upload and management
- [ ] Bio and social links
- [ ] Privacy settings
- [ ] Achievement tracking
- [ ] Reputation scoring system

## 🎯 Quest Management API Service

### Quest Endpoints
- [x] `POST /api/quests` - Create new quest (businesses/creators)
- [x] `GET /api/quests` - Get all quests (with filtering)
- [x] `GET /api/quests/:id` - Get specific quest details
- [x] `PUT /api/quests/:id` - Update quest (quest owner only)
- [x] `DELETE /api/quests/:id` - Delete quest (quest owner only)
- [x] `POST /api/quests/:id/join` - Join/start a quest
- [x] `POST /api/quests/:id/complete` - Complete quest and claim rewards (DB logic implemented, blockchain reward pending)
- [x] `POST /api/quests/:id/verify` - Verify quest completion (DB logic implemented, blockchain reward pending)
- [x] `GET /api/quests/:id/participants` - Get quest participants
- [x] `GET /api/quests/nearby` - Get nearby quests by location (simplified implementation)

### Quest Discovery & Filtering
- [x] Location-based quest search (simplified implementation)
- [ ] Category filtering (food, culture, events, etc.)
- [ ] Difficulty level filtering
- [ ] Reward amount filtering
- [x] Quest status filtering (active, completed, expired)
- [ ] Search functionality
- [ ] Pagination support

### Quest Analytics
- [ ] `GET /api/quests/:id/analytics` - Quest performance metrics
- [ ] `GET /api/quests/:id/completion-rate` - Quest completion statistics
- [ ] `GET /api/analytics/quests/creator/:userId` - Creator quest analytics

## 🖼️ Vibe NFT API Service

### Vibe NFT Endpoints
- [ ] `POST /api/vibes` - Create and mint new Vibe NFT
- [ ] `GET /api/vibes` - Get all Vibe NFTs (with filtering)
- [ ] `GET /api/vibes/:id` - Get specific Vibe NFT details
- [ ] `PUT /api/vibes/:id` - Update Vibe metadata (owner only)
- [ ] `DELETE /api/vibes/:id` - Delete Vibe NFT (owner only)
- [ ] `POST /api/vibes/:id/boost` - Boost a Vibe NFT
- [ ] `GET /api/vibes/:id/boosts` - Get Vibe boost history
- [ ] `POST /api/vibes/:id/like` - Like/unlike a Vibe
- [ ] `POST /api/vibes/:id/comment` - Comment on a Vibe
- [ ] `GET /api/vibes/:id/comments` - Get Vibe comments
- [ ] `POST /api/vibes/:id/report` - Report inappropriate content

### Vibe Discovery & Collections
- [ ] `GET /api/vibes/user/:userId` - Get user's Vibe collection
- [ ] `GET /api/vibes/location/:lat/:lng` - Get Vibes by location
- [ ] `GET /api/vibes/trending` - Get trending Vibes
- [ ] `GET /api/vibes/recent` - Get recent Vibes
- [ ] `GET /api/vibes/categories` - Get Vibes by category

### Media Upload Service
- [ ] `POST /api/media/upload` - Upload media to IPFS/Arweave
- [ ] `GET /api/media/:hash` - Retrieve media from decentralized storage
- [ ] `DELETE /api/media/:hash` - Remove media (owner only)
- [ ] Image/video processing and optimization
- [ ] Metadata extraction and validation

## 🛒 NFT Marketplace API Service

### Marketplace Endpoints
- [ ] `GET /api/marketplace/vibes` - Browse marketplace NFTs
- [ ] `POST /api/marketplace/list` - List NFT for sale
- [ ] `PUT /api/marketplace/listing/:id` - Update listing
- [ ] `DELETE /api/marketplace/listing/:id` - Cancel listing
- [ ] `POST /api/marketplace/buy/:id` - Purchase NFT
- [ ] `POST /api/marketplace/bid/:id` - Place bid on NFT
- [ ] `GET /api/marketplace/bids/:id` - Get NFT bids
- [ ] `GET /api/marketplace/history/:id` - Get NFT transaction history
- [ ] `GET /api/marketplace/user/:userId/listings` - Get user's listings
- [ ] `GET /api/marketplace/user/:userId/purchases` - Get user's purchases

### Trading Features
- [ ] Price history tracking
- [ ] Auction functionality
- [ ] Bid management
- [ ] Escrow handling
- [ ] Royalty distribution

## 👥 Feed Groups API Service

### Feed Group Endpoints
- [ ] `POST /api/groups` - Create new Feed Group
- [ ] `GET /api/groups` - Get all Feed Groups (with filtering)
- [ ] `GET /api/groups/:id` - Get specific Feed Group details
- [ ] `PUT /api/groups/:id` - Update Feed Group (admin only)
- [ ] `DELETE /api/groups/:id` - Delete Feed Group (admin only)
- [ ] `POST /api/groups/:id/join` - Join Feed Group
- [ ] `POST /api/groups/:id/leave` - Leave Feed Group
- [ ] `GET /api/groups/:id/members` - Get Feed Group members
- [ ] `POST /api/groups/:id/invite` - Invite user to group
- [ ] `POST /api/groups/:id/kick` - Remove member (admin only)

### Group Management
- [ ] `PUT /api/groups/:id/role` - Update member role
- [ ] `GET /api/groups/:id/quests` - Get group-specific quests
- [ ] `POST /api/groups/:id/quests` - Create group quest
- [ ] `GET /api/groups/:id/feed` - Get group activity feed
- [ ] `POST /api/groups/:id/post` - Post to group feed
- [ ] `GET /api/groups/:id/analytics` - Get group analytics

### Group Discovery
- [ ] `GET /api/groups/categories` - Get group categories
- [ ] `GET /api/groups/trending` - Get trending groups
- [ ] `GET /api/groups/nearby` - Get nearby groups by location
- [ ] `GET /api/groups/search` - Search groups by name/description

## 📱 Social Feed API Service

### Social Feed Endpoints
- [ ] `GET /api/feed/timeline` - Get user's personalized timeline
- [ ] `GET /api/feed/global` - Get global activity feed
- [ ] `GET /api/feed/following` - Get feed from followed users
- [ ] `POST /api/feed/post` - Create new feed post
- [ ] `GET /api/feed/post/:id` - Get specific post
- [ ] `PUT /api/feed/post/:id` - Update post (owner only)
- [ ] `DELETE /api/feed/post/:id` - Delete post (owner only)
- [ ] `POST /api/feed/post/:id/like` - Like/unlike post
- [ ] `POST /api/feed/post/:id/comment` - Comment on post
- [ ] `POST /api/feed/post/:id/share` - Share post

### Social Interactions
- [ ] `POST /api/social/follow` - Follow/unfollow user
- [ ] `GET /api/social/followers/:userId` - Get user followers
- [ ] `GET /api/social/following/:userId` - Get following list
- [ ] `GET /api/social/suggestions` - Get follow suggestions
- [ ] `POST /api/social/block` - Block/unblock user
- [ ] `GET /api/social/blocked` - Get blocked users list

## Blockchain Integration

## 🪙 Token Economy API Service

### Token Management Endpoints
- [ ] `GET /api/tokens/balance/:address` - Get token balance
- [ ] `GET /api/tokens/history/:address` - Get transaction history
- [ ] `POST /api/tokens/transfer` - Transfer tokens
- [ ] `POST /api/tokens/stake` - Stake tokens
- [ ] `POST /api/tokens/unstake` - Unstake tokens
- [ ] `GET /api/tokens/staking/:address` - Get staking information
- [ ] `POST /api/tokens/claim-rewards` - Claim staking rewards
- [ ] `GET /api/tokens/rewards/:address` - Get available rewards

### Micro-transaction Services
- [ ] `POST /api/payments/boost` - Process Vibe boost payment
- [ ] `POST /api/payments/quest-sponsor` - Sponsor quest payment
- [ ] `POST /api/payments/subscription` - Handle subscription payments
- [ ] `GET /api/payments/history/:userId` - Get payment history
- [ ] `POST /api/payments/refund` - Process refund request
- [ ] `GET /api/payments/analytics/:userId` - Get payment analytics

### Token Faucet Service
- [ ] `POST /api/faucet/claim` - Claim testnet tokens
- [ ] `GET /api/faucet/status/:address` - Check faucet eligibility
- [ ] `GET /api/faucet/history` - Get faucet distribution history
- [ ] Rate limiting and anti-spam measures
- [ ] IP and wallet address tracking

## ⛓️ Blockchain Integration API Service

### Transaction Management
- [ ] `POST /api/blockchain/transaction` - Submit transaction
- [ ] `GET /api/blockchain/transaction/:hash` - Get transaction status
- [ ] `GET /api/blockchain/gas-estimate` - Estimate gas fees
- [ ] `POST /api/blockchain/batch-transaction` - Submit batch transactions
- [ ] `GET /api/blockchain/network-status` - Get network status

### Smart Contract Interactions
- [ ] `POST /api/contracts/quest/create` - Create quest contract
- [ ] `POST /api/contracts/quest/complete` - Complete quest
- [ ] `POST /api/contracts/nft/mint` - Mint Vibe NFT
- [ ] `POST /api/contracts/group/create` - Create group contract
- [ ] `POST /api/contracts/boost/process` - Process boost payment
- [ ] `GET /api/contracts/events/:contractAddress` - Get contract events

### Event Listening Service
- [ ] Real-time blockchain event monitoring
- [ ] Event processing and database updates
- [ ] Webhook notifications for events
- [ ] Chain reorganization handling
- [ ] Event retry mechanisms

## Decentralized Infrastructure

### 9. Decentralized Storage Integration
- [ ] **IPFS/Arweave Integration**:
  - [ ] Media upload to decentralized storage
  - [ ] Metadata storage
  - [ ] Content addressing
  - [ ] Redundancy and availability
  - [ ] Content retrieval optimization
- [ ] **CDN Management**:
  - [ ] Decentralized content delivery
  - [ ] Geographic distribution
  - [ ] Caching strategies
  - [ ] Performance optimization
  - [ ] Bandwidth monitoring

### 10. AI & Machine Learning
- [ ] **Recommendation Engine**:
  - [ ] User behavior analysis
  - [ ] Quest recommendation algorithm
  - [ ] Location-based suggestions
  - [ ] Content personalization
  - [ ] Model training and updates
- [ ] **Content Moderation**:
  - [ ] Automated content screening
  - [ ] Spam detection
  - [ ] Inappropriate content filtering
  - [ ] Community reporting system
  - [ ] Moderation workflow

## Data Management

### 11. Database Design & Operations
- [ ] **Core Data Models**:
  - [ ] User profiles and authentication
  - [x] Quest and challenge data
  - [ ] Vibe and NFT metadata
  - [ ] Feed group information
  - [ ] Transaction records
- [ ] **Data Optimization**:
  - [ ] Database indexing
  - [ ] Query optimization
  - [ ] Connection pooling
  - [ ] Read replicas
  - [ ] Backup and recovery

### 12. Caching & Performance
- [ ] **Redis Integration**:
  - [ ] Session caching
  - [ ] API response caching
  - [ ] Real-time data caching
  - [ ] Leaderboard caching
  - [ ] Geographic data caching
- [ ] **Performance Optimization**:
  - [ ] API rate limiting
  - [ ] Load balancing
  - [ ] Query optimization
  - [ ] Background job processing
  - [ ] Monitoring and alerting

## Location & Mapping Services

## 🗺️ Location & Mapping API Service

### Location Services
- [ ] `GET /api/location/nearby` - Get nearby points of interest
- [ ] `POST /api/location/geocode` - Convert address to coordinates
- [ ] `POST /api/location/reverse-geocode` - Convert coordinates to address
- [ ] `GET /api/location/validate` - Validate GPS coordinates
- [ ] `POST /api/location/check-in` - Verify location check-in
- [ ] `GET /api/location/distance` - Calculate distance between points
- [ ] `GET /api/location/route` - Get route between locations

### Geospatial Queries
- [ ] `GET /api/geo/quests/radius/:lat/:lng/:radius` - Quests within radius
- [ ] `GET /api/geo/vibes/area/:bounds` - Vibes within area bounds
- [ ] `GET /api/geo/groups/nearby/:lat/:lng` - Nearby groups
- [ ] `GET /api/geo/analytics/heatmap` - Location activity heatmap
- [ ] `GET /api/geo/popular-areas` - Get popular areas

### Map Data Service
- [ ] Custom map tile generation
- [ ] Quest marker clustering
- [ ] Area-based statistics
- [ ] Location-based recommendations
- [ ] Geofencing for quest verification

## 🤖 AI & Recommendation API Service

### AI Recommendation Endpoints
- [ ] `GET /api/ai/recommendations/quests/:userId` - Personalized quest recommendations
- [ ] `GET /api/ai/recommendations/vibes/:userId` - Personalized Vibe recommendations
- [ ] `GET /api/ai/recommendations/groups/:userId` - Group suggestions
- [ ] `GET /api/ai/recommendations/locations/:userId` - Location suggestions
- [ ] `POST /api/ai/feedback` - Submit recommendation feedback

### Content Moderation
- [ ] `POST /api/moderation/scan-content` - Scan content for inappropriate material
- [ ] `POST /api/moderation/report` - Report content for review
- [ ] `GET /api/moderation/queue` - Get moderation queue (admin only)
- [ ] `POST /api/moderation/action` - Take moderation action
- [ ] `GET /api/moderation/history/:contentId` - Get moderation history

### AI Model Management
- [ ] `POST /api/ai/model/train` - Trigger model training
- [ ] `GET /api/ai/model/status` - Get model training status
- [ ] `POST /api/ai/model/deploy` - Deploy trained model
- [ ] `GET /api/ai/model/metrics` - Get model performance metrics

## Security & Compliance

## 📊 Analytics & Reporting API Service

### User Analytics Endpoints
- [ ] `GET /api/analytics/user/:userId/dashboard` - User analytics dashboard
- [ ] `GET /api/analytics/user/:userId/activity` - User activity metrics
- [ ] `GET /api/analytics/user/:userId/earnings` - User earning analytics
- [ ] `GET /api/analytics/user/:userId/engagement` - User engagement metrics
- [ ] `GET /api/analytics/user/:userId/location-heatmap` - User location data

### Business Analytics Endpoints
- [ ] `GET /api/analytics/platform/overview` - Platform-wide analytics
- [ ] `GET /api/analytics/platform/revenue` - Revenue analytics
- [ ] `GET /api/analytics/platform/user-growth` - User growth metrics
- [ ] `GET /api/analytics/platform/quest-performance` - Quest performance metrics
- [ ] `GET /api/analytics/platform/token-circulation` - Token circulation data
- [ ] `GET /api/analytics/platform/geographic` - Geographic distribution

### Real-time Analytics
- [ ] `GET /api/analytics/realtime/active-users` - Active user count
- [ ] `GET /api/analytics/realtime/quest-completions` - Real-time quest completions
- [ ] `GET /api/analytics/realtime/token-transactions` - Real-time token movements
- [ ] `GET /api/analytics/realtime/system-health` - System health metrics

## 🏛️ Governance & DAO API Service

### Governance Endpoints
- [ ] `POST /api/governance/proposal` - Create governance proposal
- [ ] `GET /api/governance/proposals` - Get all proposals
- [ ] `GET /api/governance/proposal/:id` - Get specific proposal
- [ ] `POST /api/governance/vote` - Cast vote on proposal
- [ ] `GET /api/governance/votes/:proposalId` - Get proposal votes
- [ ] `GET /api/governance/voting-power/:address` - Get voting power
- [ ] `POST /api/governance/delegate` - Delegate voting power
- [ ] `GET /api/governance/delegations/:address` - Get delegations

### DAO Treasury Management
- [ ] `GET /api/dao/treasury/balance` - Get treasury balance
- [ ] `GET /api/dao/treasury/transactions` - Get treasury transactions
- [ ] `POST /api/dao/treasury/propose-spend` - Propose treasury spending
- [ ] `GET /api/dao/treasury/proposals` - Get spending proposals
- [ ] `POST /api/dao/treasury/execute` - Execute approved spending

### Community Features
- [ ] `GET /api/community/stats` - Community statistics
- [ ] `GET /api/community/leaderboard` - Community leaderboard
- [ ] `GET /api/community/achievements` - Community achievements
- [ ] `POST /api/community/event` - Create community event
- [ ] `GET /api/community/events` - Get community events

## 🔔 Notification API Service

### Notification Endpoints
- [ ] `GET /api/notifications/:userId` - Get user notifications
- [ ] `POST /api/notifications/mark-read` - Mark notifications as read
- [ ] `PUT /api/notifications/settings` - Update notification settings
- [ ] `POST /api/notifications/subscribe` - Subscribe to push notifications
- [ ] `DELETE /api/notifications/unsubscribe` - Unsubscribe from notifications

### Notification Types
- [ ] Quest completion rewards
- [ ] Vibe NFT boosts received
- [ ] Group invitations and updates
- [ ] Token transactions
- [ ] Social interactions (likes, comments, follows)
- [ ] System announcements
- [ ] Governance proposals

### Push Notification Service
- [ ] Real-time WebSocket notifications
- [ ] Push notification delivery
- [ ] Email notification service
- [ ] SMS notification service (optional)
- [ ] Notification templating system

## 🛡️ Security & Monitoring API Service

### Security Endpoints
- [ ] `POST /api/security/report` - Report security issue
- [ ] `GET /api/security/audit-log` - Get security audit log (admin only)
- [ ] `POST /api/security/block-address` - Block wallet address
- [ ] `GET /api/security/blocked-addresses` - Get blocked addresses
- [ ] `POST /api/security/verify-signature` - Verify wallet signature

### Monitoring Endpoints
- [ ] `GET /api/monitoring/health` - System health check
- [ ] `GET /api/monitoring/metrics` - System metrics
- [ ] `GET /api/monitoring/logs` - Application logs (admin only)
- [ ] `GET /api/monitoring/performance` - Performance metrics
- [ ] `GET /api/monitoring/errors` - Error tracking

### Rate Limiting & Abuse Prevention
- [ ] API rate limiting middleware
- [ ] IP-based request limiting
- [ ] Wallet-based action limiting
- [ ] Spam detection algorithms
- [ ] Automated abuse response

## 🧪 Testing & Development API Service

### Testing Endpoints (Testnet only)
- [ ] `POST /api/test/reset-user/:userId` - Reset user data for testing
- [ ] `POST /api/test/mint-tokens` - Mint test tokens
- [ ] `POST /api/test/create-sample-data` - Create sample quests/vibes
- [ ] `GET /api/test/blockchain-status` - Check blockchain connection
- [ ] `POST /api/test/simulate-quest` - Simulate quest completion

### Development Tools
- [ ] `GET /api/dev/docs` - API documentation
- [ ] `GET /api/dev/schemas` - API schemas
- [ ] `GET /api/dev/status` - API service status
- [ ] `POST /api/dev/seed-data` - Seed database with test data
- [ ] `GET /api/dev/config` - Get API configuration (non-sensitive)