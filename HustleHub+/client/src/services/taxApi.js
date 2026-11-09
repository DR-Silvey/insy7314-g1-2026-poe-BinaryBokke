const API_BASE_URL = import.meta.env.VITE_FINANCE_API_BASE_URL ?? 'https://localhost:6000';

//(MDN Web Docs, 2026a)
async function send(path, { method = 'GET', token, body } = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        ...(body && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('We could not reach the service. Please try again shortly.');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || data.message || 'Your request could not be completed. Please check your details and try again.');
    error.status = response.status;
    throw error;
  }

  return data;
}

//(MDN Web Docs, 2026b)
function toQuery(filters) {
  const query = new URLSearchParams(Object.entries(filters).filter(([, value]) => value !== undefined && value !== null && value !== '')).toString();
  return query ? `?${query}` : '';
}

export async function estimateTax(token) {
  const data = await send('/tax-estimation', { method: 'POST', token });
  return data.estimatedTax;
}

export async function getTaxRecords(token, filters = {}) {
  try {
    const data = await send(`/tax-records${toQuery(filters)}`, { token });
    return data.taxRecords ?? [];
  } catch (error) {
    if (error.status === 404) return [];
    throw error;
  }
}

export async function getTaxBrackets(token, filters = {}) {
  try {
    const data = await send(`/tax-brackets${toQuery(filters)}`, { token });
    return data.taxBrackets ?? [];
  } catch (error) {
    if (error.status === 404) return [];
    throw error;
  }
}

export async function createTaxBracket(token, { taxYear, minimumIncome, maximumIncome, taxRate, baseTax }) {
  const data = await send('/tax-brackets', { method: 'POST', token, body: { taxYear, minimumIncome, maximumIncome, taxRate, baseTax } });
  return data.taxBracket;
}

/*
MDN Web Docs, 2026a. Using the Fetch API. [online] Available at:
<https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch>
[Accessed 9 November 2026]

MDN Web Docs, 2026b. URLSearchParams. [online] Available at:
<https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams>
[Accessed 9 November 2026]
*/
