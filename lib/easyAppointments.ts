const EA_BASE_URL = process.env.EA_BASE_URL ?? "https://book.sanskritilabs.in";
const SERVICE_DISPLAY_NAME = "Introduction Call with Snaprint Founder";

export class EAApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "EAApiError";
    this.status = status;
  }
}

export type Slot = { time: string; providerId: number; providerName: string };

export type AvailableProvider = {
  id: number;
  firstName: string;
};

type CreateAppointmentInput = {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  providerId: number;
};

export const EA_SERVICE_NAME = SERVICE_DISPLAY_NAME;

let cachedServiceId: number | null = null;
// Providers (with display names) that are linked to the booking service.
// Cached after the first resolve so we don't re-list providers on every
// availability check. EA's /availabilities endpoint only accepts a single
// numeric providerId — `0` is treated as a literal id (causes 500) — so we
// fan out per-provider and merge.
let cachedProviders: AvailableProvider[] | null = null;

function apiKey(): string {
  const key = process.env.EA_API_KEY;
  if (!key) {
    throw new EAApiError("EA_API_KEY is not configured on the server");
  }
  return key;
}

function authHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${apiKey()}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

async function resolveServiceId(): Promise<number> {
  if (cachedServiceId !== null) return cachedServiceId;

  const res = await fetch(`${EA_BASE_URL}/index.php/api/v1/services`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new EAApiError(`Failed to list EA services (${res.status})`, res.status);
  }
  const services: Array<{ id: number; name: string }> = await res.json();
  const match = services.find((s) => s.name === SERVICE_DISPLAY_NAME);
  if (!match) {
    throw new EAApiError(
      `EA service "${SERVICE_DISPLAY_NAME}" not found. Check the service name matches exactly in the EA admin panel.`
    );
  }
  cachedServiceId = match.id;
  return match.id;
}

async function resolveProvidersForService(serviceId: number): Promise<AvailableProvider[]> {
  if (cachedProviders !== null) return cachedProviders;

  const res = await fetch(`${EA_BASE_URL}/index.php/api/v1/providers`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new EAApiError(`Failed to list EA providers (${res.status})`, res.status);
  }
  const providers: Array<{ id: number; firstName: string; services?: string[] }> =
    await res.json();
  const linked: AvailableProvider[] = providers
    .filter((p) => Array.isArray(p.services) && p.services.includes(String(serviceId)))
    .map((p) => ({ id: p.id, firstName: p.firstName }));

  if (linked.length === 0) {
    throw new EAApiError(
      `No EA providers are linked to service id ${serviceId}. Link at least one provider in the EA admin.`
    );
  }

  cachedProviders = linked;
  return linked;
}

/** Exposed for the booking page so the UI can show "Pick a founder". */
export async function getAvailableProviders(): Promise<AvailableProvider[]> {
  const serviceId = await resolveServiceId();
  return resolveProvidersForService(serviceId);
}

export async function getAvailableSlots(date: string): Promise<Slot[]> {
  const serviceId = await resolveServiceId();
  const providers = await resolveProvidersForService(serviceId);

  // EA's /availabilities only accepts a single numeric providerId; fan out per
  // provider and merge the resulting time strings, tagging each with its
  // provider so the UI can group by founder.
  const byProvider = await Promise.all(
    providers.map(async (provider) => {
      const url = new URL(`${EA_BASE_URL}/index.php/api/v1/availabilities`);
      url.searchParams.set("serviceId", String(serviceId));
      url.searchParams.set("providerId", String(provider.id));
      // EA's v1 endpoint takes the date as `date=YYYY-MM-DD`, NOT `selectedDate`.
      // The wrong param name is silently ignored → empty array. Verified against
      // book.sanskritilabs.in on 2026-08-03.
      url.searchParams.set("date", date);

      const res = await fetch(url.toString(), {
        headers: authHeaders(),
        cache: "no-store",
      });
      if (!res.ok) {
        throw new EAApiError(`Failed to fetch availability (${res.status})`, res.status);
      }
      const times: string[] = await res.json();
      return times.map<Slot>((time) => ({
        time,
        providerId: provider.id,
        providerName: provider.firstName,
      }));
    })
  );

  return byProvider.flat().sort((a, b) => a.time.localeCompare(b.time));
}

async function upsertCustomer(input: {
  firstName: string;
  email: string;
  phone: string;
}): Promise<number> {
  // Try to find an existing customer by email first — EA /customers?search=
  // returns matching records. If none, POST a new one.
  const searchUrl = new URL(`${EA_BASE_URL}/index.php/api/v1/customers`);
  searchUrl.searchParams.set("search", input.email);
  const searchRes = await fetch(searchUrl.toString(), {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (searchRes.ok) {
    const list: Array<{ id: number; email?: string }> = await searchRes.json();
    const exact = list.find((c) => (c.email ?? "").toLowerCase() === input.email.toLowerCase());
    if (exact) return exact.id;
  }

  const createRes = await fetch(`${EA_BASE_URL}/index.php/api/v1/customers`, {
    method: "POST",
    headers: authHeaders(),
    cache: "no-store",
    body: JSON.stringify({
      firstName: input.firstName,
      lastName: ".",
      email: input.email,
      phone: input.phone,
    }),
  });
  if (!createRes.ok) {
    throw new EAApiError(`Failed to create EA customer (${createRes.status})`, createRes.status);
  }
  const created: { id: number } = await createRes.json();
  return created.id;
}

export async function createAppointment(
  input: CreateAppointmentInput
): Promise<{ id: number }> {
  const serviceId = await resolveServiceId();
  // The provider is selected by the user on the booking page. Validate it
  // against the linked set so a forged request can't book against a
  // different provider.
  const providers = await resolveProvidersForService(serviceId);
  const providerId = providers.find((p) => p.id === input.providerId)?.id;
  if (providerId === undefined) {
    throw new EAApiError(
      `providerId ${input.providerId} is not linked to this service`
    );
  }

  const start = `${input.date} ${input.time}:00`;

  // EA's v1 appointment endpoint requires an existing customerId, NOT a
  // customer object. Upsert by email first.
  const customerId = await upsertCustomer({
    firstName: input.name,
    email: input.email,
    phone: input.phone,
  });

  const res = await fetch(`${EA_BASE_URL}/index.php/api/v1/appointments`, {
    method: "POST",
    headers: authHeaders(),
    cache: "no-store",
    body: JSON.stringify({
      start,
      serviceId,
      providerId,
      customerId,
    }),
  });

  if (!res.ok) {
    throw new EAApiError(`Failed to create appointment (${res.status})`, res.status);
  }
  const created = await res.json();
  return { id: created.id };
}
