import Image from "next/image";
import { getSettings } from "@/lib/cms";

type Props = { settings?: Record<string, string> };

function parseObject(raw: string | undefined): Record<string, unknown> {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

function toLabel(key: string) {
  return key.replace(/[_-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function parseStringArray(raw: string | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string" && value.trim().length > 0) : [];
  } catch {
    return [];
  }
}

function validUrl(value: string | undefined) {
  return value && /^https?:\/\//i.test(value) ? value : "";
}

export default async function CompanyMasthead({ settings: incoming }: Props = {}) {
  const s = incoming ?? await getSettings();
  const details = parseObject(s["site.contact_details"]);
  const hours = parseObject(s["site.business_hours"]);
  const priorities = parseStringArray(s["site.why_choose_us"]);
  const social = parseObject(s["site.social_links"]);
  const brand = [
    s["site.legal_name"] ? `Business: ${s["site.legal_name"]}` : "",
    s["site.factory_name"] ? `Factory: ${s["site.factory_name"]}` : "",
    s["site.brand_name"] ? `Brand: ${s["site.brand_name"]}` : "",
    s["site.established_claim"] ? `Established: ${s["site.established_claim"]}` : "",
  ].filter((value, index, values) => Boolean(value) && values.indexOf(value) === index);
  const registeredAddress = [s["site.address"], s["site.address_line_2"], s["site.landmark"], s["site.city"], s["site.district"], s["site.state"], s["site.postal_code"], s["site.country"]]
    .filter(Boolean).filter((value, index, values) => values.indexOf(value) === index).join(", ");
  const factoryAddress = [s["site.factory_address"], s["site.factory_pincode"]]
    .filter(Boolean).filter((value, index, values) => values.indexOf(value) === index).join(", ");
  const phoneFields = ([
    ["Mobile", s["site.mobile"] ?? ""],
    ["Alternate mobile", s["site.alternate_mobile"] ?? ""],
    ["Support phone", s["site.support_phone"] ?? ""],
    ["Landline", s["site.landline"] ?? ""],
    ["WhatsApp", s["site.whatsapp_number"] ?? ""],
  ] satisfies Array<[string, string]>).filter((item) => item[1]);
  const emailFields = ([
    ["Sales email", s["site.sales_email"] ?? ""],
    ["Support email", s["site.support_email"] ?? ""],
  ] satisfies Array<[string, string]>).filter((item) => item[1]);
  const registrationFields = ([
    ["GST number", s["site.gst_number"] ?? ""],
    ["PAN", s["site.pan_number"] ?? ""],
    ["Business registration", s["site.business_registration_number"] ?? ""],
  ] satisfies Array<[string, string]>).filter((item) => item[1]);
  const extraContacts = Object.entries(details).flatMap(([key, raw]) => {
    const value = typeof raw === "string" || typeof raw === "number" ? String(raw).trim() : "";
    if (!value) return [];
    const isAlreadyListed = [...phoneFields, ...emailFields].some(([, existing]) => existing.toLowerCase() === value.toLowerCase());
    return isAlreadyListed ? [] : [{ label: toLabel(key), value }];
  });
  const extraHours = Object.entries(hours).flatMap(([key, raw]) => {
    const value = typeof raw === "string" || typeof raw === "number" ? String(raw).trim() : "";
    return value ? [{ label: toLabel(key), value }] : [];
  });
  const socialLinks = Object.entries(social).flatMap(([key, raw]) => {
    const value = typeof raw === "string" ? raw : raw && typeof raw === "object" && "url" in raw ? String((raw as { url: unknown }).url ?? "") : "";
    const href = validUrl(value);
    return href ? [{ label: toLabel(key), href }] : [];
  });
  const website = validUrl(s["site.website_url"]);
  const maps = validUrl(s["site.maps_url"]);

  return (
    <section className="company-masthead" aria-label="Official company details">
      <div className="company-masthead-inner mx-auto max-w-7xl px-4 py-4 lg:px-6">
        <div className="company-masthead-heading">
          <div className="company-masthead-title-wrap">
            <span className="company-masthead-kicker">Official factory outlet · { [s["site.city"], s["site.state"]].filter(Boolean).join(", ") || "Sivakasi, Tamil Nadu" }</span>
            <div className="company-masthead-brandline">
              {s["site.logo_url"] && <Image src={s["site.logo_url"]} alt={`${s["site.name"] || "REDTHUNDER CRACKERS"} logo`} width={112} height={64} className="company-masthead-logo" />}
              <div className="company-masthead-brandcopy">
                <h1 className="company-masthead-title">{s["site.name"] || "REDTHUNDER CRACKERS"}</h1>
                {s["site.tagline"] && <p className="company-masthead-tagline">{s["site.tagline"]}</p>}
              </div>
            </div>
          </div>
          {brand.length > 0 && (
            <div className="company-masthead-identifiers" aria-label="Registered business and brand details">
              {brand.map((value, index) => <span key={`${value}-${index}`}>{value}</span>)}
            </div>
          )}
        </div>
        {s["site.description"] && <p className="company-masthead-description">{s["site.description"]}</p>}

        <div className="company-masthead-details">
          {(registeredAddress || (factoryAddress && factoryAddress !== registeredAddress)) && (
            <div className="company-masthead-detail">
              <span>Company addresses</span>
              <div className="company-masthead-detail-lines">
                {registeredAddress && <div className="company-masthead-detail-line"><b>Registered</b><strong>{registeredAddress}</strong></div>}
                {factoryAddress && factoryAddress !== registeredAddress && <div className="company-masthead-detail-line"><b>Factory / godown</b><strong>{factoryAddress}</strong></div>}
              </div>
            </div>
          )}
          {phoneFields.length > 0 && (
            <div className="company-masthead-detail">
              <span>Phone &amp; WhatsApp</span>
              <div className="company-masthead-detail-lines">
                {phoneFields.map(([label, value]) => <a className="company-masthead-detail-line" key={`${label}-${value}`} href={`tel:${value.replace(/[^+\d]/g, "")}`}><b>{label}</b><strong>{value}</strong></a>)}
              </div>
            </div>
          )}
          {(emailFields.length > 0 || website || maps || socialLinks.length > 0) && (
            <div className="company-masthead-detail">
              <span>Email &amp; online</span>
              <div className="company-masthead-detail-lines">
                {emailFields.map(([label, value]) => <a className="company-masthead-detail-line" key={`${label}-${value}`} href={`mailto:${value}`}><b>{label}</b><strong>{value}</strong></a>)}
                {website && <a className="company-masthead-detail-line" href={website} target="_blank" rel="noopener noreferrer"><b>Official website</b><strong>{s["site.website_url"]}</strong></a>}
                {maps && <a className="company-masthead-detail-line" href={maps} target="_blank" rel="noopener noreferrer"><b>Map / directions</b><strong>Open location ↗</strong></a>}
                {socialLinks.map(({ label, href }) => <a className="company-masthead-detail-line" key={`${label}-${href}`} href={href} target="_blank" rel="noopener noreferrer"><b>Social</b><strong>{label} ↗</strong></a>)}
              </div>
            </div>
          )}
          {(s["site.aim"] || s["site.vision"] || s["site.mission"] || priorities.length > 0 || registrationFields.length > 0 || extraContacts.length > 0 || extraHours.length > 0) && (
            <div className="company-masthead-detail company-masthead-profile">
              <span>Company profile &amp; credentials</span>
              <div className="company-masthead-detail-lines company-masthead-profile-lines">
                {s["site.aim"] && <div className="company-masthead-detail-line"><b>Aim</b><strong>{s["site.aim"]}</strong></div>}
                {s["site.vision"] && <div className="company-masthead-detail-line"><b>Vision</b><strong>{s["site.vision"]}</strong></div>}
                {s["site.mission"] && <div className="company-masthead-detail-line"><b>Mission</b><strong>{s["site.mission"]}</strong></div>}
                {priorities.length > 0 && <div className="company-masthead-detail-line"><b>Priorities</b><strong>{priorities.join(" · ")}</strong></div>}
                {registrationFields.map(([label, value]) => <div className="company-masthead-detail-line" key={`${label}-${value}`}><b>{label}</b><strong>{value}</strong></div>)}
                {extraContacts.map(({ label, value }) => <div className="company-masthead-detail-line" key={`${label}-${value}`}><b>{label}</b><strong>{value}</strong></div>)}
                {extraHours.map(({ label, value }) => <div className="company-masthead-detail-line" key={`${label}-${value}`}><b>{label}</b><strong>{value}</strong></div>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
