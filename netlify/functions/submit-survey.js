import { getDatabase } from "@netlify/database";

export default async (req) => {
  if (req.method !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const {
      email,
      q1_interest,
      q2_fluency,
      q3_areas,
      q4_company_position,
      q5_notes,
    } = JSON.parse(req.body);

    if (!email || !email.includes("@")) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid email address" }),
      };
    }

    const fluency = parseInt(q2_fluency);
    if (isNaN(fluency) || fluency < 1 || fluency > 5) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid AI fluency level" }),
      };
    }

    const position = parseInt(q4_company_position);
    if (isNaN(position) || position < 1 || position > 5) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid company AI position" }),
      };
    }

    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.headers["x-real-ip"] ||
      "unknown";

    const db = getDatabase();

    await db.sql`
      INSERT INTO survey_responses (
        email,
        q1_interest,
        q2_fluency,
        q3_areas,
        q4_company_position,
        q5_notes,
        ip_address
      ) VALUES (
        ${email.toLowerCase().trim()},
        ${q1_interest || null},
        ${fluency},
        ${q3_areas || null},
        ${position},
        ${q5_notes || null},
        ${ipAddress}
      )
    `;

    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: true,
        message: "Survey submitted successfully!",
      }),
    };
  } catch (error) {
    if (error.message.includes("unique constraint")) {
      return {
        statusCode: 409,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "This email has already submitted the survey. One response per person, please!",
        }),
      };
    }

    console.error("Survey submission error:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Server error. Please try again later.",
      }),
    };
  }
};
