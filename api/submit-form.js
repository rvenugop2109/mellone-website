export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.AIRTABLE_API_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  const allowedFields = [
    'First Name',
    'Last Name',
    'Email',
    'Country Code',
    'Phone',
    'Organisation',
    'Course Interest',
    'Enquiring For',
    'Looking to Achieve',
    'Message',
    'Enquiry Type',
  ];

  // Whitelist fields to prevent arbitrary Airtable writes
  const fields = {};
  for (const key of allowedFields) {
    if (req.body[key] !== undefined && req.body[key] !== '') {
      fields[key] = String(req.body[key]).slice(0, 2000);
    }
  }

  if (!fields['First Name'] || !fields['Last Name'] || !fields['Email']) {
    return res.status(400).json({ error: 'First Name, Last Name, and Email are required.' });
  }

  try {
    const airtableRes = await fetch(
      'https://api.airtable.com/v0/appg1GFOdlB2WdEVF/Mellone%20Leads',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields }),
      }
    );

    if (!airtableRes.ok) {
      const data = await airtableRes.json().catch(() => ({}));
      return res.status(airtableRes.status).json({
        error: data.error?.message || 'Airtable error',
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
