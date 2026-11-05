create table public.investor_interests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  edit_token uuid not null default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 1 and 120),
  email citext not null check (char_length(email) <= 254),
  country_of_residence text not null check (char_length(country_of_residence) between 1 and 80),
  connection_type public.connection_type not null,
  investor_type text not null check (investor_type in ('individual','business_owner','investor_group','institution','ghana_project')),
  ticket_band text check (ticket_band in ('under_25k','25k_100k','100k_500k','500k_2m','over_2m','not_sure')),
  sectors text[] not null default '{}',
  regions text[] not null default '{}',
  timeline text check (timeline in ('exploring','12_months','6_months','already_investing')),
  support_needed text[] not null default '{}',
  message text check (char_length(message) <= 600),
  wants_brief boolean not null default false,
  step_completed smallint not null default 1 check (step_completed in (1,2)),
  lead_score smallint not null default 0,
  lead_tier text not null default 'nurture' check (lead_tier in ('priority','standard','nurture')),
  status text not null default 'new' check (status in ('new','contacted','qualified','closed')),
  utm_source text check (char_length(utm_source) <= 120),
  utm_medium text check (char_length(utm_medium) <= 120),
  utm_campaign text check (char_length(utm_campaign) <= 120),
  referrer text check (char_length(referrer) <= 500),
  check (sectors <@ array['agriculture','manufacturing','energy','mining','infrastructure','real_estate','digital','tourism','health','education','other']),
  check (regions <@ array['greater-accra','ashanti','western','western-north','central','eastern','volta','oti','bono','bono-east','ahafo','northern','savannah','north-east','upper-east','upper-west','any']),
  check (support_needed <@ array['information','introductions','delegation','setup','project_review'])
);
create index investor_interests_email_created on public.investor_interests (email, created_at desc);
grant all on public.investor_interests to service_role;
alter table public.investor_interests enable row level security;
create trigger investor_interests_touch before update on public.investor_interests
  for each row execute function public.touch_updated_at();

create table public.investor_interest_consents (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.investor_interests(id),
  consent text not null check (consent in ('contact','updates')),
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  policy_version text not null,
  mechanism text not null
);
create index investor_interest_consents_lead on public.investor_interest_consents (lead_id);
grant all on public.investor_interest_consents to service_role;
alter table public.investor_interest_consents enable row level security;

create or replace function public.investor_consents_append_only()
returns trigger language plpgsql set search_path = public as $$
begin
  if tg_op = 'DELETE' then raise exception 'investor consents are append-only'; end if;
  if new.lead_id <> old.lead_id or new.consent <> old.consent or new.granted_at <> old.granted_at
     or new.policy_version <> old.policy_version or new.mechanism <> old.mechanism
     or old.revoked_at is not null then
    raise exception 'investor consents are append-only; only a first revocation may be recorded';
  end if;
  return new;
end $$;
create trigger investor_interest_consents_append_only before update or delete on public.investor_interest_consents
  for each row execute function public.investor_consents_append_only();

create or replace function public.investor_lead_score(p_ticket text, p_timeline text, p_type text, p_step smallint)
returns smallint language sql immutable set search_path = public as $$
  select (
    case p_ticket when '25k_100k' then 2 when '100k_500k' then 3 when '500k_2m' then 4 when 'over_2m' then 5 else 1 end
    + case p_timeline when '12_months' then 1 when '6_months' then 2 when 'already_investing' then 2 else 0 end
    + case p_type when 'institution' then 2 when 'investor_group' then 1 when 'business_owner' then 1 else 0 end
    + case when p_step = 2 then 1 else 0 end
  )::smallint
$$;

create or replace function public.investor_lead_tier(p_score smallint)
returns text language sql immutable set search_path = public as $$
  select case when p_score >= 7 then 'priority' when p_score >= 4 then 'standard' else 'nurture' end
$$;

create or replace function public.submit_investor_interest_step1(
  p_full_name text, p_email text, p_country text, p_connection public.connection_type,
  p_investor_type text, p_consent_contact boolean, p_wants_brief boolean default false,
  p_utm_source text default null, p_utm_medium text default null, p_utm_campaign text default null,
  p_referrer text default null, p_policy_version text default 'invest-2026-11'
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_token uuid; v_score smallint;
begin
  if coalesce(p_consent_contact, false) is not true then
    raise exception 'consent_required' using errcode = '22023';
  end if;
  if p_email is null or p_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'invalid_email' using errcode = '22023';
  end if;
  if (select count(*) from investor_interests
      where email = lower(trim(p_email))::citext and created_at > now() - interval '10 minutes') >= 3 then
    raise exception 'rate_limited' using errcode = '22023';
  end if;
  v_score := investor_lead_score(null, null, p_investor_type, 1::smallint);
  insert into investor_interests (full_name, email, country_of_residence, connection_type, investor_type,
    wants_brief, utm_source, utm_medium, utm_campaign, referrer, lead_score, lead_tier)
  values (trim(p_full_name), lower(trim(p_email)), trim(p_country), p_connection, p_investor_type,
    coalesce(p_wants_brief,false), left(p_utm_source,120), left(p_utm_medium,120), left(p_utm_campaign,120),
    left(p_referrer,500), v_score, investor_lead_tier(v_score))
  returning id, edit_token into v_id, v_token;
  insert into investor_interest_consents (lead_id, consent, policy_version, mechanism)
  values (v_id, 'contact', p_policy_version, 'invest_form_step1');
  return jsonb_build_object('id', v_id, 'edit_token', v_token);
end $$;

create or replace function public.complete_investor_interest_step2(
  p_id uuid, p_edit_token uuid, p_ticket_band text default null, p_sectors text[] default '{}',
  p_regions text[] default '{}', p_timeline text default null, p_support_needed text[] default '{}',
  p_message text default null, p_consent_updates boolean default false,
  p_policy_version text default 'invest-2026-11'
) returns boolean language plpgsql security definer set search_path = public as $$
declare v_type text; v_score smallint;
begin
  select investor_type into v_type from investor_interests
   where id = p_id and edit_token = p_edit_token and created_at > now() - interval '24 hours' and step_completed = 1;
  if v_type is null then raise exception 'not_found_or_expired' using errcode = '22023'; end if;
  v_score := investor_lead_score(p_ticket_band, p_timeline, v_type, 2::smallint);
  update investor_interests set
    ticket_band = p_ticket_band, sectors = coalesce(p_sectors,'{}'), regions = coalesce(p_regions,'{}'),
    timeline = p_timeline, support_needed = coalesce(p_support_needed,'{}'),
    message = nullif(left(trim(p_message),600),''), step_completed = 2,
    lead_score = v_score, lead_tier = investor_lead_tier(v_score)
  where id = p_id;
  if coalesce(p_consent_updates,false) then
    insert into investor_interest_consents (lead_id, consent, policy_version, mechanism)
    values (p_id, 'updates', p_policy_version, 'invest_form_step2');
  end if;
  return true;
end $$;

revoke all on function public.submit_investor_interest_step1(text,text,text,public.connection_type,text,boolean,boolean,text,text,text,text,text) from public;
revoke all on function public.complete_investor_interest_step2(uuid,uuid,text,text[],text[],text,text[],text,boolean,text) from public;
grant execute on function public.submit_investor_interest_step1(text,text,text,public.connection_type,text,boolean,boolean,text,text,text,text,text) to anon, authenticated;
grant execute on function public.complete_investor_interest_step2(uuid,uuid,text,text[],text[],text,text[],text,boolean,text) to anon, authenticated;