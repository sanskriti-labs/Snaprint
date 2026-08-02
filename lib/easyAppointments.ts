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

export type Slot = { time: string };

type CreateAppointmentInput = {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
};

export const EA_SERVICE_NAME = SERVICE_DISPLAY_NAME;

let cachedServiceId: number | null = null;

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

export async function getAvailableSlots(date: string): Promise<Slot[]> {
  const serviceId = await resolveServiceId();
  const url = new URL(`${EA_BASE_URL}/index.php/api/v1/availabilities`);
  url.searchParams.set("serviceId", String(serviceId));
  url.searchParams.set("providerId", "0");
  url.searchParams.set("selectedDate", date);

  const res = await fetch(url.toString(), {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new EAApiError(`Failed to fetch availability (${res.status})`, res.status);
  }
  const times: string[] = await res.json();
  return times.map((time) => ({ time }));
}

export async function createAppointment(
  input: CreateAppointmentInput
): Promise<{ id: number }> {
  const serviceId = await resolveServiceId();
  const start = `${input.date} ${input.time}:00`;

  const res = await fetch(`${EA_BASE_URL}/index.php/api/v1/appointments`, {
    method: "POST",
    headers: authHeaders(),
    cache: "no-store",
    body: JSON.stringify({
      start,
      serviceId,
      customer: {
        firstName: input.name,
        email: input.email,
        phone: input.phone,
      },
    }),
  });

  if (!res.ok) {
    throw new EAApiError(`Failed to create appointment (${res.status})`, res.status);
  }
  const created = await res.json();
  return { id: created.id };
}
