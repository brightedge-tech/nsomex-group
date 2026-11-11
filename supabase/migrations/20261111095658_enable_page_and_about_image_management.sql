-- NSOMEX Group: page and section image management plus an editable About page.
-- Uses the existing public nsomex-website bucket. Upload/delete rights are scoped to
-- pages the signed-in CMS editor is permitted to edit; public reads are intentional.

BEGIN;

ALTER TABLE public.pages
  ADD COLUMN IF NOT EXISTS cover_image_path text;

DO $constraint$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'pages_cover_image_path_check'
      AND conrelid = 'public.pages'::regclass
  ) THEN
    ALTER TABLE public.pages
      ADD CONSTRAINT pages_cover_image_path_check
      CHECK (
        cover_image_path IS NULL
        OR (cover_image_path LIKE 'pages/%' AND position('..' in cover_image_path) = 0)
      );
  END IF;
END;
$constraint$;

DROP POLICY IF EXISTS "CMS users can upload page images" ON storage.objects;
CREATE POLICY "CMS users can upload page images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'nsomex-website'
    AND name ~ '^pages/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/(cover|sections)/[A-Za-z0-9-]+[.](jpg|jpeg|png|webp|avif)$'
    AND EXISTS (
      SELECT 1
      FROM public.pages p
      WHERE p.id = split_part(name, '/', 2)::uuid
        AND public.cms_has_permission('content.edit', p.division_id)
    )
  );

DROP POLICY IF EXISTS "CMS users can remove page images" ON storage.objects;
CREATE POLICY "CMS users can remove page images"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'nsomex-website'
    AND name ~ '^pages/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/(cover|sections)/[A-Za-z0-9-]+[.](jpg|jpeg|png|webp|avif)$'
    AND EXISTS (
      SELECT 1
      FROM public.pages p
      WHERE p.id = split_part(name, '/', 2)::uuid
        AND public.cms_has_permission('content.edit', p.division_id)
    )
  );

-- A changed cover on a published page returns that page to draft until republished.
CREATE OR REPLACE FUNCTION public.cms_unpublish_page_after_cover_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $function$
BEGIN
  IF OLD.cover_image_path IS DISTINCT FROM NEW.cover_image_path
     AND OLD.status IN ('published', 'review') THEN
    UPDATE public.pages
    SET status = 'draft', published_at = NULL
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS cms_pages_unpublish_after_cover_change ON public.pages;
CREATE TRIGGER cms_pages_unpublish_after_cover_change
  AFTER UPDATE OF cover_image_path ON public.pages
  FOR EACH ROW
  EXECUTE FUNCTION public.cms_unpublish_page_after_cover_change();

-- Seed About as a draft so an administrator can review, add approved photographs,
-- and publish it from Pages & Sections. Triggers are disabled only for this trusted
-- initial seed; constraints and foreign keys remain active.
ALTER TABLE public.pages DISABLE TRIGGER USER;
ALTER TABLE public.page_translations DISABLE TRIGGER USER;
ALTER TABLE public.page_sections DISABLE TRIGGER USER;
ALTER TABLE public.page_section_translations DISABLE TRIGGER USER;

DO $seed$
DECLARE
  about_page_id uuid;
  section_id uuid;
BEGIN
  INSERT INTO public.pages (slug, template_key, status, show_in_navigation, navigation_order, division_id)
  VALUES ('about', 'standard', 'draft', false, 0, NULL)
  ON CONFLICT (slug) DO NOTHING;

  SELECT id INTO about_page_id FROM public.pages WHERE slug = 'about';

  INSERT INTO public.page_translations (page_id, locale_code, title, summary, seo_title, seo_description)
  VALUES
    (about_page_id, 'en', 'About NSOMEX Group',
      'NSOMEX Group connects businesses, products, services, talent, and opportunities across global markets.',
      'About NSOMEX Group | Connecting Global Business to Global Opportunity',
      'Discover NSOMEX Group, a global business group connecting technology, engineering, renewable energy, and international business.'),
    (about_page_id, 'fr', 'À propos de NSOMEX Group',
      'NSOMEX Group met en relation les entreprises, les produits, les services, les talents et les opportunités sur les marchés internationaux.',
      'À propos de NSOMEX Group | Connecter les entreprises aux opportunités mondiales',
      'Découvrez NSOMEX Group, un groupe international réunissant la technologie, l’ingénierie, les énergies renouvelables et le commerce international.')
  ON CONFLICT (page_id, locale_code) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    seo_title = EXCLUDED.seo_title,
    seo_description = EXCLUDED.seo_description;

  INSERT INTO public.page_sections (page_id, section_key, section_type, status, sort_order)
  VALUES
    (about_page_id, 'overview', 'text', 'draft', 10),
    (about_page_id, 'vision', 'text', 'draft', 20),
    (about_page_id, 'mission', 'text', 'draft', 30),
    (about_page_id, 'values', 'feature-grid', 'draft', 40),
    (about_page_id, 'global-network', 'text', 'draft', 50)
  ON CONFLICT (page_id, section_key) DO NOTHING;

  SELECT id INTO section_id FROM public.page_sections WHERE page_id = about_page_id AND section_key = 'overview';
  INSERT INTO public.page_section_translations (page_section_id, locale_code, content) VALUES
    (section_id, 'en', jsonb_build_object('eyebrow','WHO WE ARE','heading','A global group built around connection and execution','lead','Connecting global business to global opportunity.','body','NSOMEX Group is a technology-driven global business company connecting businesses, products, services, talent, and opportunities across markets. We operate across technology, engineering, renewable energy, and global business, bringing together complementary capabilities to help organisations access trusted partners, resources, and new opportunities.')),
    (section_id, 'fr', jsonb_build_object('eyebrow','QUI SOMMES-NOUS','heading','Un groupe international fondé sur la connexion et l’action','lead','Connecter les entreprises aux opportunités mondiales.','body','NSOMEX Group est un groupe international axé sur la technologie, qui met en relation les entreprises, les produits, les services, les talents et les opportunités sur différents marchés. Nous intervenons dans les domaines de la technologie, de l’ingénierie, des énergies renouvelables et du commerce international, en réunissant des compétences complémentaires pour aider les organisations à accéder à des partenaires fiables, à des ressources et à de nouvelles opportunités.'))
  ON CONFLICT (page_section_id, locale_code) DO UPDATE SET content = EXCLUDED.content;

  SELECT id INTO section_id FROM public.page_sections WHERE page_id = about_page_id AND section_key = 'vision';
  INSERT INTO public.page_section_translations (page_section_id, locale_code, content) VALUES
    (section_id, 'en', jsonb_build_object('eyebrow','OUR VISION','heading','Make global opportunity more accessible','body','Our vision is to build trusted connections between markets, organisations, expertise, and resources—helping businesses discover opportunities and turn ambition into measurable progress.')),
    (section_id, 'fr', jsonb_build_object('eyebrow','NOTRE VISION','heading','Rendre les opportunités mondiales plus accessibles','body','Notre vision est de créer des connexions fiables entre les marchés, les organisations, les expertises et les ressources, afin d’aider les entreprises à découvrir de nouvelles opportunités et à transformer leurs ambitions en progrès concrets.'))
  ON CONFLICT (page_section_id, locale_code) DO UPDATE SET content = EXCLUDED.content;

  SELECT id INTO section_id FROM public.page_sections WHERE page_id = about_page_id AND section_key = 'mission';
  INSERT INTO public.page_section_translations (page_section_id, locale_code, content) VALUES
    (section_id, 'en', jsonb_build_object('eyebrow','OUR MISSION','heading','Connect capability with practical business needs','body','We bring together technology, engineering, renewable energy, trade, sourcing, and business development capabilities to help organisations find the right partners, access quality solutions, and move projects forward with confidence.')),
    (section_id, 'fr', jsonb_build_object('eyebrow','NOTRE MISSION','heading','Relier les compétences aux besoins concrets des entreprises','body','Nous réunissons des compétences en technologie, ingénierie, énergies renouvelables, commerce, approvisionnement et développement des affaires afin d’aider les organisations à trouver les bons partenaires, accéder à des solutions de qualité et faire avancer leurs projets en toute confiance.'))
  ON CONFLICT (page_section_id, locale_code) DO UPDATE SET content = EXCLUDED.content;

  SELECT id INTO section_id FROM public.page_sections WHERE page_id = about_page_id AND section_key = 'values';
  INSERT INTO public.page_section_translations (page_section_id, locale_code, content) VALUES
    (section_id, 'en', jsonb_build_object('eyebrow','WHAT GUIDES US','heading','The principles behind our work','items',jsonb_build_array(
      jsonb_build_object('title','Trust','description','We build dependable relationships through transparency, accountability, and consistency.'),
      jsonb_build_object('title','Collaboration','description','We connect people, organisations, and expertise to create shared value.'),
      jsonb_build_object('title','Execution','description','We focus on practical solutions, responsible delivery, and measurable outcomes.'),
      jsonb_build_object('title','Global perspective','description','We work across markets with an understanding of local needs and international opportunities.')
    ))),
    (section_id, 'fr', jsonb_build_object('eyebrow','NOS PRINCIPES','heading','Les principes qui guident nos actions','items',jsonb_build_array(
      jsonb_build_object('title','Confiance','description','Nous construisons des relations fiables grâce à la transparence, à la responsabilité et à la constance.'),
      jsonb_build_object('title','Collaboration','description','Nous mettons en relation les personnes, les organisations et les expertises pour créer une valeur partagée.'),
      jsonb_build_object('title','Exécution','description','Nous privilégions les solutions pratiques, une réalisation responsable et des résultats mesurables.'),
      jsonb_build_object('title','Vision internationale','description','Nous intervenons sur différents marchés en tenant compte des réalités locales et des opportunités internationales.')
    )))
  ON CONFLICT (page_section_id, locale_code) DO UPDATE SET content = EXCLUDED.content;

  SELECT id INTO section_id FROM public.page_sections WHERE page_id = about_page_id AND section_key = 'global-network';
  INSERT INTO public.page_section_translations (page_section_id, locale_code, content) VALUES
    (section_id, 'en', jsonb_build_object('eyebrow','ONE CONNECTED GROUP','heading','Four divisions. Complementary capabilities.','body','Through NSOMEX Technology, NSOMEX Engineering, NSOMEX Renewable Energy, and NSOMEX Global Business, we bring together capabilities that support digital transformation, infrastructure and project delivery, sustainable energy, international trade, and business growth.')),
    (section_id, 'fr', jsonb_build_object('eyebrow','UN GROUPE CONNECTÉ','heading','Quatre divisions. Des compétences complémentaires.','body','À travers NSOMEX Technology, NSOMEX Engineering, NSOMEX Renewable Energy et NSOMEX Global Business, nous réunissons des compétences qui soutiennent la transformation numérique, les infrastructures et la réalisation de projets, l’énergie durable, le commerce international et la croissance des entreprises.'))
  ON CONFLICT (page_section_id, locale_code) DO UPDATE SET content = EXCLUDED.content;
END;
$seed$;

ALTER TABLE public.pages ENABLE TRIGGER USER;
ALTER TABLE public.page_translations ENABLE TRIGGER USER;
ALTER TABLE public.page_sections ENABLE TRIGGER USER;
ALTER TABLE public.page_section_translations ENABLE TRIGGER USER;

COMMIT;
