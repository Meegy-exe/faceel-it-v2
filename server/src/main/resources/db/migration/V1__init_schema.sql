-- Schéma initial, dérivé directement du contrat d'API validé.
-- Convention : snake_case en base, camelCase en JSON (mapping via Jackson).

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================ OFFRES D'EMPLOI

CREATE TABLE job_offer (
    id                  UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    slug                VARCHAR(180) NOT NULL UNIQUE,
    reference           VARCHAR(32)  NOT NULL UNIQUE,
    status              VARCHAR(16)  NOT NULL,

    title               VARCHAR(180) NOT NULL,
    short_description   VARCHAR(400) NOT NULL,
    description         TEXT         NOT NULL,
    profile             TEXT,

    contract_type       VARCHAR(20)  NOT NULL,
    work_mode           VARCHAR(16)  NOT NULL,
    experience_level    VARCHAR(16)  NOT NULL,
    min_years_experience SMALLINT,
    department          VARCHAR(120),
    start_date          DATE,

    city                VARCHAR(120) NOT NULL,
    postal_code         VARCHAR(16),
    region              VARCHAR(120),
    country             CHAR(2)      NOT NULL DEFAULT 'FR',
    remote_days_per_week SMALLINT,

    salary_min          INTEGER,
    salary_max          INTEGER,
    salary_currency     CHAR(3)      DEFAULT 'EUR',
    salary_period       VARCHAR(8),
    salary_displayed    BOOLEAN      NOT NULL DEFAULT FALSE,

    application_email   VARCHAR(180),
    application_url     VARCHAR(400),
    is_urgent           BOOLEAN      NOT NULL DEFAULT FALSE,

    meta_title          VARCHAR(200),
    meta_description    VARCHAR(400),
    og_image_url        VARCHAR(400),

    published_at        TIMESTAMPTZ,
    expires_at          TIMESTAMPTZ,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT now(),

    CONSTRAINT job_offer_salary_range CHECK (
        salary_min IS NULL OR salary_max IS NULL OR salary_min <= salary_max
    )
);

-- Le site public ne liste que les offres PUBLISHED : l'index le reflète.
CREATE INDEX idx_job_offer_published
    ON job_offer (published_at DESC)
    WHERE status = 'PUBLISHED';

CREATE INDEX idx_job_offer_filters ON job_offer (contract_type, work_mode, city);

-- ================================================================ COLLECTIF

CREATE TABLE collective_member (
    id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    slug              VARCHAR(180) NOT NULL UNIQUE,

    first_name        VARCHAR(80)  NOT NULL,
    last_name         VARCHAR(80)  NOT NULL,
    display_name      VARCHAR(160) NOT NULL,
    pronouns          VARCHAR(32),

    role              VARCHAR(120) NOT NULL,
    team              VARCHAR(20)  NOT NULL,
    seniority_label   VARCHAR(120),
    joined_at         DATE,

    tagline           VARCHAR(240),
    bio               TEXT,

    photo_url         VARCHAR(400) NOT NULL,
    photo_thumb_url   VARCHAR(400),
    photo_alt         VARCHAR(240) NOT NULL,
    photo_width       SMALLINT,
    photo_height      SMALLINT,
    photo_color       CHAR(7),

    sport_discipline  VARCHAR(120),
    sport_quote       VARCHAR(400),
    sport_achievement VARCHAR(240),

    linkedin_url      VARCHAR(400),
    github_url        VARCHAR(400),
    website_url       VARCHAR(400),
    contact_email     VARCHAR(180),

    meta_title        VARCHAR(200),
    meta_description  VARCHAR(400),
    og_image_url      VARCHAR(400),

    display_order     SMALLINT     NOT NULL DEFAULT 0,
    visible           BOOLEAN      NOT NULL DEFAULT TRUE,
    has_detail_page   BOOLEAN      NOT NULL DEFAULT TRUE,

    created_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_member_display ON collective_member (display_order)
    WHERE visible = TRUE;

-- Recruteur rattaché à une offre (relation optionnelle du contrat).
ALTER TABLE job_offer
    ADD COLUMN recruiter_id UUID REFERENCES collective_member (id) ON DELETE SET NULL;

-- ============================================= COLLECTIONS (tables filles)

CREATE TABLE job_offer_mission (
    job_offer_id UUID     NOT NULL REFERENCES job_offer (id) ON DELETE CASCADE,
    position     SMALLINT NOT NULL,
    label        VARCHAR(400) NOT NULL,
    PRIMARY KEY (job_offer_id, position)
);

CREATE TABLE job_offer_skill (
    job_offer_id UUID     NOT NULL REFERENCES job_offer (id) ON DELETE CASCADE,
    position     SMALLINT NOT NULL,
    label        VARCHAR(120) NOT NULL,
    level        VARCHAR(16)  NOT NULL,
    required     BOOLEAN      NOT NULL,
    PRIMARY KEY (job_offer_id, position)
);

CREATE TABLE job_offer_tag (
    job_offer_id UUID        NOT NULL REFERENCES job_offer (id) ON DELETE CASCADE,
    label        VARCHAR(60) NOT NULL,
    PRIMARY KEY (job_offer_id, label)
);

CREATE TABLE member_expertise (
    member_id UUID        NOT NULL REFERENCES collective_member (id) ON DELETE CASCADE,
    position  SMALLINT    NOT NULL,
    label     VARCHAR(120) NOT NULL,
    PRIMARY KEY (member_id, position)
);

CREATE TABLE member_language (
    member_id UUID        NOT NULL REFERENCES collective_member (id) ON DELETE CASCADE,
    code      CHAR(2)     NOT NULL,
    label     VARCHAR(60) NOT NULL,
    level     VARCHAR(16) NOT NULL,
    PRIMARY KEY (member_id, code)
);

-- ============================================================== CONTACT B2B

CREATE TABLE contact_request (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name    VARCHAR(160) NOT NULL,
    email        VARCHAR(180) NOT NULL,
    company      VARCHAR(160),
    phone        VARCHAR(32),
    subject      VARCHAR(200) NOT NULL,
    message      TEXT         NOT NULL,
    source_ip    INET,
    processed    BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_contact_created ON contact_request (created_at DESC);
