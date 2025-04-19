
# Database Schema Documentation

This directory contains the Prisma schema and migration files for the application database.

## Schema Overview

The database schema includes the following models:

- **User**: Stores user profile information
- **Team**: Stores information about teams
- **Memory**: User-created memories associated with teams
- **Media**: Media files (images, videos, audio) associated with memories
- **Collection**: User-created collections of memories
- **CollectionItem**: Items in a collection
- **Comment**: Comments on memories, collections, or other comments
- **Reaction**: User reactions (likes, etc.) on content
- **Follow**: User follow relationships
- **Notification**: System notifications

## Setup Instructions

### Prerequisites

- Node.js 14+ installed
- PostgreSQL database server running

### Setup Steps

1. Install dependencies if you haven't already:
   ```
   npm install @prisma/client prisma
   ```

2. Run the setup script:
   ```
   node prisma/setup.js
   ```
   This script will:
   - Prompt you for your database connection URL
   - Create a .env file with your database connection
   - Run the initial migration to set up your database schema

3. Generate the Prisma client:
   ```
   npx prisma generate
   ```

4. [Optional] Explore your database with Prisma Studio:
   ```
   npx prisma studio
   ```

### Manual Setup (Alternative)

If you prefer to set up manually:

1. Create a `.env` file in the project root:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/dbname"
   ```

2. Run the migration:
   ```
   npx prisma migrate dev --name init
   ```

3. Generate the Prisma client:
   ```
   npx prisma generate
   ```

## Using the Schema

To work with the database in your application:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Example: Create a new user
async function createUser() {
  const user = await prisma.user.create({
    data: {
      username: 'johndoe',
      email: 'john@example.com',
      profileImage: 'https://example.com/avatar.jpg',
      bio: 'Lorem ipsum dolor sit amet'
    }
  })
  
  console.log(user)
}

// Example: Get all memories for a team
async function getTeamMemories(teamId) {
  const memories = await prisma.memory.findMany({
    where: {
      teamId: teamId,
      visibility: 'public'
    },
    include: {
      user: true,
      media: true
    }
  })
  
  return memories
}
```

## Schema Modifications

If you need to modify the schema:

1. Edit the `schema.prisma` file
2. Run a migration to update your database:
   ```
   npx prisma migrate dev --name describe_your_changes
   ```

## Relationships Explained

The schema includes the following relationships:

- User → Memories: One-to-many
- User → Collections: One-to-many
- Team → Memories: One-to-many
- Memory → Media: One-to-many
- Collection → CollectionItems: One-to-many
- Memory → CollectionItems: One-to-many
- User → Comments: One-to-many
- Memory/Collection → Comments: One-to-many
- Comment → Comments (replies): One-to-many
- User → Reactions: One-to-many
- Memory/Collection/Comment → Reactions: One-to-many
- User → Follows (as follower): One-to-many
- User → Follows (as followed): One-to-many
- User → Notifications: One-to-many
