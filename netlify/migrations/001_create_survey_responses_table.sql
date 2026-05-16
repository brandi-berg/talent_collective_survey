CREATE TABLE IF NOT EXISTS survey_responses (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  q1_interest TEXT,
  q2_fluency INTEGER CHECK (q2_fluency >= 1 AND q2_fluency <= 5),
  q3_areas TEXT,
  q4_company_position INTEGER CHECK (q4_company_position >= 1 AND q4_company_position <= 5),
  q5_notes TEXT,
  ip_address TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_email ON survey_responses(email);
CREATE INDEX IF NOT EXISTS idx_submitted_at ON survey_responses(submitted_at);
