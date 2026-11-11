-- Allow public readers to resolve metadata only for published article cover assets.
-- Storage object downloads remain governed by the article-cover policy created earlier.
begin;

create policy "Public can read published article cover metadata"
  on public.media_assets
  for select
  to anon, authenticated
  using (
    status = 'published'
    and exists (
      select 1
      from public.articles a
      where a.cover_media_asset_id = media_assets.id
        and a.status = 'published'
        and a.published_at <= now()
        and (
          a.division_id is null
          or exists (
            select 1 from public.divisions d
            where d.id = a.division_id and d.is_active
          )
        )
    )
  );

commit;
