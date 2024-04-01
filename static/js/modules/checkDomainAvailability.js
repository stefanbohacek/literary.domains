export default async (domain) => {
  const resp = await fetch(`/check-domain-availability?domain=${domain}`);
  const availability = await resp.json();
  return availability;
};
