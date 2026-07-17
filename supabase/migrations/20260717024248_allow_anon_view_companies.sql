-- 企業ディレクトリ(/companies)を公開ページ(未ログインでも閲覧可)にしたため、
-- companies/company_membersのSELECTポリシーをanonにも開放する。
-- (これまでtoauthenticatedのみだったため、匿名ユーザーからは空に見えていた)
drop policy "Authenticated users can view companies" on public.companies;
create policy "Anyone can view companies"
on public.companies for select
to anon, authenticated
using (true);

drop policy "Authenticated users can view company members" on public.company_members;
create policy "Anyone can view company members"
on public.company_members for select
to anon, authenticated
using (true);
