# BlogIn: UML Diagrams

This document provides a set of UML diagrams to illustrate the architecture, user interactions, and data model of the BlogIn application.

## Use Case Diagram

**Description:** This diagram shows the primary actors (User) and their interactions with the system's main features (use cases). It provides a high-level overview of the functionalities available in the application.

```mermaid
graph TD
    User --> SignUp[Sign Up]
    User --> LogIn[Log In]
    User --> LogOut[Log Out]
    User --> ViewPosts[View Posts]
    User --> Search
    User --> CreatePost[Create Post]
    User --> EditPost[Edit Post]
    User --> CommentOnPost[Comment on Post]
    User --> LikePost[Like Post]
    User --> SavePost[Save Post]
    User --> FollowUser[Follow User]
    User --> EditProfile[Edit Profile]
    CreatePost --> GetAICategorySuggestions[Get AI Category Suggestions]
```

## Component Diagram

**Description:** This diagram illustrates the high-level architecture of the application, showing the main components and their dependencies. It highlights the separation between the frontend UI, the AI services, and the simulated data layer.

```mermaid
componentDiagram
    [Next.js Frontend] --> [Genkit AI Flows] : Calls AI for suggestions
    [Next.js Frontend] --> [Data Simulation] : Reads/Writes Data
```

## Sequence Diagram: Create a New Post

**Description:** This sequence diagram details the step-by-step process of a user creating a new blog post. It shows the interactions between the user, the React components, the AI flow for category suggestions, and the data layer.

```mermaid
sequenceDiagram
    participant U as User
    participant PC as PostCreator
    participant SAA as AI Action
    participant G as Genkit Flow
    participant D as Data Layer
    U->>PC: Fills out Title and Content
    U->>PC: Clicks "Suggest Categories"
    PC->>SAA: Calls with post content
    SAA->>G: Executes suggestPostCategory flow
    G-->>SAA: Returns categories
    SAA-->>PC: Returns suggestions
    PC->>U: Displays suggested categories
    U->>PC: Fills out Tags
    U->>PC: Clicks "Publish Post"
    PC->>D: Saves new post
    D-->>PC: Confirms save
    PC->>U: Redirects to new post page
```

## Entity-Relationship Diagram (ERD)

**Description:** This ERD illustrates the data model for the application. It defines the core entities (User, Post, Comment) and the relationships between them, such as a user authoring multiple posts or posts having multiple comments.

```mermaid
erDiagram
    USER {
        string id PK
        string name
        string email
        string avatarUrl
        string bio
    }
    POST {
        string slug PK
        string title
        string content
        string createdAt
        string imageUrl
        string userId FK
    }
    COMMENT {
        string id PK
        string text
        string createdAt
        string userId FK
        string postSlug FK
    }
    USER ||--o{ POST : authors
    USER ||--o{ COMMENT : writes
    POST ||--o{ COMMENT : has
```
