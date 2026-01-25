export async function gql(query, variables = {}) {
  const res = await fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  if (json.errors?.length) {
    throw new Error(json.errors.map(e => e.message).join('\n'));
  }

  return json.data;
}
