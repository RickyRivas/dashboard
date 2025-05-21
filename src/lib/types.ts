export type CodeAsset = {
    id: string;
    title: string;
    description: string;
    type: "snippet" | "component" | "section";
    html: string;
    css: string;
    javascript: string;
    thumbnailurl: string;
    category: string;
    favorite: boolean;
    created_at: string;
    updated_at: string;
    buildtime: string | null;
}

export type FileItem = {
    name: string;
    base: string;
    type: "file" | "directory";
    ext: string;
    relativePath: string;
    dashboardSrc: string;
    urlPath: string;
    fileWidth: number | null;
    fileHeight: number | null;
    fileSize: string;
    lastModified: string | Date;
    // Add this property for directories
    children?: FileItem[];
};

export type SiteContacts = {
    // Primary key and foreign key
    id: string;              // UUID
    site_id: string;         // UUID, references sites(id)

    // Primary contact info
    primary_contact_name: string | null;
    primary_phone: string | null;
    primary_email: string | null;

    // Secondary contact info
    secondary_contact_name: string | null;
    secondary_phone: string | null;
    secondary_email: string | null;

    // Business info
    business_address: string | null;
    business_phone: string | null;
    business_email: string | null;

    preferred_contact_method?: 'primary_phone' | 'primary_email' | 'secondary_phone' | 'secondary_email' | 'business_phone' | 'business_email' | null;

    // Timestamps
    created_at: string;      // ISO date string
    updated_at: string;      // ISO date string
};

export type Site = {
    id: string;
    user_id: string;
    site_name: string;
    created_at: string;
    updated_at: string;
};

export type SiteInformation = {
    // Primary key and foreign key
    id: string;                                    // UUID
    site_id: string;                               // UUID, references sites(id)

    // Domain information
    domain_name: string | null;

    // Project dates
    start_date: string | null;                     // ISO date string (YYYY-MM-DD)
    estimated_end_date: string | null;             // ISO date string
    launch_date: string | null;                    // ISO date string

    // Status tracking
    website_status: 'planning' | 'in_development' | 'review' | 'staging' | 'launched' | 'maintenance' | 'archived' | null;

    // URLs and links
    spec_url: string | null;
    build_link: string | null;
    proof_link: string | null;

    // Additional useful fields
    hosting_provider: string | null;
    cms_platform: string | null;
    analytics_id: string | null;

    // Notes
    project_notes: string | null;

    // Timestamps
    created_at: string;                            // ISO date-time string
    updated_at: string;                            // ISO date-time string
};

// Status type for checklist items
type ProcessStatus = 'not_started' | 'in_progress' | 'completed' | 'blocked' | 'not_applicable';

// Full process checklist type
export type SiteProcessChecklist = {
    id: string;
    site_id: string;

    // Status for each step
    opportunity_status: ProcessStatus;
    contract_signing_status: ProcessStatus;
    questionnaire_status: ProcessStatus;
    payment_status: ProcessStatus;
    design_consultation_status: ProcessStatus;
    design_reveal_status: ProcessStatus;
    design_approval_status: ProcessStatus;
    design_to_code_status: ProcessStatus;
    design_qa_status: ProcessStatus;
    favicon_status: ProcessStatus;
    sitemap_status: ProcessStatus;
    meta_tags_status: ProcessStatus;
    google_analytics_status: ProcessStatus;
    connect_domain_status: ProcessStatus;
    copywriting_status: ProcessStatus;
    proofreading_status: ProcessStatus;
    submit_google_console_status: ProcessStatus;
    technical_qa_status: ProcessStatus;
    launch_status: ProcessStatus;
    final_payment_status: ProcessStatus;

    // Timestamps
    created_at: string;
    updated_at: string;
};

// Type for updating a single process step
export type ProcessStepUpdate = {
    status: ProcessStatus;
    notes?: string | null;
    date?: string | null;
};