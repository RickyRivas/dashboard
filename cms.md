# CMS

# Dashboard Site Manager/CMS

## Structure of Site Manager/CMS
### 1. Sites
- view all Rivas Web Designs sites

### 2. Site Overall Viewer
- view site account config and data

### 3. View all pages on a site
- CRUD Pages for account
- Define structure of Nav

### 4. View a specific page
- view specific page data. metatags, op images
- Svelte-Lexical Editor.
  - needs to be able to handle custom components
- will be saved to supabase which will, in the end, be fetched on the site itself.

### 5. Blogs!
- CRUD Posts

### 6. Blog Posts
- View specific blog posts




######
pages are configurable in this way:
1. Meta tags and other SEO stuff 
2. The actual site layout via ordering components
   1. Drag and drop components. 
      1. Slideshow, Spotlight, Footer
   2. Click and update a component 
      1. Edit the data types
3. Register a new component
      1. Define the data it needs
         1. imgs, rich text editor, button text etc.


# todo
- update RLS for all tables