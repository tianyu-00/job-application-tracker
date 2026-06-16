import sql from "./client.js";

export async function insertApplication(data) {
  const {
    url,
    title = null,
    company = null,
    location = null,
    description = null,
    salary = null,
    employment_type = null,
    applied_at = null,
    work_type = null,
  } = data;

  const [row] = await sql`
    INSERT INTO applications (
      url,
      title,
      company,
      location,
      description,
      salary,
      employment_type,
      applied_at,
      work_type
    )
    VALUES (
      ${url},
      ${title},
      ${company},
      ${location},
      ${description},
      ${salary},
      ${employment_type},
      ${applied_at ?? sql`NOW()`},
      ${work_type}
    )
    RETURNING *
  `;

  return row;
}

export async function getAllApplications({ page = 1, limit = 20, search = "" } = {}) {
  const offset = (page - 1) * limit;

  const applications = await sql`
    SELECT * FROM applications
    WHERE ${search} = '' OR
      title ILIKE ${"%" + search + "%"} OR
      company ILIKE ${"%" + search + "%"} OR
      location ILIKE ${"%" + search + "%"}
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const [{ count }] = await sql`
    SELECT COUNT(*) FROM applications
    WHERE ${search} = '' OR
      title ILIKE ${"%" + search + "%"} OR
      company ILIKE ${"%" + search + "%"} OR
      location ILIKE ${"%" + search + "%"}
  `;

  return {
    data: applications,
    total: parseInt(count),
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(count / limit)),
  };
}

export async function updateApplication(id, data) {
  const { title, company, location, description, salary, employment_type, work_type, status, applied_at } = data;

  const [row] = await sql`
    UPDATE applications
    SET
      title = ${title},
      company = ${company},
      location = ${location},
      description = ${description},
      salary = ${salary},
      employment_type = ${employment_type},
      work_type = ${work_type},
      status = ${status},
      applied_at = ${applied_at},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;

  return row;
}

export async function deleteApplication(id) {
  const [row] = await sql`
    DELETE FROM applications
    WHERE id = ${id}
    RETURNING *
  `;

  return row;
}
