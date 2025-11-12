# BlogIn: UML Diagrams

This document provides a set of UML diagrams to illustrate the architecture, user interactions, and data model of the BlogIn application.

## Use Case Diagram

**Description:** This diagram shows the primary actors (User) and their interactions with the system's main features (use cases). It provides a high-level overview of the functionalities available in the application.

```mermaid
graph TD
    A(User) --> (Sign Up)
    A --> (Log In)
    A --> (Log Out)
    A --> (View Posts)
    A --> (Search)

    subgraph "Authenticated User"
        A --> (Create Post)
        A --> (Edit Post)
        A --> (Comment on Post)
        A --> (Like Post)
        A --> (Save Post)
        A --> (Follow User)
        A --> (Edit Profile)
    end

    (Create Post) --> (Get AI Category Suggestions)
```

## Component Diagram

**Description:** This diagram illustrates the high-level architecture of the application, showing the main components and their dependencies. It highlights the separation between the frontend UI, the AI services, and the simulated data layer.

```mermaid
componentDiagram
    package "Browser" {
        [Next.js Frontend]
    }

    package "Server" {
        [Genkit AI Flows]
    }

    database "LocalStorage" {
        [Data Simulation]
    }

    [Next.js Frontend] --> [Genkit AI Flows] : Calls AI for suggestions
    [Next.js Frontend] --> [Data Simulation] : Reads/Writes Data
```

## Sequence Diagram: Create a New Post

**Description:** This sequence diagram details the step-by-step process of a user creating a new blog post. It shows the interactions between the user, the React components, the AI flow for category suggestions, and the data layer.

```mermaid
sequenceDiagram
    participant User
    participant PostCreator as "PostCreator Component"
    participant suggestCategoriesAction as "AI Action"
    participant Genkit as "Genkit Flow"
    participant Data as "Data Layer (localStorage)"

    User->>PostCreator: Fills out Title and Content
    User->>PostCreator: Clicks "Suggest Categories"
    PostCreator->>suggestCategoriesAction: Calls with post content
    suggestCategoriesAction->>Genkit: Executes suggestPostCategory flow
    Genkit-->>suggestCategoriesAction: Returns categories
    suggestCategoriesAction-->>PostCreator: Returns suggestions
    PostCreator->>User: Displays suggested categories

    User->>PostCreator: Fills out Tags
    User->>PostCreator: Clicks "Publish Post"
    PostCreator->>Data: Saves new post
    Data-->>PostCreator: Confirms save
    PostCreator->>User: Redirects to new post page
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
